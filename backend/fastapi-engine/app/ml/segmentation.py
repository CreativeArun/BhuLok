import cv2
import numpy as np


def clean_mask(mask: np.ndarray) -> np.ndarray:
    mask_uint8 = (mask > 0).astype(np.uint8) * 255

    kernel = np.ones((5, 5), np.uint8)

    mask_uint8 = cv2.morphologyEx(
        mask_uint8,
        cv2.MORPH_OPEN,
        kernel,
    )

    mask_uint8 = cv2.morphologyEx(
        mask_uint8,
        cv2.MORPH_CLOSE,
        kernel,
    )

    return mask_uint8


def extract_contours(mask: np.ndarray, min_area: int = 500):
    contours, _ = cv2.findContours(
        mask,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE,
    )

    results = []

    for contour in contours:
        area = cv2.contourArea(contour)

        if area < min_area:
            continue

        epsilon = 0.002 * cv2.arcLength(contour, True)

        simplified = cv2.approxPolyDP(
            contour,
            epsilon,
            True,
        )

        points = [
            [int(point[0][0]), int(point[0][1])]
            for point in simplified
        ]

        if len(points) >= 3:
            results.append(
                {
                    "area": float(area),
                    "polygon": points,
                }
            )

    results.sort(
        key=lambda item: item["area"],
        reverse=True,
    )

    return results
