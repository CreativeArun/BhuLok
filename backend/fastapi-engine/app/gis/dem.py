from typing import Iterable
import numpy as np


def generate_dem(
    points: Iterable[Iterable[float]],
    resolution: float = 1.0,
    aggregation: str = "min",
) -> dict:
    """
    Generate a simple Digital Elevation Model from XYZ points.

    Each XY grid cell stores an aggregated elevation value.
    DEM convention: ground-oriented elevation, using the minimum
    Z value by default.
    """
    if resolution <= 0:
        raise ValueError("Resolution must be greater than zero")

    data = np.asarray(list(points), dtype=float)

    if data.size == 0:
        raise ValueError("Point cloud must not be empty")

    if data.ndim != 2 or data.shape[1] < 3:
        raise ValueError("Points must contain at least X, Y and Z")

    xyz = data[:, :3]

    if aggregation not in {"min", "mean", "max"}:
        raise ValueError("Aggregation must be one of: min, mean, max")

    min_x = float(np.min(xyz[:, 0]))
    max_x = float(np.max(xyz[:, 0]))
    min_y = float(np.min(xyz[:, 1]))
    max_y = float(np.max(xyz[:, 1]))

    columns = int(np.floor((max_x - min_x) / resolution)) + 1
    rows = int(np.floor((max_y - min_y) / resolution)) + 1

    grid = np.full((rows, columns), np.nan, dtype=float)

    cell_x = np.floor((xyz[:, 0] - min_x) / resolution).astype(int)
    cell_y = np.floor((xyz[:, 1] - min_y) / resolution).astype(int)

    for row, column in zip(cell_y, cell_x):
        values = xyz[
            (cell_y == row) & (cell_x == column),
            2,
        ]

        if aggregation == "min":
            grid[row, column] = float(np.min(values))
        elif aggregation == "mean":
            grid[row, column] = float(np.mean(values))
        else:
            grid[row, column] = float(np.max(values))

    return {
        "type": "DEM",
        "resolution": float(resolution),
        "rows": rows,
        "columns": columns,
        "bounds": {
            "minX": min_x,
            "minY": min_y,
            "maxX": max_x,
            "maxY": max_y,
        },
        "elevation": grid.tolist(),
        "nodata": None,
    }
