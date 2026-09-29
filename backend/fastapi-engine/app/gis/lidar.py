from typing import Iterable

import numpy as np


def analyze_lidar_points(
    points: Iterable[Iterable[float]],
    ground_threshold: float = 0.5,
) -> dict:
    data = np.asarray(list(points), dtype=float)

    if data.size == 0:
        raise ValueError("LiDAR point cloud must not be empty")

    if data.ndim != 2 or data.shape[1] < 3:
        raise ValueError("LiDAR points must contain X, Y and Z")

    xyz = data[:, :3]

    if ground_threshold < 0:
        raise ValueError("Ground threshold must not be negative")

    min_z = float(np.min(xyz[:, 2]))
    ground_limit = min_z + ground_threshold

    ground_mask = xyz[:, 2] <= ground_limit

    min_x = float(np.min(xyz[:, 0]))
    max_x = float(np.max(xyz[:, 0]))
    min_y = float(np.min(xyz[:, 1]))
    max_y = float(np.max(xyz[:, 1]))

    area = max((max_x - min_x) * (max_y - min_y), 0.0)

    return {
        "pointCount": int(len(xyz)),
        "bounds": {
            "minX": min_x,
            "minY": min_y,
            "minZ": min_z,
            "maxX": max_x,
            "maxY": max_y,
            "maxZ": float(np.max(xyz[:, 2])),
        },
        "zStatistics": {
            "min": min_z,
            "max": float(np.max(xyz[:, 2])),
            "mean": float(np.mean(xyz[:, 2])),
            "median": float(np.median(xyz[:, 2])),
        },
        "ground": {
            "threshold": float(ground_threshold),
            "groundPointCount": int(np.sum(ground_mask)),
            "nonGroundPointCount": int(np.sum(~ground_mask)),
        },
        "density": {
            "area": float(area),
            "pointsPerSquareUnit": (
                float(len(xyz) / area) if area > 0 else None
            ),
        },
    }
