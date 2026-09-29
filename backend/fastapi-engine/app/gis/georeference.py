from typing import Iterable

from app.geometry.coordinate import validate_crs
from app.geometry.transform import transform_points


def georeference_points(
    points: Iterable[Iterable[float]],
    source_crs: str,
    target_crs: str,
) -> dict:
    source = validate_crs(source_crs)
    target = validate_crs(target_crs)

    transformed = transform_points(
        points=list(points),
        source_epsg=source,
        target_epsg=target,
    )

    return {
        "sourceCRS": source,
        "targetCRS": target,
        "pointCount": len(transformed),
        "points": transformed,
    }
