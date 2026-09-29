from pathlib import Path

import cv2
import numpy as np
from PIL import Image


def extract_aerial_buildings(
    mask_path: str | Path,
    min_area: int = 1000,
    max_area_ratio: float = 0.20,
    epsilon_ratio: float = 0.01,
    reject_edge_touching: bool = False,
):
    """
    Extract candidate building footprints from an aerial building mask.

    Coordinates are image pixels, not geographic/cadastral coordinates.
    """

    mask = np.array(Image.open(mask_path).convert("L"))
    binary = (mask > 0).astype(np.uint8) * 255

    # Remove tiny isolated noise.
    kernel = np.ones((5, 5), np.uint8)
    binary = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)

    # Close small gaps inside predicted building regions.
    binary = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)

    image_area = binary.shape[0] * binary.shape[1]
    max_area = image_area * max_area_ratio

    contours, _ = cv2.findContours(
        binary,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE,
    )

    buildings = []

    for contour in contours:
        area = cv2.contourArea(contour)

        if area < min_area:
            continue

        if area > max_area:
            continue

        x, y, width, height = cv2.boundingRect(contour)

        touches_edge = (
            x <= 0
            or y <= 0
            or x + width >= binary.shape[1] - 1
            or y + height >= binary.shape[0] - 1
        )

        if reject_edge_touching and touches_edge:
            continue

        perimeter = cv2.arcLength(contour, True)

        if perimeter == 0:
            continue

        polygon = cv2.approxPolyDP(
            contour,
            epsilon_ratio * perimeter,
            True,
        )

        if len(polygon) < 3:
            continue

        bbox_area = width * height
        fill_ratio = area / bbox_area if bbox_area else 0.0

        rectangularity = area / cv2.contourArea(
            cv2.boxPoints(
                cv2.minAreaRect(contour)
            ).astype(np.int32)
        ) if area > 0 else 0.0

        points = [
            [int(point[0][0]), int(point[0][1])]
            for point in polygon
        ]

        buildings.append({
            "area": float(area),
            "pointCount": len(points),
            "bbox": {
                "x": int(x),
                "y": int(y),
                "width": int(width),
                "height": int(height),
            },
            "fillRatio": round(float(fill_ratio), 4),
            "touchesImageEdge": bool(touches_edge),
            "polygon": points,
        })

    buildings.sort(
        key=lambda item: item["area"],
        reverse=True,
    )

    return buildings
