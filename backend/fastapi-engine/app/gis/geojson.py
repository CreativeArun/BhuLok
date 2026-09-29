from typing import Any


def cadastral_to_geojson(
    properties: list[dict],
    geometry_crs: str | None = None,
) -> dict:
    features = []

    for property_record in properties:
        polygon = property_record["footprint"]

        coordinates = [
            [
                [float(point[0]), float(point[1])]
                for point in polygon
            ]
        ]

        # GeoJSON linear rings must be closed.
        if coordinates[0][0] != coordinates[0][-1]:
            coordinates[0].append(coordinates[0][0])

        feature_properties = {
            "ulpin": property_record["ulpin"],
            "buildingId": property_record["buildingId"],
            "floorNumber": property_record["floorNumber"],
            "unitNumber": property_record["unitNumber"],
            "row": property_record["row"],
            "column": property_record["column"],
            "area": property_record["area"],
            "baseZ": property_record["baseZ"],
            "topZ": property_record["topZ"],
            "floorHeight": property_record["floorHeight"],
            "volume": property_record["volume"],
            "geometryHash": property_record["geometryHash"],
            "geometryValid": property_record["geometryValid"],
            "validationStatus": property_record["validationStatus"],
        }

        features.append(
            {
                "type": "Feature",
                "id": property_record["ulpin"],
                "geometry": {
                    "type": "Polygon",
                    "coordinates": coordinates,
                },
                "properties": feature_properties,
            }
        )

    result: dict[str, Any] = {
        "type": "FeatureCollection",
        "features": features,
    }

    if geometry_crs:
        result["crs"] = {
            "type": "name",
            "properties": {
                "name": geometry_crs,
            },
        }

    return result
