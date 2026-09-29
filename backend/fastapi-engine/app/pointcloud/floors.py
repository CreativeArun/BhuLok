import numpy as np
import open3d as o3d


def detect_pointcloud_floors(
    point_cloud,
    base_z: float = 0.0,
    min_floor_height: float = 2.0,
    max_floor_height: float = 6.0,
    normal_radius: float = 0.4,
    max_nn: int = 30,
    normal_threshold: float = 0.9,
    z_bin_size: float = 0.1,
):
    if point_cloud.is_empty():
        raise ValueError("Point cloud contains no points")

    if min_floor_height <= 0:
        raise ValueError("min_floor_height must be greater than zero")

    if max_floor_height < min_floor_height:
        raise ValueError(
            "max_floor_height must be greater than or equal to min_floor_height"
        )

    if normal_radius <= 0:
        raise ValueError("normal_radius must be greater than zero")

    if max_nn < 3:
        raise ValueError("max_nn must be at least 3")

    if not 0 < normal_threshold <= 1:
        raise ValueError("normal_threshold must be between 0 and 1")

    if z_bin_size <= 0:
        raise ValueError("z_bin_size must be greater than zero")

    cloud = o3d.geometry.PointCloud(point_cloud)

    cloud.estimate_normals(
        search_param=o3d.geometry.KDTreeSearchParamHybrid(
            radius=normal_radius,
            max_nn=max_nn,
        )
    )

    points = np.asarray(cloud.points)
    normals = np.asarray(cloud.normals)

    if len(points) < 10:
        raise ValueError(
            "Point cloud contains too few points for floor detection"
        )

    # Horizontal slabs have approximately vertical normals.
    horizontal_mask = np.abs(normals[:, 2]) >= normal_threshold
    horizontal_points = points[horizontal_mask]

    if len(horizontal_points) < 10:
        raise ValueError(
            "Not enough horizontal surface points for floor detection"
        )

    z_values = horizontal_points[:, 2]

    # The building base must come from the ground/building
    # reference elevation, not from horizontal slab points.
    minimum_z = float(base_z)

    maximum_z = float(np.max(points[:, 2]))

    if maximum_z - minimum_z < min_floor_height:
        raise ValueError(
            "Building height is too small for floor detection"
        )

    bin_count = max(
        1,
        int(np.ceil((maximum_z - minimum_z) / z_bin_size)),
    )

    histogram, edges = np.histogram(
        z_values,
        bins=bin_count,
        range=(minimum_z, maximum_z),
    )

    # Smooth the histogram to merge neighboring bins
    # belonging to the same physical slab.
    kernel = np.array([1, 2, 3, 2, 1], dtype=np.float64)
    kernel /= kernel.sum()

    smoothed = np.convolve(
        histogram.astype(np.float64),
        kernel,
        mode="same",
    )

    if smoothed.max() <= 0:
        raise ValueError("Unable to detect horizontal floor surfaces")

    # A real slab should have significantly more horizontal
    # surface points than the local background.
    peak_threshold = max(
        3.0,
        float(smoothed.max()) * 0.10,
    )

    peaks = []

    for index in range(len(smoothed)):
        if smoothed[index] < peak_threshold:
            continue

        left = smoothed[index - 1] if index > 0 else smoothed[index]
        right = smoothed[index + 1] if index < len(smoothed) - 1 else smoothed[index]

        if smoothed[index] >= left and smoothed[index] >= right:
            z_center = float(
                (edges[index] + edges[index + 1]) / 2.0
            )

            peaks.append(
                {
                    "z": z_center,
                    "strength": float(smoothed[index]),
                }
            )

    # Merge peaks that belong to the same physical slab.
    merged = []

    merge_distance = max(
        0.15,
        z_bin_size * 2.0,
    )

    for peak in peaks:
        if not merged:
            merged.append(peak)
            continue

        if peak["z"] - merged[-1]["z"] <= merge_distance:
            if peak["strength"] > merged[-1]["strength"]:
                merged[-1] = peak
        else:
            merged.append(peak)

    # Keep strong horizontal levels as structural floor/roof boundaries.
    # Adjacent peaks within the same slab are already merged above.
    floor_levels = sorted(
        peak["z"]
        for peak in merged
        if minimum_z < peak["z"] <= maximum_z
    )

    if not floor_levels:
        raise ValueError("No reliable floor levels detected")

    # Construct floor bands between the building base and
    # successive detected structural levels.
    floors = []
    previous_z = minimum_z

    for index, level_z in enumerate(floor_levels, start=1):
        floor_height = level_z - previous_z

        if floor_height < min_floor_height:
            continue

        if floor_height > max_floor_height:
            previous_z = level_z
            continue

        matching_peak = min(
            peaks,
            key=lambda peak: abs(peak["z"] - level_z),
        )

        floors.append(
            {
                "floorNumber": len(floors) + 1,
                "baseZ": float(previous_z),
                "topZ": float(level_z),
                "height": float(floor_height),
                "confidence": round(
                    min(
                        1.0,
                        float(
                            matching_peak["strength"]
                            / smoothed.max()
                        ),
                    ),
                    3,
                ),
            }
        )

        previous_z = level_z

    if not floors:
        raise ValueError("No valid floor bands detected")

    return {
        "floorCount": len(floors),
        "baseZ": float(minimum_z),
        "topZ": float(floors[-1]["topZ"]),
        "totalHeight": float(
            floors[-1]["topZ"] - minimum_z
        ),
        "floorHeight": float(
            np.mean([floor["height"] for floor in floors])
        ),
        "horizontalSurfacePointCount": int(
            len(horizontal_points)
        ),
        "floors": floors,
    }
