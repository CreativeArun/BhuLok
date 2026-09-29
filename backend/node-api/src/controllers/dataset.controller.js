const datasetService = require("../services/dataset.service");
const {
  successResponse,
  errorResponse,
} = require("../utils/response");

const uploadDataset = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, "No file uploaded", 400);
    }

    const { type } = req.body;
    const { projectId } = req.params;

    const dataset = await datasetService.createDataset({
      projectId,
      type,
      file: req.file,
    });

    return successResponse(res, dataset, 201);
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Failed to upload dataset",
      error.statusCode || 500
    );
  }
};

const getProjectDatasets = async (req, res) => {
  try {
    const { projectId } = req.params;
    const datasets = await datasetService.getProjectDatasets(projectId);

    return successResponse(res, datasets);
  } catch (error) {
    return errorResponse(
      res,
      "Failed to fetch datasets",
      500,
      error.message
    );
  }
};

const getDatasetById = async (req, res) => {
  try {
    const { datasetId } = req.params;
    const dataset = await datasetService.getDatasetById(datasetId);

    if (!dataset) {
      return errorResponse(res, "Dataset not found", 404);
    }

    return successResponse(res, dataset);
  } catch (error) {
    return errorResponse(
      res,
      "Failed to fetch dataset",
      500,
      error.message
    );
  }
};

const deleteDataset = async (req, res) => {
  try {
    const { datasetId } = req.params;
    const dataset = await datasetService.deleteDataset(datasetId);

    if (!dataset) {
      return errorResponse(res, "Dataset not found", 404);
    }

    return successResponse(res, {
      message: "Dataset deleted successfully",
    });
  } catch (error) {
    return errorResponse(
      res,
      "Failed to delete dataset",
      500,
      error.message
    );
  }
};

module.exports = {
  uploadDataset,
  getProjectDatasets,
  getDatasetById,
  deleteDataset,
};
