from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.core.storage import POINTCLOUD_DIR
from app.pointcloud.loader import load_point_cloud
from app.pointcloud.building_model import generate_building_models


router = APIRouter(
    prefix="/api/v1/ai/pointcloud",
    tags=["Point Cloud Building Reconstruction"],
)

ALLOWED_TYPES = {".las", ".laz", ".ply", ".pcd"}


@router.post("/building-model")
async def create_building_models(
    file: UploadFile = File(...),
    resolution: float = 0.2,
    minArea: float = 2.0,
    groundThreshold: float = 0.2,
    minHeight: float = 2.0,
):
    extension = Path(file.filename or "").suffix.lower()

    if extension not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported point cloud format: {extension}",
        )

    if resolution <= 0:
        raise HTTPException(
            status_code=400,
            detail="resolution must be greater than zero",
        )

    if minArea <= 0:
        raise HTTPException(
            status_code=400,
            detail="minArea must be greater than zero",
        )

    if groundThreshold <= 0:
        raise HTTPException(
            status_code=400,
            detail="groundThreshold must be greater than zero",
        )

    if minHeight <= 0:
        raise HTTPException(
            status_code=400,
            detail="minHeight must be greater than zero",
        )

    contents = await file.read()

    if not contents:
        raise HTTPException(
            status_code=400,
            detail="Empty point cloud file",
        )

    input_path = POINTCLOUD_DIR / f"{uuid4()}{extension}"
    input_path.write_bytes(contents)

    try:
        point_cloud = load_point_cloud(str(input_path))

        result = generate_building_models(
            point_cloud=point_cloud,
            resolution=resolution,
            min_area=minArea,
            ground_threshold=groundThreshold,
            min_height=minHeight,
        )

        return {
            "success": True,
            "data": result,
            "error": None,
        }

    except (ValueError, FileNotFoundError, RuntimeError) as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    finally:
        input_path.unlink(missing_ok=True)
