from typing import Iterable, List, Sequence, Tuple

from pyproj import Transformer

Point2D = Tuple[float, float]
Point3D = Tuple[float, float, float]


def create_transformer(
    source_epsg: int,
    target_epsg: int,
) -> Transformer:
    return Transformer.from_crs(
        source_epsg,
        target_epsg,
        always_xy=True,
    )


def transform_point(
    point: Sequence[float],
    source_epsg: int,
    target_epsg: int,
) -> Point2D | Point3D:
    transformer = create_transformer(
        source_epsg,
        target_epsg,
    )

    if len(point) == 2:
        x, y = transformer.transform(
            float(point[0]),
            float(point[1]),
        )
        return float(x), float(y)

    if len(point) == 3:
        x, y, z = transformer.transform(
            float(point[0]),
            float(point[1]),
            float(point[2]),
        )
        return float(x), float(y), float(z)

    raise ValueError("Point must contain 2 or 3 coordinates")


def transform_points(
    points: Iterable[Sequence[float]],
    source_epsg: int,
    target_epsg: int,
) -> List[Point2D | Point3D]:
    return [
        transform_point(
            point,
            source_epsg,
            target_epsg,
        )
        for point in points
    ]
