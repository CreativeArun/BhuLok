import cv2
import numpy as np
from PIL import Image

from app.ml.aerial_building import extract_aerial_buildings

image_path = "storage/uploads/drone_test.jpg"
mask_path = "storage/models/aerial_building_filtered.png"
output_path = "storage/models/aerial_building_candidates_overlay.jpg"

image = cv2.imread(image_path)

buildings = extract_aerial_buildings(
    mask_path,
    min_area=1000,
    max_area_ratio=0.05,
    reject_edge_touching=True,
)

for index, building in enumerate(buildings):
    polygon = np.array(building["polygon"], dtype=np.int32).reshape((-1, 1, 2))

    cv2.polylines(
        image,
        [polygon],
        True,
        (0, 255, 255),
        4,
    )

    x = building["bbox"]["x"]
    y = building["bbox"]["y"]

    cv2.putText(
        image,
        f"B{index} ({int(building['area'])})",
        (x, max(y - 10, 20)),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.8,
        (0, 255, 255),
        2,
        cv2.LINE_AA,
    )

cv2.imwrite(output_path, image)

print("saved:", output_path)
print("candidates:", len(buildings))
