from fastapi import FastAPI

from app.core.storage import initialize_storage
from app.api.image import router as image_router
from app.api.building import router as building_router
from app.api.geometry import router as geometry_router
from app.api.validation import router as validation_router
from app.api.pointcloud import router as pointcloud_router
from app.api.pointcloud_footprint import router as pointcloud_footprint_router
from app.api.pointcloud_building import router as pointcloud_building_router
from app.api.pointcloud_glb import router as pointcloud_glb_router
from app.api.pointcloud_parcel import router as pointcloud_parcel_router
from app.api.cadastral import router as cadastral_router
from app.api.gis import router as gis_router


app = FastAPI(
    title="GeoULPIN 3D Engine",
    version="1.0.0"
)


@app.on_event("startup")
def startup_event():
    initialize_storage()


app.include_router(image_router)
app.include_router(building_router)
app.include_router(geometry_router)
app.include_router(validation_router)
app.include_router(pointcloud_router)
app.include_router(pointcloud_footprint_router)
app.include_router(pointcloud_building_router)
app.include_router(pointcloud_glb_router)
app.include_router(pointcloud_parcel_router)
app.include_router(cadastral_router)
app.include_router(gis_router)


@app.get("/health")
def health():
    return {
        "success": True,
        "data": {
            "status": "healthy"
        },
        "error": None
    }

from fastapi.staticfiles import StaticFiles

app.mount(
    "/files/meshes",
    StaticFiles(directory="storage/meshes"),
    name="mesh-files",
)
