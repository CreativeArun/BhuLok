const projectService = require("../services/project.service");
const {
  successResponse,
  errorResponse,
} = require("../utils/response");

const createProject = async (req, res) => {
  try {
    const project = await projectService.createProject(req.body);

    return successResponse(res, project, 201);
  } catch (error) {
    return errorResponse(
      res,
      "Failed to create project",
      500,
      error.message
    );
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await projectService.getProjects();

    return successResponse(res, projects);
  } catch (error) {
    return errorResponse(
      res,
      "Failed to fetch projects",
      500,
      error.message
    );
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await projectService.getProjectById(
      req.params.projectId
    );

    if (!project) {
      return errorResponse(res, "Project not found", 404);
    }

    return successResponse(res, project);
  } catch (error) {
    return errorResponse(
      res,
      "Failed to fetch project",
      500,
      error.message
    );
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await projectService.updateProject(
      req.params.projectId,
      req.body
    );

    if (!project) {
      return errorResponse(res, "Project not found", 404);
    }

    return successResponse(res, project);
  } catch (error) {
    return errorResponse(
      res,
      "Failed to update project",
      500,
      error.message
    );
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await projectService.deleteProject(
      req.params.projectId
    );

    if (!project) {
      return errorResponse(res, "Project not found", 404);
    }

    return successResponse(res, {
      message: "Project deleted successfully",
    });
  } catch (error) {
    return errorResponse(
      res,
      "Failed to delete project",
      500,
      error.message
    );
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};