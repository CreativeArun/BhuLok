from typing import List, Dict, Any

from shapely.geometry import Polygon


def find_polygon_overlaps(
    polygons: List[List[List[float]]],
    tolerance: float = 0.0,
) -> Dict[str, Any]:
    overlaps = []

    shapely_polygons = []

    for index, coordinates in enumerate(polygons):
        polygon = Polygon(coordinates)

        if not polygon.is_valid:
            polygon = polygon.buffer(0)

        shapely_polygons.append((index, polygon))

    for i in range(len(shapely_polygons)):
        index_a, polygon_a = shapely_polygons[i]

        for j in range(i + 1, len(shapely_polygons)):
            index_b, polygon_b = shapely_polygons[j]

            intersection_area = polygon_a.intersection(polygon_b).area

            if intersection_area > tolerance:
                overlaps.append(
                    {
                        "polygonA": index_a,
                        "polygonB": index_b,
                        "intersectionArea": float(intersection_area),
                    }
                )

    return {
        "valid": len(overlaps) == 0,
        "overlapCount": len(overlaps),
        "overlaps": overlaps,
    }
