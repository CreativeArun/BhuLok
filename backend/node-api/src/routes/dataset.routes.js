const express = require("express");

const upload = require("../middleware/upload.middleware");

const datasetController =
  require("../controllers/dataset.controller");

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  upload.single("file"),
  datasetController.uploadDataset
);

router.get(
  "/",
  datasetController.getProjectDatasets
);

module.exports = router;