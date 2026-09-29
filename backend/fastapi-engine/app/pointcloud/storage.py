from pathlib import Path

import open3d as o3d

from app.core.storage import POINTCLOUD_DIR


def save_point_cloud(point_cloud, filename: str) -> str:
    output_path = POINTCLOUD_DIR / filename

    success = o3d.io.write_point_cloud(
        str(output_path),
        point_cloud,
    )

    if not success:
        raise RuntimeError("Failed to save processed point cloud")

    return str(output_path)
