import cv2
import numpy as np
from PIL import Image


def detect_floors(image: Image.Image):
    """
    Estimate visible horizontal floor bands from a building facade image.

    This is an image-space estimator. It does not produce real-world
    elevations or guarantee the true architectural floor count.
    """

    image = image.convert("RGB")
    rgb = np.array(image)
    gray = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)

    # Improve local contrast.
    gray = cv2.GaussianBlur(gray, (5, 5), 0)

    # Horizontal edge response.
    sobel_y = cv2.Sobel(
        gray,
        cv2.CV_32F,
        0,
        1,
        ksize=3,
    )

    response = np.abs(sobel_y).mean(axis=1)

    # Smooth the 1D response.
    kernel_size = max(5, (len(response) // 100) * 2 + 1)
    response = cv2.GaussianBlur(
        response.reshape(-1, 1),
        (1, kernel_size),
        0,
    ).ravel()

    # Normalize.
    minimum = float(response.min())
    maximum = float(response.max())

    if maximum - minimum < 1e-6:
        return []

    normalized = (response - minimum) / (maximum - minimum)

    # Candidate horizontal boundaries.
    threshold = max(0.30, float(np.percentile(normalized, 75)))

    candidates = []

    for y in range(1, len(normalized) - 1):
        if normalized[y] >= threshold:
            if (
                normalized[y] >= normalized[y - 1]
                and normalized[y] >= normalized[y + 1]
            ):
                candidates.append(y)

    # Merge nearby edge responses.
    merged = []

    minimum_spacing = max(12, image.height // 80)

    for y in candidates:
        if not merged or y - merged[-1] >= minimum_spacing:
            merged.append(y)
        elif normalized[y] > normalized[merged[-1]]:
            merged[-1] = y

    # A facade normally has a top and bottom boundary plus
    # internal floor boundaries. Ignore image borders.
    boundaries = [
        y for y in merged
        if image.height * 0.05 < y < image.height * 0.95
    ]

    if len(boundaries) < 2:
        return []

    # Convert boundaries into floor bands.
    floors = []

    for index in range(len(boundaries) - 1):
        top = boundaries[index]
        bottom = boundaries[index + 1]
        height = bottom - top

        if height < max(10, image.height // 100):
            continue

        local_response = normalized[top:bottom]

        confidence = float(
            min(
                1.0,
                max(
                    0.0,
                    float(np.mean(local_response)) * 1.5,
                ),
            )
        )

        floors.append(
            {
                "floorNumber": index + 1,
                "yTop": int(top),
                "yBottom": int(bottom),
                "pixelHeight": int(height),
                "confidence": round(confidence, 3),
            }
        )

    return floors
