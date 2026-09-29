const Project = require("../models/project.model");
const { generateId } = require("../utils/idGenerator");

const createProject = async (data) => {
  const project = await Project.create({
    projectId: generateId("PRJ"),
    name: data.name,
    description: data.description || "",
    location: {
      latitude: data.location.latitude,
      longitude: data.location.longitude,
    },
  });

  return project;
};

const getProjects = async () => {
  return Project.find().sort({ createdAt: -1 });
};

const getProjectById = async (projectId) => {
  return Project.findOne({ projectId });
};

const updateProject = async (projectId, data) => {
  return Project.findOneAndUpdate(
    { projectId },
    {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && {
        description: data.description,
      }),
      ...(data.location !== undefined && {
        location: data.location,
      }),
      ...(data.springParcelId !== undefined && {
        springParcelId: data.springParcelId,
      }),
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

const deleteProject = async (projectId) => {
  return Project.findOneAndDelete({ projectId });
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};