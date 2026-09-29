from pydantic import BaseModel, Field


class CadastralGeoJSONRequest(BaseModel):
    buildingId: str = Field(min_length=1)
    properties: list[dict] = Field(min_length=1)
    geometryCRS: str | None = None
