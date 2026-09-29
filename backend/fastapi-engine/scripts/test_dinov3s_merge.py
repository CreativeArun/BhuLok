import cv2
import numpy as np
from PIL import Image

IMAGE = "storage/uploads/drone_test.jpg"
MASK = "storage/models/dinov3s-building-mask.png"

image = cv2.imread(IMAGE)
mask = np.array(Image.open(MASK).convert("L"))

binary = (mask > 0).astype(np.uint8) * 255

# Try progressively stronger closing.
kernels = [9, 15, 21]

h, w = binary.shape
max_area = h * w * 0.05

for kernel_size in kernels:

    kernel = np.ones((kernel_size, kernel_size), np.uint8)

    cleaned = cv2.morphologyEx(
        binary,
        cv2.MORPH_CLOSE,
        kernel
    )

    cleaned = cv2.morphologyEx(
        cleaned,
        cv2.MORPH_OPEN,
        np.ones((5, 5), np.uint8)
    )

    contours, _ = cv2.findContours(
        cleaned,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE
    )

    output = image.copy()
    count = 0

    for contour in contours:

        area = cv2.contourArea(contour)

        if area < 1500 or area > max_area:
            continue

        x, y, cw, ch = cv2.boundingRect(contour)

        if (
            x <= 0 or
            y <= 0 or
            x + cw >= w - 1 or
            y + ch >= h - 1
        ):
            continue

        perimeter = cv2.arcLength(contour, True)

        if perimeter == 0:
            continue

        polygon = cv2.approxPolyDP(
            contour,
            0.01 * perimeter,
            True
        )

        if len(polygon) < 3:
            continue

        count += 1

        cv2.polylines(
            output,
            [polygon],
            True,
            (0, 255, 0),
            3
        )

        bx, by, _, _ = cv2.boundingRect(polygon)

        cv2.putText(
            output,
            str(count),
            (bx, max(25, by - 5)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 255, 255),
            2
        )

    filename = f"storage/models/dinov3s-merged-{kernel_size}.jpg"

    cv2.imwrite(filename, output)

    print(
        f"kernel={kernel_size}: "
        f"{count} candidates -> {filename}"
    )

