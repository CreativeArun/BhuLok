import numpy as np
import torch
from PIL import Image

from transformers import SegformerForSemanticSegmentation

MODEL_NAME = "jgerbscheid/segformer_b1-nlver_finetuned-1024-1024"
IMAGE_PATH = "storage/uploads/drone_test.jpg"
OUTPUT_DIR = "storage/models"

ROAD_CLASS = 3
BUILDING_CLASS = 2

print("Loading model...")
model = SegformerForSemanticSegmentation.from_pretrained(MODEL_NAME)
model.eval()

image = Image.open(IMAGE_PATH).convert("RGB")
original_size = image.size
print("Original image:", original_size)

# Model input
input_image = image.resize((1024, 1024))
array = np.asarray(input_image).astype(np.float32) / 255.0

# ImageNet normalization
mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
std = np.array([0.229, 0.224, 0.225], dtype=np.float32)

array = (array - mean) / std

tensor = torch.from_numpy(array).permute(2, 0, 1).unsqueeze(0)

print("Running inference...")

with torch.no_grad():
    outputs = model(pixel_values=tensor)

logits = torch.nn.functional.interpolate(
    outputs.logits,
    size=(original_size[1], original_size[0]),
    mode="bilinear",
    align_corners=False,
)

prediction = logits.argmax(dim=1)[0].cpu().numpy()

road_mask = (prediction == ROAD_CLASS).astype(np.uint8) * 255
building_mask = (prediction == BUILDING_CLASS).astype(np.uint8) * 255

# Save masks
Image.fromarray(road_mask).save(
    f"{OUTPUT_DIR}/aerial_road_mask.png"
)

Image.fromarray(building_mask).save(
    f"{OUTPUT_DIR}/aerial_building_mask.png"
)

# Create overlay
original = np.asarray(image).copy()
overlay = original.copy()

# Road = white
overlay[road_mask > 0] = [255, 255, 255]

# Building = red
overlay[building_mask > 0] = [255, 0, 0]

# Blend
result = (
    original.astype(np.float32) * 0.55
    + overlay.astype(np.float32) * 0.45
).clip(0, 255).astype(np.uint8)

Image.fromarray(result).save(
    f"{OUTPUT_DIR}/aerial_overlay.png"
)

# Statistics
total_pixels = prediction.size
road_pixels = int((prediction == ROAD_CLASS).sum())
building_pixels = int((prediction == BUILDING_CLASS).sum())

print()
print("===== RESULTS =====")
print(f"Total pixels:    {total_pixels:,}")
print(f"Road pixels:     {road_pixels:,} ({road_pixels / total_pixels * 100:.2f}%)")
print(f"Building pixels: {building_pixels:,} ({building_pixels / total_pixels * 100:.2f}%)")
print()
print("Generated:")
print("  storage/models/aerial_road_mask.png")
print("  storage/models/aerial_building_mask.png")
print("  storage/models/aerial_overlay.png")
