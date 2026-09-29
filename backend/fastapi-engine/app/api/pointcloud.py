from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.core.storage import POINTCLOUD_DIR
from app.pointcloud.loader import (
    get_point_cloud_statistics,
    load_point_cloud,
)
from app.pointcloud.processing import (
    remove_statistical_outliers,
    voxel_downsample,
)
from app.pointcloud.storage import save_point_cloud


router = APIRouter(
    prefix="/api/v1/ai/pointcloud",
    tags=["Point Cloud Processing"],
)

ALLOWED_TYPES = {
    ".las",
    ".laz",
    ".ply",
    ".pcd",
}


@router.post("/process")
async def process_point_cloud(
    file: UploadFile = File(...),
    voxelSize: float = 0.1,
    neighbors: int = 20,
    stdRatio: float = 2.0,
):
    extension = Path(file.filename or "").suffix.lower()

    if extension not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported point cloud format: {extension}",
        )

    if voxelSize <= 0:
        raise HTTPException(
            status_code=400,
            detail="voxelSize must be greater than zero",
        )

    if neighbors < 2:
        raise HTTPException(
            status_code=400,
            detail="neighbors must be at least 2",
        )

    if stdRatio <= 0:
        raise HTTPException(
            status_code=400,
            detail="stdRatio must be greater than zero",
        )

    contents = await file.read()

    if not contents:
        raise HTTPException(
            status_code=400,
            detail="Empty point cloud file",
        )

    input_filename = f"{uuid4()}{extension}"
    input_path = POINTCLOUD_DIR / input_filename

    input_path.write_bytes(contents)

    try:
        point_cloud = load_point_cloud(str(input_path))

        input_stats = get_point_cloud_statistics(point_cloud)

        downsampled = voxel_downsample(
            point_cloud,
            voxel_size=voxelSize,
        )

        cleaned, _ = remove_statistical_outliers(
            downsampled,
            neighbors=neighbors,
            std_ratio=stdRatio,
        )

        output_filename = f"{uuid4()}.ply"
        output_path = save_point_cloud(
            cleaned,
            output_filename,
        )

        output_stats = get_point_cloud_statistics(cleaned)

        return {
            "success": True,
            "data": {
                "input": input_stats,
                "output": output_stats,
                "parameters": {
                    "voxelSize": voxelSize,
                    "neighbors": neighbors,
                    "stdRatio": stdRatio,
                },
                "outputFile": Path(output_path).name,
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
