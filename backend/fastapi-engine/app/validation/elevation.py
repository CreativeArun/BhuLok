from typing import List, Dict, Any


def validate_elevations(
    units: List[Dict[str, Any]],
    tolerance: float = 1e-6,
) -> Dict[str, Any]:
    errors = []

    for unit in units:
        unit_number = unit.get("unitNumber")

        base_z = float(unit.get("baseZ", 0.0))
        top_z = float(unit.get("topZ", 0.0))

        if top_z <= base_z:
            errors.append({
                "unitNumber": unit_number,
                "error": "topZ must be greater than baseZ",
                "baseZ": base_z,
                "topZ": top_z,
            })
            continue

        expected_height = unit.get("floorHeight")

        if expected_height is not None:
            expected_height = float(expected_height)
            actual_height = top_z - base_z

            if abs(actual_height - expected_height) > tolerance:
                errors.append({
                    "unitNumber": unit_number,
                    "error": "3D height does not match floorHeight",
                    "baseZ": base_z,
                    "topZ": top_z,
                    "expectedHeight": expected_height,
                    "actualHeight": actual_height,
                })

    return {
        "valid": len(errors) == 0,
        "unitCount": len(units),
        "errorCount": len(errors),
        "errors": errors,
    }
