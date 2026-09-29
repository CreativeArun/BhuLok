from typing import List, Tuple


Point2D = Tuple[float, float]


def polygon_area(polygon: List[Point2D]) -> float:
    if len(polygon) < 3:
        return 0.0

    area = 0.0

    for i in range(len(polygon)):
        x1, y1 = polygon[i]
        x2, y2 = polygon[(i + 1) % len(polygon)]
        area += (x1 * y2) - (x2 * y1)

    return abs(area) / 2.0


def validate_polygon(polygon: List[Point2D]) -> dict:
    errors = []

    if len(polygon) < 3:
        errors.append("Polygon must contain at least 3 points")
        return {
            "valid": False,
            "area": 0.0,
            "errors": errors,
        }

    for point in polygon:
        if len(point) != 2:
            errors.append("Each polygon point must contain exactly x and y")

    if errors:
        return {
            "valid": False,
            "area": 0.0,
            "errors": errors,
        }

    for i in range(len(polygon)):
        if polygon[i] == polygon[(i + 1) % len(polygon)]:
            errors.append("Polygon contains duplicate consecutive points")
            break

    area = polygon_area(polygon)

    if area <= 0:
        errors.append("Polygon area must be greater than zero")

    return {
        "valid": len(errors) == 0,
        "area": area,
        "errors": errors,
    }
