import numpy as np
from shapely.geometry import Point, Polygon


def estimate_building_height(
    point_cloud,
    footprint,
    base_z: float = 0.0,
    min_height: float = 2.0,
):
    if point_cloud.is_empty():
        raise ValueError("Point cloud contains no points")

    if min_height <= 0:
        raise ValueError("min_height must be greater than zero")

    if len(footprint) < 3:
        raise ValueError("Footprint must contain at least 3 points")

    polygon = Polygon(footprint)

    if not polygon.is_valid:
        polygon = polygon.buffer(0)

    if polygon.is_empty:
        raise ValueError("Invalid building footprint")

    points = np.asarray(point_cloud.points)

    inside = np.array([
        polygon.covers(Point(float(x), float(y)))
        for x, y in points[:, :2]
    ])

    building_points = points[inside]

    if len(building_points) == 0:
        raise ValueError("No point-cloud points found inside footprint")

    min_z = float(np.percentile(building_points[:, 2], 2))
    max_z = float(np.percentile(building_points[:, 2], 98))

    base = max(min_z, float(base_z))
    height = max_z - base

    if height < min_height:
        raise ValueError(
            f"Estimated building height {height:.2f}m is below "
            f"minimum height {min_height:.2f}m"
        )

    return {
        "height": float(height),
        "baseZ": float(base),
        "topZ": float(base + height),
        "pointCount": int(len(building_points)),
        "minZ": min_z,
        "maxZ": max_z,
    }
