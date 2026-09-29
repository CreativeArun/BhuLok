from app.ulpin.generator import generate_ulpin


def assign_ulpins(building_id: str, units: list[dict]) -> list[dict]:
    enriched_units = []

    for unit in units:
        floor_number = int(unit["floorNumber"])
        row = int(unit["row"])
        column = int(unit["column"])

        ulpin = generate_ulpin(
            building_id=building_id,
            floor_number=floor_number,
            row=row,
            column=column,
            unit=unit,
        )

        enriched_unit = {
            **unit,
            "ulpin": ulpin,
            "geometryHash": __import__(
                "app.ulpin.generator",
                fromlist=["geometry_hash"],
            ).geometry_hash(unit),
        }

        enriched_units.append(enriched_unit)

    return enriched_units
