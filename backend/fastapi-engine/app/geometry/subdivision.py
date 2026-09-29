from typing import List, Tuple


Point2D = Tuple[float, float]


def subdivide_rectangle(
    polygon: List[Point2D],
    rows: int,
    columns: int,
):
    """
    Subdivide an axis-aligned rectangular footprint into equal 2D units.

    Coordinates are in the same coordinate system as the input polygon.
    This is an initial deterministic subdivision method.
    """

    if len(polygon) != 4:
        raise ValueError("Rectangle subdivision requires exactly 4 polygon points")

    if rows < 1 or columns < 1:
        raise ValueError("Rows and columns must be at least 1")

    xs = [float(point[0]) for point in polygon]
    ys = [float(point[1]) for point in polygon]

    min_x = min(xs)
    max_x = max(xs)
    min_y = min(ys)
    max_y = max(ys)

    if max_x <= min_x or max_y <= min_y:
        raise ValueError("Invalid rectangle dimensions")

    width = (max_x - min_x) / columns
    height = (max_y - min_y) / rows

    units = []

    unit_number = 1

    for row in range(rows):
        for column in range(columns):
            x1 = min_x + column * width
            x2 = min_x + (column + 1) * width
            y1 = min_y + row * height
            y2 = min_y + (row + 1) * height

            units.append(
                {
                    "unitNumber": unit_number,
                    "row": row + 1,
                    "column": column + 1,
                    "polygon": [
                        [x1, y1],
                        [x2, y1],
                        [x2, y2],
                        [x1, y2],
                    ],
                    "area": width * height,
                }
            )

            unit_number += 1

    return {
        "unitCount": len(units),
        "rows": rows,
        "columns": columns,
        "units": units,
    }


def generate_unit_volumes(
    polygon: List[Point2D],
    rows: int,
    columns: int,
    base_z: float,
    floor_height: float,
    floor_number: int,
):
    """
    Generate 3D unit volumes for a single floor.
    """

    if floor_height <= 0:
        raise ValueError("Floor height must be greater than zero")

    if floor_number < 1:
        raise ValueError("Floor number must be at least 1")

    from app.geometry.extrusion import extrude_polygon

    subdivision = subdivide_rectangle(
        polygon=polygon,
        rows=rows,
        columns=columns,
    )

    floor_base_z = base_z + (floor_number - 1) * floor_height

    units = []

    for unit in subdivision["units"]:
        geometry = extrude_polygon(
            polygon=[tuple(point) for point in unit["polygon"]],
            height=floor_height,
            base_z=floor_base_z,
        )

        units.append(
            {
                "unitNumber": unit["unitNumber"],
                "floorNumber": floor_number,
                "polygon": unit["polygon"],
                "row": unit["row"],
                "column": unit["column"],
                "area": unit["area"],
                "baseZ": floor_base_z,
                "topZ": floor_base_z + floor_height,
                "floorHeight": floor_height,
                "vertices": geometry["vertices"],
                "faces": geometry["faces"],
            }
        )

    return {
        "floorNumber": floor_number,
        "unitCount": len(units),
        "floorHeight": floor_height,
        "baseZ": floor_base_z,
        "topZ": floor_base_z + floor_height,
        "units": units,
    }
