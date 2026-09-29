from dataclasses import dataclass

from pyproj import CRS
from pyproj.exceptions import CRSError


@dataclass(frozen=True)
class CoordinateReferenceSystem:
    epsg: int

    @property
    def authority(self) -> str:
        return f"EPSG:{self.epsg}"

    def __str__(self) -> str:
        return self.authority


def validate_crs(crs: str) -> str:
    value = str(crs).strip()

    if not value:
        raise ValueError("CRS must not be empty")

    try:
        parsed = CRS.from_user_input(value)
    except CRSError as exc:
        raise ValueError(f"Invalid CRS: {value}") from exc

    authority = parsed.to_authority()

    if authority is None:
        raise ValueError(f"CRS has no recognized authority: {value}")

    return f"{authority[0]}:{authority[1]}"
