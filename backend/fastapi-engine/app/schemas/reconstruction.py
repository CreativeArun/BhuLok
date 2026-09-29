from typing import Optional

from pydantic import BaseModel, Field


class ReconstructionRequest(BaseModel):
    """
    Request used to start a 3D reconstruction job.
    """

    method: str = Field(
        default="IMAGE_EXTRUSION",
        description="Reconstruction method"
    )


class ReconstructionResult(BaseModel):
    """
    Result returned after reconstruction.
    """

    jobId: str
    status: str

    pointCloudUrl: Optional[str] = None
    meshUrl: Optional[str] = None
    modelUrl: Optional[str] = None


class ImageAnalysisResult(BaseModel):
    imageId: str
    filename: str
    width: int
    height: int
    contentType: str