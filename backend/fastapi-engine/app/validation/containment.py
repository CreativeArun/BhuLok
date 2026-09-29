from typing import List, Dict, Any

from shapely.geometry import Polygon


def validate_containment(
    parent_polygon: List[List[float]],
    child_polygons: List[List[List[float]]],
) -> Dict[str, Any]:
    parent = Polygon(parent_polygon)

    if not parent.is_valid:
        parent = parent.buffer(0)

    outside_units = []

    for index, coordinates in enumerate(child_polygons):
        child = Polygon(coordinates)

        if not child.is_valid:
            child = child.buffer(0)

        if not parent.covers(child):
            outside_units.append(
                {
                    "unitIndex": index,
                    "outsideArea": float(
                        child.difference(parent).area
                    ),
                }
            )

    return {
        "valid": len(outside_units) == 0,
        "unitCount": len(child_polygons),
        "outsideCount": len(outside_units),
        "outsideUnits": outside_units,
    }
