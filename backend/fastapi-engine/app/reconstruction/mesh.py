from pathlib import Path
from typing import List

import numpy as np
import trimesh


def triangulate_faces(faces: List[List[int]]) -> List[List[int]]:
    triangles = []

    for face in faces:
        if len(face) < 3:
            continue

        for i in range(1, len(face) - 1):
            triangles.append([
                face[0],
                face[i],
                face[i + 1],
            ])

    return triangles


def export_glb(
    vertices: List[List[float]],
    faces: List[List[int]],
    output_path: str | Path,
) -> str:
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    triangles = triangulate_faces(faces)

    if not triangles:
        raise ValueError("No valid triangles generated from faces")

    mesh = trimesh.Trimesh(
        vertices=np.asarray(vertices, dtype=np.float64),
        faces=np.asarray(triangles, dtype=np.int64),
        process=False,
    )

    if len(mesh.vertices) == 0 or len(mesh.faces) == 0:
        raise ValueError("Generated mesh is empty")

    mesh.export(output_path, file_type="glb")

    return str(output_path)
