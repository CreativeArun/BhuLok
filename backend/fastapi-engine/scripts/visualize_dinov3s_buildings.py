import cv2
import numpy as np
from PIL import Image

IMAGE = "storage/uploads/drone_test.jpg"
MASK = "storage/models/dinov3s-building-mask.png"
OUTPUT = "storage/models/dinov3s-building-candidates.jpg"

image = cv2.imread(IMAGE)
mask = np.array(Image.open(MASK).convert("L"))

binary = (mask > 0).astype(np.uint8) * 255

# Same basic cleanup used by the extractor
kernel = np.ones((5, 5), np.uint8)
binary = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)
binary = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)

contours, _ = cv2.findContours(
    binary,
    cv2.RETR_EXTERNAL,
    cv2.CHAIN_APPROX_SIMPLE
)

h, w = binary.shape
max_area = h * w * 0.05

count = 0

for contour in contours:
    area = cv2.contourArea(contour)

    if area < 1000 or area > max_area:
        continue

    x, y, cw, ch = cv2.boundingRect(contour)

    # Ignore image-edge candidates
    if x <= 0 or y <= 0 or x + cw >= w - 1 or y + ch >= h - 1:
        continue

    perimeter = cv2.arcLength(contour, True)

    if perimeter == 0:
        continue

    polygon = cv2.approxPolyDP(
        contour,
        0.01 * perimeter,
        True
    )

    if len(polygon) < 3:
        continue

    count += 1

    cv2.polylines(
        image,
        [polygon],
        True,
        (0, 255, 0),
        3
    )

    bx, by, bw, bh = cv2.boundingRect(polygon)

    cv2.putText(
        image,
        str(count),
        (bx, max(25, by - 5)),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.8,
        (0, 255, 255),
        2
    )

print("Candidates:", count)

cv2.imwrite(OUTPUT, image)

print("Saved:", OUTPUT)

