from typing import List, Dict, Any

from app.validation.geometry import validate_polygon
from app.validation.overlap import find_polygon_overlaps
from app.validation.containment import validate_containment
from app.validation.elevation import validate_elevations


def validate_parcel_topology(
    building_polygon: List[List[float]],
    units: List[Dict[str, Any]],
) -> Dict[str, Any]:

    polygon_result = validate_polygon(
        [tuple(point) for point in building_polygon]
    )

    floor_groups = {}

    for unit in units:
        floor_number = unit.get("floorNumber", 1)
        floor_groups.setdefault(floor_number, []).append(unit)

    floor_overlap_results = {}
    overlap_valid = True

    for floor_number, floor_units in floor_groups.items():
        polygons = [
            unit["polygon"]
            for unit in floor_units
            if "polygon" in unit
        ]

        result = find_polygon_overlaps(polygons)

        floor_overlap_results[str(floor_number)] = result

        if not result["valid"]:
            overlap_valid = False

    unit_polygons = [
        unit["polygon"]
        for unit in units
        if "polygon" in unit
    ]

    containment_result = validate_containment(
        parent_polygon=building_polygon,
        child_polygons=unit_polygons,
    )

    elevation_result = validate_elevations(units)

    valid = (
        polygon_result["valid"]
        and overlap_valid
        and containment_result["valid"]
        and elevation_result["valid"]
    )

    return {
        "valid": valid,
        "building": polygon_result,
        "overlap": {
            "valid": overlap_valid,
            "floorResults": floor_overlap_results,
        },
        "containment": containment_result,
        "elevation": elevation_result,
    }
