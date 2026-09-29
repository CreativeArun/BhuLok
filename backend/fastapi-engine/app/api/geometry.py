from uuid import uuid4

from fastapi import APIRouter, HTTPException

from app.geometry.extrusion import extrude_polygon
from app.geometry.volume import generate_floor_volumes
from app.geometry.subdivision import generate_unit_volumes
from app.geometry.parcel import generate_parcel_volumes
from app.reconstruction.mesh import export_glb
from app.schemas.geometry import (
    BuildingGeometryRequest,
    BuildingGeometryResponse,
    FloorVolumeRequest,
    FloorVolumeResponse,
    UnitVolumeRequest,
    UnitVolumeResponse,
    ParcelVolumeRequest,
    ParcelVolumeResponse,
)


router = APIRouter(
    prefix="/api/v1/ai/geometry",
    tags=["3D Geometry"],
)


@router.post(
    "/extrude-building",
    response_model=BuildingGeometryResponse,
)
def extrude_building(request: BuildingGeometryRequest):
    try:
        polygon = [tuple(point) for point in request.polygon]

        geometry = extrude_polygon(
            polygon=polygon,
            height=request.height,
            base_z=request.baseZ,
        )

        return BuildingGeometryResponse(
            success=True,
            data={
                "type": "BuildingSolid",
                "vertexCount": len(geometry["vertices"]),
                "faceCount": len(geometry["faces"]),
                "height": geometry["height"],
                "baseZ": geometry["baseZ"],
                "vertices": geometry["vertices"],
                "faces": geometry["faces"],
            },
            error=None,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


@router.post("/export-building-glb")
def export_building_glb(request: BuildingGeometryRequest):
    try:
        polygon = [tuple(point) for point in request.polygon]

        geometry = extrude_polygon(
            polygon=polygon,
            height=request.height,
            base_z=request.baseZ,
        )

        building_id = str(uuid4())
        output_path = f"storage/meshes/{building_id}.glb"

        export_glb(
            vertices=geometry["vertices"],
            faces=geometry["faces"],
            output_path=output_path,
        )

        return {
            "success": True,
            "data": {
                "buildingId": building_id,
                "type": "BuildingGLB",
                "height": geometry["height"],
                "baseZ": geometry["baseZ"],
                "vertexCount": len(geometry["vertices"]),
                "faceCount": len(geometry["faces"]),
                "glbPath": output_path,
            },
            "error": None,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


@router.post(
    "/floor-volumes",
    response_model=FloorVolumeResponse,
)
def create_floor_volumes(request: FloorVolumeRequest):
    try:
        polygon = [tuple(point) for point in request.polygon]

        result = generate_floor_volumes(
            polygon=polygon,
            floor_count=request.floorCount,
            floor_height=request.floorHeight,
            base_z=request.baseZ,
        )

        return FloorVolumeResponse(
            success=True,
            data=result,
            error=None,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


@router.post(
    "/unit-volumes",
    response_model=UnitVolumeResponse,
)
def create_unit_volumes(request: UnitVolumeRequest):
    try:
        polygon = [tuple(point) for point in request.polygon]

        result = generate_unit_volumes(
            polygon=polygon,
            rows=request.rows,
            columns=request.columns,
            base_z=request.baseZ,
            floor_height=request.floorHeight,
            floor_number=request.floorNumber,
        )

        return UnitVolumeResponse(
            success=True,
            data=result,
            error=None,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


@router.post("/parcel-volumes", response_model=ParcelVolumeResponse)
def create_parcel_volumes(request: ParcelVolumeRequest):
    try:
        polygon = [tuple(point) for point in request.polygon]

        result = generate_parcel_volumes(
            polygon=polygon,
            floor_count=request.floorCount,
            rows=request.rows,
            columns=request.columns,
            floor_height=request.floorHeight,
            base_z=request.baseZ,
        )

        return ParcelVolumeResponse(
            success=True,
            data=result,
            error=None,
        )

    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
