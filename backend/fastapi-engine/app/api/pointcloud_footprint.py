from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.core.storage import POINTCLOUD_DIR
from app.pointcloud.loader import load_point_cloud, get_point_cloud_statistics
from app.pointcloud.segmentation import segment_ground
from app.pointcloud.footprint import extract_footprints


router = APIRouter(
    prefix="/api/v1/ai/pointcloud",
    tags=["Point Cloud Footprints"],
)

ALLOWED_TYPES = {".las", ".laz", ".ply", ".pcd"}


@router.post("/footprints")
async def extract_pointcloud_footprints(
    file: UploadFile = File(...),
    resolution: float = 0.2,
    minArea: float = 2.0,
    groundThreshold: float = 0.2,
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

        input_stats = get_point_cloud_statistics(point_cloud)

        segmentation = segment_ground(
            point_cloud,
            distance_threshold=groundThreshold,
        )

        ground_cloud = segmentation["ground"]
        non_ground_cloud = segmentation["nonGround"]

        footprints = extract_footprints(
            non_ground_cloud,
            resolution=resolution,
            min_area=minArea,
        )

        return {
            "success": True,
            "data": {
                "input": input_stats,
                "groundPointCount": len(ground_cloud.points),
                "nonGroundPointCount": len(non_ground_cloud.points),
                "footprintCount": len(footprints),
                "footprints": footprints,
                "parameters": {
                    "resolution": resolution,
                    "minArea": minArea,
                    "groundThreshold": groundThreshold,
                },
            },
            "error": None,
        }

    except (ValueError, FileNotFoundError, RuntimeError) as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    finally:
        input_path.unlink(missing_ok=True)
