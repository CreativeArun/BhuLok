from typing import List, Tuple

from app.geometry.extrusion import extrude_polygon


Point2D = Tuple[float, float]


def generate_floor_volumes(
    polygon: List[Point2D],
    floor_count: int,
    floor_height: float,
    base_z: float = 0.0,
):
    """
    Generate independent 3D volumes for each building floor.

    Coordinates are assumed to be in the same coordinate system as
    the supplied polygon. Floor heights and base_z use the same vertical
    unit as the geometry input.
    """

    if len(polygon) < 3:
        raise ValueError("Polygon must contain at least 3 points")

    if floor_count <= 0:
        raise ValueError("Floor count must be greater than zero")

    if floor_height <= 0:
        raise ValueError("Floor height must be greater than zero")

    floors = []

    for floor_number in range(1, floor_count + 1):
        floor_base_z = base_z + (
            (floor_number - 1) * floor_height
        )

        geometry = extrude_polygon(
            polygon=polygon,
            height=floor_height,
            base_z=floor_base_z,
        )

        floors.append(
            {
                "floorNumber": floor_number,
                "baseZ": floor_base_z,
                "topZ": floor_base_z + floor_height,
                "height": floor_height,
                "vertices": geometry["vertices"],
                "faces": geometry["faces"],
                "vertexCount": len(geometry["vertices"]),
                "faceCount": len(geometry["faces"]),
            }
        )

    return {
        "floorCount": floor_count,
        "floorHeight": float(floor_height),
        "baseZ": float(base_z),
        "totalHeight": float(floor_count * floor_height),
        "floors": floors,
    }
