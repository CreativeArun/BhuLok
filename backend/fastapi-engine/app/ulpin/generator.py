import hashlib
import json


def _canonical_geometry(unit: dict) -> dict:
    return {
        "polygon": unit.get("polygon", []),
        "baseZ": round(float(unit.get("baseZ", 0.0)), 6),
        "topZ": round(float(unit.get("topZ", 0.0)), 6),
        "floorNumber": int(unit.get("floorNumber", 0)),
        "row": int(unit.get("row", 0)),
        "column": int(unit.get("column", 0)),
    }


def geometry_hash(unit: dict) -> str:
    payload = json.dumps(
        _canonical_geometry(unit),
        sort_keys=True,
        separators=(",", ":"),
    )

    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def generate_ulpin(
    building_id: str,
    floor_number: int,
    row: int,
    column: int,
    unit: dict,
) -> str:
    geometry_digest = geometry_hash(unit)

    identity = (
        f"{building_id}:"
        f"{floor_number}:"
        f"{row}:"
        f"{column}:"
        f"{geometry_digest}"
    )

    digest = hashlib.sha256(
        identity.encode("utf-8")
    ).hexdigest()[:20].upper()

    return f"BHULOK-{digest}"
