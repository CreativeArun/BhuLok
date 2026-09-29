from app.schemas.cadastral import (
    CadastralPropertyCollection,
    CadastralPropertyRecord,
)
from app.validation.geometry import validate_polygon
from app.ulpin.validation import validate_ulpin_record


def build_cadastral_record(
    building_id: str,
    unit: dict,
) -> CadastralPropertyRecord:

    polygon = [
        tuple(point)
        for point in unit["polygon"]
    ]

    geometry_result = validate_polygon(polygon)
    ulpin_result = validate_ulpin_record(unit)

    area = float(geometry_result["area"])

    base_z = float(unit["baseZ"])
    top_z = float(unit["topZ"])
    floor_height = top_z - base_z

    volume = area * floor_height

    geometry_valid = (
        geometry_result["valid"]
        and floor_height > 0
        and ulpin_result["valid"]
    )

    return CadastralPropertyRecord(
        ulpin=unit["ulpin"],
        buildingId=building_id,
        floorNumber=int(unit["floorNumber"]),
        unitNumber=int(unit["unitNumber"]),
        row=int(unit["row"]),
        column=int(unit["column"]),
        footprint=unit["polygon"],
        area=area,
        baseZ=base_z,
        topZ=top_z,
        floorHeight=floor_height,
        volume=volume,
        geometryHash=unit["geometryHash"],
        geometryValid=geometry_valid,
        validationStatus="VALID" if geometry_valid else "INVALID",
    )


def build_cadastral_collection(
    building_id: str,
    units: list[dict],
    source_crs: str | None = None,
    geometry_crs: str | None = None,
) -> CadastralPropertyCollection:

    properties = [
        build_cadastral_record(
            building_id=building_id,
            unit=unit,
        )
        for unit in units
    ]

    return CadastralPropertyCollection(
        buildingId=building_id,
        sourceCRS=source_crs,
        geometryCRS=geometry_crs,
        propertyCount=len(properties),
        properties=properties,
        valid=all(
            property.geometryValid
            for property in properties
        ),
    )
