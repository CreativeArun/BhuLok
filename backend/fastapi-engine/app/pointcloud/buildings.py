import numpy as np


def extract_building_candidates(
    point_cloud,
    eps: float = 0.5,
    min_points: int = 30,
    min_height: float = 2.0,
):
    if point_cloud.is_empty():
        raise ValueError("Point cloud contains no points")

    if eps <= 0:
        raise ValueError("eps must be greater than zero")

    if min_points < 1:
        raise ValueError("min_points must be at least 1")

    if min_height <= 0:
        raise ValueError("min_height must be greater than zero")

    points = np.asarray(point_cloud.points)

    labels = np.asarray(
        point_cloud.cluster_dbscan(
            eps=eps,
            min_points=min_points,
            print_progress=False,
        )
    )

    candidates = []

    for label in sorted(set(labels)):
        if label < 0:
            continue

        cluster_points = points[labels == label]

        min_bound = cluster_points.min(axis=0)
        max_bound = cluster_points.max(axis=0)

        height = float(max_bound[2] - min_bound[2])

        if height < min_height:
            continue

        candidates.append(
            {
                "clusterId": int(label),
                "pointCount": int(len(cluster_points)),
                "minX": float(min_bound[0]),
                "minY": float(min_bound[1]),
                "minZ": float(min_bound[2]),
                "maxX": float(max_bound[0]),
                "maxY": float(max_bound[1]),
                "maxZ": float(max_bound[2]),
                "width": float(max_bound[0] - min_bound[0]),
                "depth": float(max_bound[1] - min_bound[1]),
                "height": height,
            }
        )

    candidates.sort(
        key=lambda candidate: candidate["pointCount"],
        reverse=True,
    )

    return candidates
