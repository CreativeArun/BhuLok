const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      default: "",
      maxlength: 1000,
    },

    location: {
      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },
    },

    springParcelId: {
      type: Number,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "CREATED",
        "PROCESSING",
        "COMPLETED",
        "FAILED",
      ],
      default: "CREATED",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);