from typing import List
from pydantic import BaseModel, Field


class FloorLevel(BaseModel):
    floorNumber: int
    yTop: int
    yBottom: int
    pixelHeight: int
    confidence: float = Field(ge=0.0, le=1.0)


class FloorDetectionResult(BaseModel):
    success: bool
    imageWidth: int
    imageHeight: int
    floorCount: int
    floors: List[FloorLevel]
    method: str
    confidence: float = Field(ge=0.0, le=1.0)
    error: str | None = None
