from app.geometry.extrusion import extrude_polygon
from app.pointcloud.footprint import extract_footprints
from app.pointcloud.height import estimate_building_height


def generate_building_models(
    point_cloud,
    resolution: float = 0.2,
    min_area: float = 2.0,
    ground_threshold: float = 0.2,
    min_height: float = 2.0,
):
    from app.pointcloud.segmentation import segment_ground

    segmentation = segment_ground(
        point_cloud,
        distance_threshold=ground_threshold,
    )

    non_ground = segmentation["nonGround"]

    footprints = extract_footprints(
        non_ground,
        resolution=resolution,
        min_area=min_area,
        rectangularize=True,
    )

    buildings = []

    for index, footprint_data in enumerate(footprints, start=1):
        footprint = footprint_data["polygon"]

        height_data = estimate_building_height(
            point_cloud=non_ground,
            footprint=footprint,
            min_height=min_height,
        )

        geometry = extrude_polygon(
            polygon=[tuple(point) for point in footprint],
            height=height_data["height"],
            base_z=height_data["baseZ"],
        )

        buildings.append({
            "buildingId": index,
            "footprint": footprint,
            "footprintArea": footprint_data["area"],
            "height": height_data["height"],
            "baseZ": height_data["baseZ"],
            "topZ": height_data["topZ"],
            "pointCount": height_data["pointCount"],
            "vertices": geometry["vertices"],
            "faces": geometry["faces"],
        })

    return {
        "buildingCount": len(buildings),
        "groundPointCount": len(segmentation["ground"].points),
        "nonGroundPointCount": len(non_ground.points),
        "buildings": buildings,
    }
