from typing import List

from pydantic import BaseModel, Field


class CadastralPropertyRecord(BaseModel):
    ulpin: str = Field(
        description="BhuLok prototype 3D property identifier"
    )
    buildingId: str
    floorNumber: int = Field(gt=0)
    unitNumber: int = Field(gt=0)
    row: int = Field(gt=0)
    column: int = Field(gt=0)

    footprint: List[List[float]] = Field(
        min_length=3,
        description="2D unit footprint"
    )

    area: float = Field(gt=0)
    baseZ: float
    topZ: float
    floorHeight: float = Field(gt=0)
    volume: float = Field(gt=0)

    geometryHash: str = Field(
        min_length=64,
        max_length=64,
    )

    geometryValid: bool
    validationStatus: str


class CadastralPropertyCollection(BaseModel):
    buildingId: str
    sourceCRS: str | None = None
    geometryCRS: str | None = None
    propertyCount: int = Field(ge=0)
    properties: List[CadastralPropertyRecord]
    valid: bool
