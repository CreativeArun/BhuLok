const multer = require("multer");
const path = require("path");
const fs = require("fs");

const env = require("../config/env");

const uploadDir = path.resolve(env.uploadDir);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedMimeTypes = [
  // Images
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/tiff",

  // Video
  "video/mp4",
  "video/quicktime",

  // Point clouds / LiDAR
  "application/octet-stream",
  "application/las",
  "application/x-las",
  "application/vnd.las",
  "application/x.las",

  // GIS
  "application/geo+json",
  "application/json",
  "application/zip",

  // Floor plans / documents
  "application/pdf",

  // Common GNSS files
  "text/plain",
  "text/csv",
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const uniqueName =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
      extension;

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported file type: ${file.mimetype}`
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: env.maxFileSizeMb * 1024 * 1024,
  },
});

module.exports = upload;