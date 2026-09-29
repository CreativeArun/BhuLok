from fastapi import APIRouter, HTTPException

from app.schemas.validation import (
    ParcelValidationRequest,
    ParcelValidationResponse,
)
from app.validation.topology import validate_parcel_topology


router = APIRouter(
    prefix="/api/v1/ai/validation",
    tags=["Geometry Validation"],
)


@router.post(
    "/parcel",
    response_model=ParcelValidationResponse,
)
def validate_parcel(request: ParcelValidationRequest):
    try:
        result = validate_parcel_topology(
            building_polygon=request.buildingPolygon,
            units=request.units,
        )

        return ParcelValidationResponse(
            **result,
            error=None,
        )

    except (ValueError, KeyError) as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )
