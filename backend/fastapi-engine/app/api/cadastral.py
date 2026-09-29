from fastapi import APIRouter, HTTPException

from app.schemas.cadastral import CadastralPropertyCollection
from app.ulpin.cadastral import build_cadastral_collection


router = APIRouter(
    prefix="/api/v1/ai/cadastral",
    tags=["Cadastral"],
)


@router.post(
    "/properties",
    response_model=CadastralPropertyCollection,
)
def create_cadastral_properties(
    building_id: str,
    units: list[dict],
):
    try:
        return build_cadastral_collection(
            building_id=building_id,
            units=units,
        )

    except (ValueError, KeyError, TypeError) as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )
