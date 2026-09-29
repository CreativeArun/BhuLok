from typing import List, Tuple

Point2D = Tuple[float, float]
Point3D = Tuple[float, float, float]


def extrude_polygon(
    polygon: List[Point2D],
    height: float,
    base_z: float = 0.0,
):
    if len(polygon) < 3:
        raise ValueError("Polygon must contain at least 3 points")

    if height <= 0:
        raise ValueError("Height must be greater than zero")

    vertices: List[Point3D] = []

    # Bottom vertices
    for x, y in polygon:
        vertices.append((float(x), float(y), float(base_z)))

    # Top vertices
    for x, y in polygon:
        vertices.append((float(x), float(y), float(base_z + height)))

    n = len(polygon)

    # Bottom face
    faces = [list(range(n - 1, -1, -1))]

    # Top face
    faces.append(list(range(n, 2 * n)))

    # Side faces
    for i in range(n):
        j = (i + 1) % n
        faces.append([
            i,
            j,
            n + j,
            n + i,
        ])

    return {
        "vertices": vertices,
        "faces": faces,
        "height": float(height),
        "baseZ": float(base_z),
    }
