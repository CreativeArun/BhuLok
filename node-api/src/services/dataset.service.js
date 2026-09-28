const Dataset = require("../models/dataset.model");
const Project = require("../models/project.model");
const { generateId } = require("../utils/idGenerator");

const createDataset = async ({
  projectId,
  type,
  file,
}) => {
  const project = await Project.findOne({ projectId });

  if (!project) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  const dataset = await Dataset.create({
    datasetId: generateId("DATA"),

    projectId,

    type,

    originalName: file.originalname,

    filePath: file.path,

    mimeType: file.mimetype,

    size: file.size,

    status: "UPLOADED",
  });

  return dataset;
};

const getProjectDatasets = async (projectId) => {
  return Dataset.find({
    projectId,
  }).sort({
    createdAt: -1,
  });
};

const getDatasetById = async (datasetId) => {
  return Dataset.findOne({
    datasetId,
  });
};

const deleteDataset = async (datasetId) => {
  return Dataset.findOneAndDelete({
    datasetId,
  });
};

const updateDatasetStatus = async (
  datasetId,
  status
) => {
  return Dataset.findOneAndUpdate(
    { datasetId },
    { status },
    {
      new: true,
      runValidators: true,
    }
  );
};

module.exports = {
  createDataset,
  getProjectDatasets,
  getDatasetById,
  deleteDataset,
  updateDatasetStatus,
};