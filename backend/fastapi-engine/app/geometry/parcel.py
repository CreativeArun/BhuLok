from app.geometry.subdivision import generate_unit_volumes, subdivide_rectangle


def generate_parcel_volumes(
    polygon,
    floor_count,
    rows,
    columns,
    floor_height,
    base_z=0.0,
):
    if floor_count < 1:
        raise ValueError("Floor count must be at least 1")

    if rows < 1 or columns < 1:
        raise ValueError("Rows and columns must be at least 1")

    if floor_height <= 0:
        raise ValueError("Floor height must be greater than zero")

    floors = []

    for floor_number in range(1, floor_count + 1):
        result = generate_unit_volumes(
            polygon=polygon,
            rows=rows,
            columns=columns,
            base_z=base_z,
            floor_height=floor_height,
            floor_number=floor_number,
        )

        floors.append(result)

    units = []

    for floor in floors:
        units.extend(floor["units"])

    return {
        "floorCount": floor_count,
        "rows": rows,
        "columns": columns,
        "floorHeight": float(floor_height),
        "baseZ": float(base_z),
        "topZ": float(base_z + floor_count * floor_height),
        "totalHeight": float(floor_count * floor_height),
        "unitCount": len(units),
        "floors": floors,
        "units": units,
    }


def generate_variable_parcel_volumes(
    polygon,
    floor_levels,
    rows,
    columns,
):
    """
    Generate 3D parcel volumes using detected floor Z boundaries.

    floor_levels must contain dictionaries with:
        floorNumber
        baseZ
        topZ
        height
    """

    if len(polygon) < 3:
        raise ValueError("Polygon must contain at least 3 points")

    if not floor_levels:
        raise ValueError("At least one floor level is required")

    if rows < 1 or columns < 1:
        raise ValueError("Rows and columns must be at least 1")

    from app.geometry.extrusion import extrude_polygon

    floors = []
    units = []

    for floor in floor_levels:
        floor_number = int(floor["floorNumber"])
        floor_base_z = float(floor["baseZ"])
        floor_top_z = float(floor["topZ"])
        floor_height = floor_top_z - floor_base_z

        if floor_height <= 0:
            raise ValueError(
                f"Invalid floor height for floor {floor_number}"
            )

        subdivision = subdivide_rectangle(
            polygon=[tuple(point) for point in polygon],
            rows=rows,
            columns=columns,
        )

        floor_units = []

        for unit in subdivision["units"]:
            geometry = extrude_polygon(
                polygon=[
                    tuple(point)
                    for point in unit["polygon"]
                ],
                height=floor_height,
                base_z=floor_base_z,
            )

            generated_unit = {
                "unitNumber": unit["unitNumber"],
                "floorNumber": floor_number,
                "polygon": unit["polygon"],
                "row": unit["row"],
                "column": unit["column"],
                "area": unit["area"],
                "baseZ": floor_base_z,
                "topZ": floor_top_z,
                "floorHeight": floor_height,
                "vertices": geometry["vertices"],
                "faces": geometry["faces"],
            }

            floor_units.append(generated_unit)
            units.append(generated_unit)

        floors.append(
            {
                "floorNumber": floor_number,
                "unitCount": len(floor_units),
                "baseZ": floor_base_z,
                "topZ": floor_top_z,
                "floorHeight": floor_height,
                "units": floor_units,
            }
        )

    base_z = float(floors[0]["baseZ"])
    top_z = float(floors[-1]["topZ"])

    return {
        "floorCount": len(floors),
        "rows": rows,
        "columns": columns,
        "baseZ": base_z,
        "topZ": top_z,
        "totalHeight": top_z - base_z,
        "unitCount": len(units),
        "floors": floors,
        "units": units,
    }
