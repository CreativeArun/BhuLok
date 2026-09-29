const mongoose = require("mongoose");

const datasetSchema = new mongoose.Schema(
  {
    datasetId: {
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
        "IMAGE",
        "VIDEO",
        "LIDAR",
        "POINT_CLOUD",
        "GIS",
        "FLOOR_PLAN",
        "DEM",
        "DSM",
        "GNSS",
      ],
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "UPLOADED",
        "PROCESSING",
        "PROCESSED",
        "FAILED",
      ],
      default: "UPLOADED",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Dataset", datasetSchema);