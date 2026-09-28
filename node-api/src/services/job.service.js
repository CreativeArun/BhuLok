const Job = require("../models/job.model");
const Project = require("../models/project.model");
const { generateId } = require("../utils/idGenerator");

const createJob = async ({
  projectId,
  type,
  datasetIds = [],
  options = {},
}) => {
  const project = await Project.findOne({
    projectId,
  });

  if (!project) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  const job = await Job.create({
    jobId: generateId("JOB"),

    projectId,

    type,

    status: "QUEUED",

    progress: 0,

    input: {
      datasetIds,
      options,
    },
  });

  return job;
};

const getJobById = async (jobId) => {
  return Job.findOne({
    jobId,
  });
};

const getProjectJobs = async (projectId) => {
  return Job.find({
    projectId,
  }).sort({
    createdAt: -1,
  });
};

const updateJob = async (jobId, updates) => {
  return Job.findOneAndUpdate(
    {
      jobId,
    },
    updates,
    {
      new: true,
      runValidators: true,
    }
  );
};

const startJob = async (jobId) => {
  return Job.findOneAndUpdate(
    {
      jobId,
      status: "QUEUED",
    },
    {
      status: "PROCESSING",
      progress: 1,
      startedAt: new Date(),
    },
    {
      new: true,
    }
  );
};

const completeJob = async (
  jobId,
  result = null
) => {
  return Job.findOneAndUpdate(
    {
      jobId,
    },
    {
      status: "COMPLETED",
      progress: 100,
      result,
      completedAt: new Date(),
    },
    {
      new: true,
    }
  );
};

const failJob = async (
  jobId,
  message,
  code = "JOB_FAILED",
  details = null
) => {
  return Job.findOneAndUpdate(
    {
      jobId,
    },
    {
      status: "FAILED",
      error: {
        code,
        message,
        details,
      },
      completedAt: new Date(),
    },
    {
      new: true,
    }
  );
};

const cancelJob = async (jobId) => {
  return Job.findOneAndUpdate(
    {
      jobId,
      status: {
        $in: ["QUEUED", "PROCESSING"],
      },
    },
    {
      status: "CANCELLED",
      completedAt: new Date(),
    },
    {
      new: true,
    }
  );
};

module.exports = {
  createJob,
  getJobById,
  getProjectJobs,
  updateJob,
  startJob,
  completeJob,
  failJob,
  cancelJob,
};