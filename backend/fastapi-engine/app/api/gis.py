from fastapi import APIRouter, HTTPException

from app.gis.geojson import cadastral_to_geojson
from app.schemas.gis import CadastralGeoJSONRequest


router = APIRouter(
    prefix="/api/v1/ai/gis",
    tags=["GIS"],
)


@router.post("/cadastral-geojson")
def generate_cadastral_geojson(
    request: CadastralGeoJSONRequest,
):
    try:
        enriched_properties = []

        for property_record in request.properties:
            record = {
                **property_record,
                "buildingId": request.buildingId,
            }
            enriched_properties.append(record)

        return cadastral_to_geojson(
            properties=enriched_properties,
            geometry_crs=request.geometryCRS,
        )

    except (KeyError, ValueError, TypeError) as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


@router.post("/dem")
def generate_dem_endpoint(
    points: list[list[float]],
    resolution: float = 1.0,
    aggregation: str = "min",
):
    from app.gis.dem import generate_dem

    try:
        return generate_dem(
            points=points,
            resolution=resolution,
            aggregation=aggregation,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.post("/dsm")
def generate_dsm_endpoint(
    points: list[list[float]],
    resolution: float = 1.0,
):
    from app.gis.dsm import generate_dsm

    try:
        return generate_dsm(
            points=points,
            resolution=resolution,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.post("/lidar/analyze")
def analyze_lidar_endpoint(
    points: list[list[float]],
    groundThreshold: float = 0.5,
):
    from app.gis.lidar import analyze_lidar_points

    try:
        return analyze_lidar_points(
            points=points,
            ground_threshold=groundThreshold,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.post("/georeference")
def georeference_endpoint(
    points: list[list[float]],
    sourceCRS: str,
    targetCRS: str,
):
    from app.gis.georeference import georeference_points

    try:
        return georeference_points(
            points=points,
            source_crs=sourceCRS,
            target_crs=targetCRS,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
