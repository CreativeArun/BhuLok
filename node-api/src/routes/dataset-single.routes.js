const express = require("express");

const datasetController =
  require("../controllers/dataset.controller");

const router = express.Router();

router.get(
  "/:datasetId",
  datasetController.getDatasetById
);

router.delete(
  "/:datasetId",
  datasetController.deleteDataset
);

module.exports = router;