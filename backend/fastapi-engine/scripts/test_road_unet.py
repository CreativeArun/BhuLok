import numpy as np
import keras
from PIL import Image

MODEL_PATH = "/home/arun-kumar/.cache/huggingface/hub/models--spectrewolf8--aerial-image-road-segmentation-with-U-NET-xp/snapshots/2664315d5841864207ff739081c4ead81e2d54d9/aerial-image-road-segmentation-xp.keras"
IMAGE_PATH = "storage/uploads/drone_test.jpg"
OUTPUT_PATH = "storage/models/unet_road_mask.png"

model = keras.models.load_model(MODEL_PATH, compile=False)

image = Image.open(IMAGE_PATH).convert("RGB")
original_size = image.size

# Model expects 256x256 RGB input
input_image = image.resize((256, 256))
x = np.asarray(input_image, dtype=np.float32) / 255.0
x = np.expand_dims(x, axis=0)

print("Original image:", original_size)
print("Model input:", x.shape)

prediction = model.predict(x, verbose=0)[0, :, :, 0]

print("Prediction min:", float(prediction.min()))
print("Prediction max:", float(prediction.max()))
print("Prediction mean:", float(prediction.mean()))

# Threshold
mask_small = (prediction >= 0.5).astype(np.uint8) * 255

# Resize mask back to original image dimensions
mask = Image.fromarray(mask_small).resize(
    original_size,
    Image.Resampling.NEAREST
)

mask.save(OUTPUT_PATH)

mask_array = np.asarray(mask)

print("Road pixels:", int((mask_array > 0).sum()))
print(
    "Road percentage:",
    round(float((mask_array > 0).mean() * 100), 2),
    "%"
)
print("Saved:", OUTPUT_PATH)
