import io

from fastapi import APIRouter, File, HTTPException, UploadFile
from PIL import Image

from app.ml.floor_detection import detect_floors
from app.schemas.floor import FloorDetectionResult


router = APIRouter(
    prefix="/api/v1/ai/floors",
    tags=["Floor Detection"],
)


@router.post(
    "/detect",
    response_model=FloorDetectionResult,
)
async def detect_building_floors(
    file: UploadFile = File(...),
):
    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    if file.content_type not in allowed_types:
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

    floors = detect_floors(image)

    if not floors:
        return FloorDetectionResult(
            success=False,
            imageWidth=image.width,
            imageHeight=image.height,
            floorCount=0,
            floors=[],
            method="HORIZONTAL_EDGE_ANALYSIS",
            confidence=0.0,
            error="No reliable floor bands detected",
        )

    confidence = sum(
        floor["confidence"] for floor in floors
    ) / len(floors)

    return FloorDetectionResult(
        success=True,
        imageWidth=image.width,
        imageHeight=image.height,
        floorCount=len(floors),
        floors=floors,
        method="HORIZONTAL_EDGE_ANALYSIS",
        confidence=round(confidence, 3),
    )
