import open3d as o3d


def voxel_downsample(point_cloud, voxel_size: float):
    if voxel_size <= 0:
        raise ValueError("voxel_size must be greater than zero")

    if point_cloud.is_empty():
        raise ValueError("Point cloud contains no points")

    return point_cloud.voxel_down_sample(voxel_size)


def remove_statistical_outliers(
    point_cloud,
    neighbors: int = 20,
    std_ratio: float = 2.0,
):
    if point_cloud.is_empty():
        raise ValueError("Point cloud contains no points")

    if neighbors < 2:
        raise ValueError("neighbors must be at least 2")

    if std_ratio <= 0:
        raise ValueError("std_ratio must be greater than zero")

    cleaned_cloud, inlier_indices = (
        point_cloud.remove_statistical_outlier(
            nb_neighbors=neighbors,
            std_ratio=std_ratio,
        )
    )

    return cleaned_cloud, inlier_indices
