from typing import Iterable


def generate_dsm(
    points: Iterable[Iterable[float]],
    resolution: float = 1.0,
) -> dict:
    """
    Generate a Digital Surface Model from XYZ point data.

    The highest Z value within each XY grid cell represents the
    visible surface elevation.
    """
    from app.gis.dem import generate_dem

    result = generate_dem(
        points=points,
        resolution=resolution,
        aggregation="max",
    )

    result["type"] = "DSM"

    return result
