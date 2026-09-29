from typing import Any, List

from pydantic import BaseModel, Field


class ParcelValidationRequest(BaseModel):
    buildingPolygon: List[List[float]] = Field(
        min_length=3,
        description="Parent building footprint"
    )
    units: List[dict] = Field(
        min_length=1,
        description="Generated 3D parcel units"
    )


class ParcelValidationResponse(BaseModel):
    valid: bool
    building: dict
    overlap: dict
    containment: dict
    elevation: dict
    error: str | None = None
