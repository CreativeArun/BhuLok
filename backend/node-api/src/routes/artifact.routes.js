const express = require("express");
const path = require("path");

const router = express.Router();

const meshDirectory = path.resolve(
  __dirname,
  "../../../../storage/meshes"
);

router.get("/meshes/:filename", (req, res) => {
  const filePath = path.resolve(
    meshDirectory,
    req.params.filename
  );

  if (!filePath.startsWith(meshDirectory + path.sep)) {
    return res.status(400).json({
      success: false,
      data: null,
      error: "Invalid artifact path",
    });
  }

  return res.sendFile(filePath, (error) => {
    if (error && !res.headersSent) {
      return res.status(error.statusCode || 404).json({
        success: false,
        data: null,
        error: "Artifact not found",
      });
    }
  });
});

module.exports = router;
