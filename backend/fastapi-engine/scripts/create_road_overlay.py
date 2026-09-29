import numpy as np
from PIL import Image

IMAGE_PATH = "storage/uploads/drone_test.jpg"
MASK_PATH = "storage/models/unet_road_mask.png"
OUTPUT_PATH = "storage/models/unet_road_overlay.png"

image = Image.open(IMAGE_PATH).convert("RGB")
mask = Image.open(MASK_PATH).convert("L")

image_array = np.asarray(image).astype(np.float32)
mask_array = np.asarray(mask) > 0

overlay = image_array.copy()

# Highlight detected road pixels
overlay[mask_array] = [255, 0, 0]

result = (
    image_array * 0.65 +
    overlay * 0.35
).clip(0, 255).astype(np.uint8)

Image.fromarray(result).save(OUTPUT_PATH)

print("Original:", image.size)
print("Mask:", mask.size)
print("Overlay saved:", OUTPUT_PATH)
