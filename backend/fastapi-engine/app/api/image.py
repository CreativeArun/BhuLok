from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile
from PIL import Image

from app.core.storage import UPLOAD_DIR
from app.schemas.reconstruction import ImageAnalysisResult


router = APIRouter(
    prefix="/api/v1/ai/images",
    tags=["Image Analysis"]
)


ALLOWED_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}


@router.post(
    "/analyze",
    response_model=ImageAnalysisResult
)
async def analyze_image(
    file: UploadFile = File(...)
):
    """
    Upload and inspect an image.

    This is the first stage of the GeoULPIN
    image processing pipeline.
    """

    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Unsupported image type"
        )

    image_id = str(uuid4())

    extension = Path(
        file.filename or "image.jpg"
    ).suffix.lower()

    if not extension:
        extension = ".jpg"

    filename = f"{image_id}{extension}"

    output_path = UPLOAD_DIR / filename

    contents = await file.read()

    if not contents:
        raise HTTPException(
            status_code=400,
            detail="Empty image"
        )

    with open(output_path, "wb") as image_file:
        image_file.write(contents)

    try:
        with Image.open(output_path) as image:
            width, height = image.size
    except Exception:
        output_path.unlink(missing_ok=True)

        raise HTTPException(
            status_code=400,
            detail="Invalid image file"
        )

    return ImageAnalysisResult(
        imageId=image_id,
        filename=filename,
        width=width,
        height=height,
        contentType=file.content_type
    )