from pathlib import Path

import laspy
import numpy as np
import open3d as o3d


SUPPORTED_FORMATS = {".las", ".laz", ".ply", ".pcd"}


def load_point_cloud(file_path: str):
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"Point cloud file not found: {path}")

    if path.suffix.lower() not in SUPPORTED_FORMATS:
        raise ValueError(
            f"Unsupported point cloud format: {path.suffix}. "
            f"Supported formats: {sorted(SUPPORTED_FORMATS)}"
        )

    extension = path.suffix.lower()

    if extension in {".las", ".laz"}:
        las = laspy.read(path)

        points = np.column_stack(
            (las.x, las.y, las.z)
        ).astype(np.float64)

        point_cloud = o3d.geometry.PointCloud()
        point_cloud.points = o3d.utility.Vector3dVector(points)

        return point_cloud

    point_cloud = o3d.io.read_point_cloud(str(path))

    if point_cloud.is_empty():
        raise ValueError("Point cloud contains no points")

    return point_cloud


def get_point_cloud_statistics(point_cloud):
    points = np.asarray(point_cloud.points)

    if len(points) == 0:
        raise ValueError("Point cloud contains no points")

    min_bound = points.min(axis=0)
    max_bound = points.max(axis=0)

    return {
        "pointCount": int(len(points)),
        "minX": float(min_bound[0]),
        "minY": float(min_bound[1]),
        "minZ": float(min_bound[2]),
        "maxX": float(max_bound[0]),
        "maxY": float(max_bound[1]),
        "maxZ": float(max_bound[2]),
        "width": float(max_bound[0] - min_bound[0]),
        "depth": float(max_bound[1] - min_bound[1]),
        "height": float(max_bound[2] - min_bound[2]),
    }
