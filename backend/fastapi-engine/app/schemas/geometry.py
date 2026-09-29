from typing import List
from pydantic import BaseModel, Field


class Point3D(BaseModel):
    x: float
    y: float
    z: float


class BuildingGeometryRequest(BaseModel):
    polygon: List[List[float]] = Field(
        min_length=3,
        description="2D building footprint as [[x, y], ...]"
    )
    height: float = Field(
        gt=0,
        description="Building height in meters"
    )
    baseZ: float = Field(
        default=0.0,
        description="Base elevation"
    )


class BuildingGeometryResponse(BaseModel):
    success: bool
    data: dict
    error: str | None = None


class FloorVolumeRequest(BaseModel):
    polygon: List[List[float]] = Field(
        min_length=3,
        description="2D building footprint as [[x, y], ...]"
    )
    floorCount: int = Field(
        gt=0,
        description="Number of floors"
    )
    floorHeight: float = Field(
        gt=0,
        description="Height of each floor"
    )
    baseZ: float = Field(
        default=0.0,
        description="Base elevation"
    )


class FloorVolumeResponse(BaseModel):
    success: bool
    data: dict
    error: str | None = None


class UnitVolumeRequest(BaseModel):
    polygon: List[List[float]] = Field(
        min_length=3,
        description="2D building footprint as [[x, y], ...]"
    )
    rows: int = Field(gt=0)
    columns: int = Field(gt=0)
    floorNumber: int = Field(gt=0)
    floorHeight: float = Field(gt=0)
    baseZ: float = Field(default=0.0)


class UnitVolumeResponse(BaseModel):
    success: bool
    data: dict
    error: str | None = None


class ParcelVolumeRequest(BaseModel):
    polygon: List[List[float]] = Field(
        min_length=3,
        description="2D building footprint as [[x, y], ...]"
    )
    floorCount: int = Field(gt=0, description="Number of floors")
    rows: int = Field(gt=0, description="Units per column direction")
    columns: int = Field(gt=0, description="Units per row direction")
    floorHeight: float = Field(gt=0, description="Height of each floor")
    baseZ: float = Field(default=0.0, description="Base elevation")


class ParcelVolumeResponse(BaseModel):
    success: bool
    data: dict
    error: str | None = None

class PointCloudParcelRequest(BaseModel):
    floorMinHeight: float = Field(
        default=2.0,
        gt=0,
        description="Minimum valid floor height in metres",
    )
    floorMaxHeight: float = Field(
        default=6.0,
        gt=0,
        description="Maximum valid floor height in metres",
    )
    normalRadius: float = Field(
        default=0.4,
        gt=0,
        description="Neighbourhood radius for point-cloud normal estimation",
    )
    maxNN: int = Field(
        default=30,
        ge=3,
        description="Maximum neighbours for normal estimation",
    )
    normalThreshold: float = Field(
        default=0.9,
        gt=0,
        le=1,
        description="Horizontal-surface normal threshold",
    )
    zBinSize: float = Field(
        default=0.1,
        gt=0,
        description="Z histogram bin size in metres",
    )
    resolution: float = Field(
        default=0.2,
        gt=0,
        description="XY footprint raster resolution in metres",
    )
    minArea: float = Field(
        default=2.0,
        gt=0,
        description="Minimum building footprint area in square metres",
    )
    rows: int = Field(
        default=1,
        gt=0,
        description="Number of parcel rows per floor",
    )
    columns: int = Field(
        default=1,
        gt=0,
        description="Number of parcel columns per floor",
    )
    groundThreshold: float = Field(
        default=0.2,
        gt=0,
        description="Ground-plane RANSAC distance threshold",
    )
    baseZ: float = Field(
        default=0.0,
        description="Building base elevation",
    )


class PointCloudParcelResponse(BaseModel):
    success: bool
    data: dict
    error: str | None = None
