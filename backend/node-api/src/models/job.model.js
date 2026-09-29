const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    projectId: {
      type: String,
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "RECONSTRUCTION",
        "BUILDING_EXTRACTION",
        "FLOOR_SEGMENTATION",
        "GEOMETRY_GENERATION",
        "TOPOLOGY_VALIDATION",
        "ULPIN_GENERATION",
        "FULL_PIPELINE",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "QUEUED",
        "PROCESSING",
        "COMPLETED",
        "FAILED",
        "CANCELLED",
      ],
      default: "QUEUED",
      index: true,
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    input: {
      datasetIds: {
        type: [String],
        default: [],
      },

      options: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },

    result: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    error: {
      code: {
        type: String,
        default: null,
      },

      message: {
        type: String,
        default: null,
      },

      details: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);