from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.core.storage import POINTCLOUD_DIR
from app.pointcloud.loader import load_point_cloud
from app.pointcloud.segmentation import segment_ground
from app.pointcloud.footprint import extract_footprints
from app.pointcloud.floors import detect_pointcloud_floors
from app.geometry.parcel import generate_variable_parcel_volumes
from app.ulpin.service import assign_ulpins
from app.ulpin.cadastral import build_cadastral_collection
from app.geometry.coordinate import validate_crs
from app.schemas.geometry import (
    PointCloudParcelRequest,
    PointCloudParcelResponse,
)


router = APIRouter(
    prefix="/api/v1/ai/pointcloud",
    tags=["Point Cloud Parcel Pipeline"],
)


ALLOWED_TYPES = {".las", ".laz", ".ply", ".pcd"}


@router.post(
    "/auto-parcels",
    response_model=PointCloudParcelResponse,
)
async def generate_auto_parcels(
    file: UploadFile = File(...),
    floorMinHeight: float = Form(2.0),
    floorMaxHeight: float = Form(6.0),
    normalRadius: float = Form(0.4),
    maxNN: int = Form(30),
    normalThreshold: float = Form(0.9),
    zBinSize: float = Form(0.1),
    resolution: float = Form(0.2),
    minArea: float = Form(2.0),
    rows: int = Form(1),
    columns: int = Form(1),
    groundThreshold: float = Form(0.2),
    baseZ: float = Form(0.0),
    sourceCRS: str | None = Form(None),
    geometryCRS: str | None = Form(None),
):
    request = PointCloudParcelRequest(
        floorMinHeight=floorMinHeight,
        floorMaxHeight=floorMaxHeight,
        normalRadius=normalRadius,
        maxNN=maxNN,
        normalThreshold=normalThreshold,
        zBinSize=zBinSize,
        resolution=resolution,
        minArea=minArea,
        rows=rows,
        columns=columns,
        groundThreshold=groundThreshold,
        baseZ=baseZ,
    )

    try:
        sourceCRS = validate_crs(sourceCRS) if sourceCRS else None
        geometryCRS = validate_crs(geometryCRS) if geometryCRS else None
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    extension = Path(file.filename or "").suffix.lower()

    if extension not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported point cloud format: {extension}",
        )

    if request.floorMaxHeight < request.floorMinHeight:
        raise HTTPException(
            status_code=400,
            detail="floorMaxHeight must be greater than or equal to floorMinHeight",
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

        # 1. Separate ground and building points.
        segmentation = segment_ground(
            point_cloud,
            distance_threshold=request.groundThreshold,
        )

        non_ground = segmentation["nonGround"]

        # 2. Extract building footprints.
        footprints = extract_footprints(
            non_ground,
            resolution=request.resolution,
            min_area=request.minArea,
            rectangularize=True,
        )

        if not footprints:
            raise ValueError(
                "No building footprints could be extracted"
            )

        # 3. Detect floor levels from the complete point cloud.
        floor_result = detect_pointcloud_floors(
            point_cloud,
            base_z=request.baseZ,
            min_floor_height=request.floorMinHeight,
            max_floor_height=request.floorMaxHeight,
            normal_radius=request.normalRadius,
            max_nn=request.maxNN,
            normal_threshold=request.normalThreshold,
            z_bin_size=request.zBinSize,
        )

        if floor_result["floorCount"] < 1:
            raise ValueError(
                "No building floors could be detected"
            )

        floor_count = floor_result["floorCount"]
        floor_levels = floor_result["floors"]

        # 4. Generate vertical parcel volumes using
        # the actual detected floor Z boundaries.
        buildings = []

        for building_number, footprint_data in enumerate(
            footprints,
            start=1,
        ):
            parcel_result = generate_variable_parcel_volumes(
                polygon=[
                    tuple(point)
                    for point in footprint_data["polygon"]
                ],
                floor_levels=floor_levels,
                rows=request.rows,
                columns=request.columns,
            )

            ulpin_units = assign_ulpins(
                building_id=f"building-{building_number}",
                units=parcel_result["units"],
            )

            cadastral = build_cadastral_collection(
                building_id=f"building-{building_number}",
                units=ulpin_units,
                source_crs=sourceCRS,
                geometry_crs=geometryCRS,
            )

            buildings.append(
                {
                    "buildingNumber": building_number,
                    "footprintArea": footprint_data["area"],
                    "footprint": footprint_data["polygon"],
                    "floorCount": floor_count,
                    "floorHeights": [floor["floorHeight"] for floor in parcel_result["floors"]],
                    "unitCount": parcel_result["unitCount"],
                    "topZ": parcel_result["topZ"],
                    "units": ulpin_units,
                    "cadastralProperties": cadastral.model_dump(),
                }
            )

        return PointCloudParcelResponse(
            success=True,
            data={
                "pointCount": len(point_cloud.points),
                "groundPointCount": len(
                    segmentation["ground"].points
                ),
                "nonGroundPointCount": len(
                    non_ground.points
                ),
                "buildingCount": len(buildings),
                "floorDetection": floor_result,
                "buildings": buildings,
                "parameters": request.model_dump(),
            },
            error=None,
        )

    except (
        ValueError,
        FileNotFoundError,
        RuntimeError,
    ) as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    finally:
        input_path.unlink(missing_ok=True)
