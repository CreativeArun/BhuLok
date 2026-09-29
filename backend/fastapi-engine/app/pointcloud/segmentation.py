import numpy as np
import open3d as o3d


def segment_ground(
    point_cloud,
    distance_threshold: float = 0.2,
    ransac_n: int = 3,
    num_iterations: int = 1000,
):
    if point_cloud.is_empty():
        raise ValueError("Point cloud contains no points")

    if distance_threshold <= 0:
        raise ValueError("distance_threshold must be greater than zero")

    if ransac_n < 3:
        raise ValueError("ransac_n must be at least 3")

    if num_iterations < 1:
        raise ValueError("num_iterations must be at least 1")

    plane_model, ground_indices = point_cloud.segment_plane(
        distance_threshold=distance_threshold,
        ransac_n=ransac_n,
        num_iterations=num_iterations,
    )

    ground_cloud = point_cloud.select_by_index(ground_indices)
    non_ground_cloud = point_cloud.select_by_index(
        ground_indices,
        invert=True,
    )

    return {
        "planeModel": [float(value) for value in plane_model],
        "ground": ground_cloud,
        "nonGround": non_ground_cloud,
        "groundIndices": ground_indices,
    }


def get_cloud_point_count(point_cloud):
    return int(np.asarray(point_cloud.points).shape[0])
