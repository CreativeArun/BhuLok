import cv2
import numpy as np
import onnxruntime as ort
from PIL import Image

MODEL = "storage/models/dinov3s-buildings/model.onnx"
IMAGE = "storage/uploads/drone_test.jpg"

session = ort.InferenceSession(
    MODEL,
    providers=["CPUExecutionProvider"]
)

image = np.array(Image.open(IMAGE).convert("RGB"))
height, width = image.shape[:2]

print("Image:", width, "x", height)

window = 256
stride = 192

class_counts = np.zeros(3, dtype=np.int64)

# Store the winning class for every pixel.
votes = np.zeros((3, height, width), dtype=np.uint16)

for y in range(0, height, stride):
    for x in range(0, width, stride):

        crop = image[
            y:min(y + window, height),
            x:min(x + window, width)
        ]

        crop_h, crop_w = crop.shape[:2]

        if crop_h != window or crop_w != window:
            padded = np.zeros((window, window, 3), dtype=np.uint8)
            padded[:crop_h, :crop_w] = crop
            crop = padded

        crop = crop.astype(np.float32) / 255.0
        crop = np.transpose(crop, (2, 0, 1))
        crop = crop[None, ...]

        logits = session.run(
            ["logits"],
            {"image": crop}
        )[0][0]

        prediction = np.argmax(logits, axis=0)

        prediction = prediction[:crop_h, :crop_w]

        for cls in range(3):
            region = prediction == cls
            votes[
                cls,
                y:y + crop_h,
                x:x + crop_w
            ][region] += 1

        print(f"processed x={x}, y={y}")

final_prediction = np.argmax(votes, axis=0)

for cls in range(3):
    count = int((final_prediction == cls).sum())
    class_counts[cls] = count

print("\nFINAL CLASS COUNTS")
for cls in range(3):
    percentage = class_counts[cls] / (width * height) * 100
    print(
        f"class {cls}: "
        f"{class_counts[cls]} pixels "
        f"({percentage:.2f}%)"
    )

# Save each class separately for visual inspection.
for cls in range(3):
    mask = (final_prediction == cls).astype(np.uint8) * 255
    cv2.imwrite(
        f"storage/models/dinov3s-class-{cls}.png",
        mask
    )

# Combined visualization.
visual = image.copy()

# Red/green/blue are intentionally used only for this diagnostic image.
visual[final_prediction == 0] = [255, 0, 0]
visual[final_prediction == 1] = [0, 255, 0]
visual[final_prediction == 2] = [0, 0, 255]

overlay = cv2.addWeighted(image, 0.55, visual, 0.45, 0)

cv2.imwrite(
    "storage/models/dinov3s-class-overlay.jpg",
    cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR)
)

print("\nSaved:")
print("storage/models/dinov3s-class-0.png")
print("storage/models/dinov3s-class-1.png")
print("storage/models/dinov3s-class-2.png")
print("storage/models/dinov3s-class-overlay.jpg")

