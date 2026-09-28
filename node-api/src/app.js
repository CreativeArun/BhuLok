const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const pinoHttp = require("pino-http");

const projectRoutes = require("./routes/project.routes");

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(pinoHttp());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      service: "geoulpin-node-api",
      status: "UP",
    },
    error: null,
  });
});

const datasetRoutes = require("./routes/dataset.routes");

const datasetSingleRoutes =
  require("./routes/dataset-single.routes");

app.use(
  "/api/v1/projects/:projectId/datasets",
  datasetRoutes
);

app.use(
  "/api/v1/datasets",
  datasetSingleRoutes
);  

const jobRoutes =
  require("./routes/job.routes");

const projectJobRoutes =
  require("./routes/project-job.routes");

app.use(
  "/api/v1/jobs",
  jobRoutes
);

app.use(
  "/api/v1/projects/:projectId/jobs",
  projectJobRoutes
);

app.use("/api/v1/projects", projectRoutes);

module.exports = app;