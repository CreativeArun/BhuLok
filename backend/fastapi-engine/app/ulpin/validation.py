import re


ULPIN_PATTERN = re.compile(r"^BHULOK-[A-F0-9]{20}$")


def validate_ulpin_record(unit: dict) -> dict:
    errors = []

    ulpin = unit.get("ulpin")
    geometry_hash = unit.get("geometryHash")

    if not ulpin:
        errors.append("ULPIN is missing")
    elif not ULPIN_PATTERN.fullmatch(str(ulpin)):
        errors.append("Invalid BhuLok ULPIN format")

    if not geometry_hash:
        errors.append("Geometry hash is missing")
    elif len(str(geometry_hash)) != 64:
        errors.append("Geometry hash must be a SHA-256 hexadecimal string")

    floor_number = unit.get("floorNumber")
    row = unit.get("row")
    column = unit.get("column")

    if floor_number is None or int(floor_number) < 1:
        errors.append("floorNumber must be at least 1")

    if row is None or int(row) < 1:
        errors.append("row must be at least 1")

    if column is None or int(column) < 1:
        errors.append("column must be at least 1")

    base_z = unit.get("baseZ")
    top_z = unit.get("topZ")

    if base_z is None or top_z is None:
        errors.append("baseZ and topZ are required")
    elif float(top_z) <= float(base_z):
        errors.append("topZ must be greater than baseZ")

    return {
        "valid": len(errors) == 0,
        "errors": errors,
    }


def validate_ulpin_collection(units: list[dict]) -> dict:
    errors = []
    seen_ulpins = set()
    seen_hashes = set()

    for index, unit in enumerate(units, start=1):
        result = validate_ulpin_record(unit)

        if not result["valid"]:
            errors.append({
                "unitIndex": index,
                "errors": result["errors"],
            })

        ulpin = unit.get("ulpin")
        if ulpin:
            if ulpin in seen_ulpins:
                errors.append({
                    "unitIndex": index,
                    "errors": ["Duplicate ULPIN"],
                })
            seen_ulpins.add(ulpin)

        geometry_hash = unit.get("geometryHash")
        if geometry_hash:
            if geometry_hash in seen_hashes:
                errors.append({
                    "unitIndex": index,
                    "errors": ["Duplicate geometry hash"],
                })
            seen_hashes.add(geometry_hash)

    return {
        "valid": len(errors) == 0,
        "unitCount": len(units),
        "uniqueULPINCount": len(seen_ulpins),
        "uniqueGeometryHashCount": len(seen_hashes),
        "errors": errors,
    }
