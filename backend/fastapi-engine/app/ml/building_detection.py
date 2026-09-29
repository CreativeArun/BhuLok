import numpy as np
import torch
from PIL import Image
from transformers import AutoImageProcessor, SegformerForSemanticSegmentation

MODEL_NAME = "nvidia/segformer-b0-finetuned-cityscapes-1024-1024"
BUILDING_CLASS_ID = 2

_processor = None
_model = None


def load_model():
    global _processor, _model

    if _processor is None or _model is None:
        _processor = AutoImageProcessor.from_pretrained(MODEL_NAME)
        _model = SegformerForSemanticSegmentation.from_pretrained(MODEL_NAME)
        _model.eval()

    return _processor, _model


def predict_building_mask(image: Image.Image) -> np.ndarray:
    processor, model = load_model()

    image = image.convert("RGB")

    inputs = processor(images=image, return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs)

    logits = torch.nn.functional.interpolate(
        outputs.logits,
        size=(image.height, image.width),
        mode="bilinear",
        align_corners=False,
    )

    prediction = logits.argmax(dim=1)[0].cpu().numpy()

    return (prediction == BUILDING_CLASS_ID).astype(np.uint8)
