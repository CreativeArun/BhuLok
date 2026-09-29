import cv2
import numpy as np
from shapely.geometry import Polygon


def extract_footprints(
    point_cloud,
    resolution: float = 0.2,
    min_area: float = 2.0,
    simplify_tolerance: float = 0.1,
    rectangularize: bool = True,
):
    if point_cloud.is_empty():
        raise ValueError("Point cloud contains no points")

    if resolution <= 0:
        raise ValueError("resolution must be greater than zero")

    if min_area <= 0:
        raise ValueError("min_area must be greater than zero")

    if simplify_tolerance < 0:
        raise ValueError("simplify_tolerance must be non-negative")

    points = np.asarray(point_cloud.points)
    xy = points[:, :2]

    min_x = float(xy[:, 0].min())
    min_y = float(xy[:, 1].min())

    grid_x = np.floor(
        (xy[:, 0] - min_x) / resolution
    ).astype(np.int32)

    grid_y = np.floor(
        (xy[:, 1] - min_y) / resolution
    ).astype(np.int32)

    width = int(grid_x.max()) + 1
    height = int(grid_y.max()) + 1

    mask = np.zeros(
        (height, width),
        dtype=np.uint8,
    )

    mask[grid_y, grid_x] = 255

    kernel = np.ones((3, 3), dtype=np.uint8)

    mask = cv2.morphologyEx(
        mask,
        cv2.MORPH_CLOSE,
        kernel,
    )

    contours, _ = cv2.findContours(
        mask,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE,
    )

    footprints = []

    for contour in contours:
        area_pixels = cv2.contourArea(contour)
        raw_area = float(
            area_pixels * resolution * resolution
        )

        if raw_area < min_area:
            continue

        polygon = []

        for point in contour:
            px, py = point[0]

            polygon.append([
                min_x + float(px) * resolution,
                min_y + float(py) * resolution,
            ])

        if len(polygon) < 3:
            continue

        shapely_polygon = Polygon(polygon)

        if not shapely_polygon.is_valid:
            shapely_polygon = shapely_polygon.buffer(0)

        if shapely_polygon.is_empty:
            continue

        if simplify_tolerance > 0:
            shapely_polygon = shapely_polygon.simplify(
                simplify_tolerance,
                preserve_topology=True,
            )

        if shapely_polygon.is_empty:
            continue

        if shapely_polygon.geom_type != "Polygon":
            continue

        if rectangularize:
            shapely_polygon = shapely_polygon.minimum_rotated_rectangle

        if shapely_polygon.is_empty:
            continue

        coordinates = [
            [float(x), float(y)]
            for x, y in shapely_polygon.exterior.coords[:-1]
        ]

        if len(coordinates) < 3:
            continue

        area = float(shapely_polygon.area)

        if area < min_area:
            continue

        footprints.append({
            "area": area,
            "pointCount": len(coordinates),
            "polygon": coordinates,
        })

    footprints.sort(
        key=lambda item: item["area"],
        reverse=True,
    )

    return footprints
