from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[2]

STORAGE_DIR = BASE_DIR / "storage"

UPLOAD_DIR = STORAGE_DIR / "uploads"
MODEL_DIR = STORAGE_DIR / "models"
MESH_DIR = STORAGE_DIR / "meshes"
POINTCLOUD_DIR = STORAGE_DIR / "pointclouds"


def initialize_storage():
    """
    Create required storage directories.
    """

    directories = [
        UPLOAD_DIR,
        MODEL_DIR,
        MESH_DIR,
        POINTCLOUD_DIR,
    ]

    for directory in directories:
        directory.mkdir(parents=True, exist_ok=True)