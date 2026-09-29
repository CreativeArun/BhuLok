const express = require("express");

const jobController = require("../controllers/job.controller");

const router = express.Router();

router.post("/", jobController.createJob);

router.post("/:jobId/process", jobController.processJob);

router.get("/:jobId", jobController.getJob);

router.post("/:jobId/cancel", jobController.cancelJob);

module.exports = router;
