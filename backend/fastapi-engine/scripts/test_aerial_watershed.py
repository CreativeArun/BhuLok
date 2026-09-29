from pathlib import Path

import cv2
import numpy as np
from PIL import Image


MASK_PATH = Path("storage/models/aerial_building_filtered.png")
OUTPUT_PATH = Path("storage/models/aerial_building_watershed.png")


mask = np.array(Image.open(MASK_PATH).convert("L"))
binary = (mask > 0).astype(np.uint8)

# Remove tiny gaps/noise while preserving building structures.
kernel = np.ones((7, 7), np.uint8)
clean = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)

# Distance from every foreground pixel to the nearest background pixel.
distance = cv2.distanceTransform(clean, cv2.DIST_L2, 5)

# Identify likely building interiors.
_, sure_foreground = cv2.threshold(
    distance,
    0.35 * distance.max(),
    255,
    cv2.THRESH_BINARY,
)

sure_foreground = np.uint8(sure_foreground)

# Identify definite background.
sure_background = cv2.dilate(clean, kernel, iterations=3)

# Unknown region = boundary between foreground/background.
unknown = sure_background - sure_foreground

# Label foreground seeds.
num_labels, markers = cv2.connectedComponents(sure_foreground)

# Reserve 0 for background and shift object labels.
markers = markers + 1

# Mark unknown region as 0 for watershed.
markers[unknown == 1] = 0

# Watershed requires a 3-channel image.
image = cv2.cvtColor(
    cv2.normalize(mask, None, 0, 255, cv2.NORM_MINMAX),
    cv2.COLOR_GRAY2BGR,
)

markers = cv2.watershed(image, markers)

# Every positive watershed region becomes a separate candidate.
output = np.zeros_like(mask)

for label in np.unique(markers):
    if label <= 1:
        continue

    region = np.uint8(markers == label) * 255

    area = cv2.countNonZero(region)

    if area < 500:
        continue

    output[region > 0] = 255

Image.fromarray(output).save(OUTPUT_PATH)

print("saved:", OUTPUT_PATH)
print("original foreground:", int(np.count_nonzero(binary)))
print("watershed foreground:", int(np.count_nonzero(output)))
print("watershed regions:", len([x for x in np.unique(markers) if x > 1]))
