from fastapi import APIRouter, File, HTTPException, UploadFile
from PIL import Image

from app.ml.building_detection import predict_building_mask
from app.ml.segmentation import clean_mask, extract_contours

import io

router = APIRouter(
    prefix="/api/v1/ai/building",
    tags=["Building Extraction"],
)


@router.post("/extract")
async def extract_building(file: UploadFile = File(...)):
    if file.content_type not in {
        "image/jpeg",
        "image/png",
        "image/webp",
    }:
        raise HTTPException(
            status_code=400,
            detail="Unsupported image type",
        )

    contents = await file.read()

    if not contents:
        raise HTTPException(
            status_code=400,
            detail="Empty image",
        )

    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid image file",
        )

    raw_mask = predict_building_mask(image)

    mask = clean_mask(raw_mask)

    buildings = extract_contours(mask)

    return {
        "success": True,
        "data": {
            "imageWidth": image.width,
            "imageHeight": image.height,
            "buildingCount": len(buildings),
            "buildings": buildings,
        },
        "error": None,
    }
