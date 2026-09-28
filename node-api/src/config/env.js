require("dotenv").config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT) || 5000,

  mongoUri: process.env.MONGO_URI,

  fastApiUrl: process.env.FASTAPI_URL || "http://localhost:8000",

  springUrl: process.env.SPRING_URL || "http://localhost:8080",

  uploadDir: process.env.UPLOAD_DIR || "uploads",

  maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB) || 100,
};

module.exports = env;