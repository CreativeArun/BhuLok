const express = require("express");

const jobController =
  require("../controllers/job.controller");

const router = express.Router();

router.get(
  "/",
  jobController.getProjectJobs
);

module.exports = router;