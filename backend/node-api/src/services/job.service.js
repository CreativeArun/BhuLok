const Job = require("../models/job.model");
const Project = require("../models/project.model");
const Dataset = require("../models/dataset.model");
const { generateId } = require("../utils/idGenerator");
const fastapiService = require("./fastapi.service");
const registryService = require("./registry.service");

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



const processJob = async (jobId) => {
  const job = await Job.findOne({ jobId });

  if (!job) {
    const error = new Error("Job not found");
    error.statusCode = 404;
    throw error;
  }

  if (job.status !== "QUEUED") {
    const error = new Error(
      `Job cannot be processed from status ${job.status}`
    );
    error.statusCode = 409;
    throw error;
  }

  if (!job.input.datasetIds?.length) {
    const error = new Error("Job has no dataset");
    error.statusCode = 400;
    throw error;
  }

  const dataset = await Dataset.findOne({
    datasetId: job.input.datasetIds[0],
  });

  if (!dataset) {
    const error = new Error("Dataset not found");
    error.statusCode = 404;
    throw error;
  }

  if (dataset.type !== "POINT_CLOUD") {
    const error = new Error(
      `Unsupported dataset type: ${dataset.type}`
    );
    error.statusCode = 400;
    throw error;
  }

  await Dataset.findOneAndUpdate(
    { datasetId: dataset.datasetId },
    { status: "PROCESSING" }
  );

  const started = await startJob(jobId);

  if (!started) {
    await Dataset.findOneAndUpdate(
      { datasetId: dataset.datasetId },
      { status: "UPLOADED" }
    );

    const error = new Error("Job could not be started");
    error.statusCode = 409;
    throw error;
  }

  try {
    const result =
      job.type === "FULL_PIPELINE"
        ? await fastapiService.processPointCloudParcels({
            filePath: dataset.filePath,
            fileName: dataset.originalName,
            options: job.input.options,
          })
        : await fastapiService.processPointCloud({
            filePath: dataset.filePath,
            fileName: dataset.originalName,
            options: job.input.options,
          });

    if (
      job.type === "FULL_PIPELINE" &&
      job.projectId &&
      result?.data?.buildings?.length
    ) {
      const project = await Project.findOne({
        projectId: job.projectId,
      });

      if (!project?.springParcelId) {
        throw new Error(
          "Spring parcel ID is required for FULL_PIPELINE registry integration"
        );
      }

      const registryResults = [];

      for (let index = 0; index < result.data.buildings.length; index++) {
        const building = result.data.buildings[index];

        const registeredBuilding =
          await registryService.registerBuilding({
            parcelId: project.springParcelId,
            building,
            buildingIndex: index + 1,
          });

        const registeredFloors =
          await registryService.registerFloors({
            buildingId: registeredBuilding.id,
            floors: building.units || [],
          });

        registryResults.push({
          buildingId: registeredBuilding.id,
          buildingNumber: registeredBuilding.buildingNumber,
          floorIds: registeredFloors.map(
            (floor) => floor.id
          ),
        });
      }

      result.registry = {
        springParcelId: project.springParcelId,
        buildings: registryResults,
      };
    }

    await Dataset.findOneAndUpdate(
      { datasetId: dataset.datasetId },
      { status: "PROCESSED" }
    );

    return await completeJob(jobId, result);
  } catch (error) {
    await Dataset.findOneAndUpdate(
      { datasetId: dataset.datasetId },
      { status: "FAILED" }
    );

    await failJob(
      jobId,
      error.response?.data?.error ||
        error.response?.data?.detail ||
        error.message ||
        "FastAPI processing failed",
      "FASTAPI_PROCESSING_FAILED",
      error.response?.data || null
    );

    throw error;
  }
};


// module.exports

module.exports = {
  createJob,
  getJobById,
  getProjectJobs,
  updateJob,
  startJob,
  completeJob,
  failJob,
  cancelJob,
  processJob,
};