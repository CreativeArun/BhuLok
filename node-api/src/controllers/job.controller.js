const jobService = require("../services/job.service");

const {
  successResponse,
  errorResponse,
} = require("../utils/response");

const createJob = async (req, res) => {
  try {
    const {
      projectId,
      type,
      datasetIds,
      options,
    } = req.body;

    if (!projectId) {
      return errorResponse(
        res,
        "projectId is required",
        400
      );
    }

    if (!type) {
      return errorResponse(
        res,
        "Job type is required",
        400
      );
    }

    const job = await jobService.createJob({
      projectId,
      type,
      datasetIds,
      options,
    });

    return successResponse(
      res,
      job,
      201
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Failed to create job",
      error.statusCode || 500
    );
  }
};

const getJob = async (req, res) => {
  try {
    const job = await jobService.getJobById(
      req.params.jobId
    );

    if (!job) {
      return errorResponse(
        res,
        "Job not found",
        404
      );
    }

    return successResponse(res, job);
  } catch (error) {
    return errorResponse(
      res,
      "Failed to fetch job",
      500,
      error.message
    );
  }
};

const getProjectJobs = async (req, res) => {
  try {
    const jobs =
      await jobService.getProjectJobs(
        req.params.projectId
      );

    return successResponse(res, jobs);
  } catch (error) {
    return errorResponse(
      res,
      "Failed to fetch jobs",
      500,
      error.message
    );
  }
};

const cancelJob = async (req, res) => {
  try {
    const job =
      await jobService.cancelJob(
        req.params.jobId
      );

    if (!job) {
      return errorResponse(
        res,
        "Job cannot be cancelled or was not found",
        404
      );
    }

    return successResponse(res, job);
  } catch (error) {
    return errorResponse(
      res,
      "Failed to cancel job",
      500,
      error.message
    );
  }
};

module.exports = {
  createJob,
  getJob,
  getProjectJobs,
  cancelJob,
};