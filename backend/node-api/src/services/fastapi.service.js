const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const env = require("../config/env");

const processPointCloud = async ({
  filePath,
  fileName,
  options = {},
}) => {
  const form = new FormData();

  form.append(
    "file",
    fs.createReadStream(filePath),
    {
      filename: fileName,
    }
  );

  const response = await axios.post(
    `${env.fastApiUrl}/api/v1/ai/pointcloud/building-model-glb`,
    form,
    {
      params: {
        resolution: options.resolution ?? 0.2,
        minArea: options.minArea ?? 2.0,
        groundThreshold: options.groundThreshold ?? 0.2,
        minHeight: options.minHeight ?? 2.0,
      },
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    }
  );

  return response.data;
};

const processPointCloudParcels = async ({
  filePath,
  fileName,
  options = {},
}) => {
  const form = new FormData();

  form.append(
    "file",
    fs.createReadStream(filePath),
    {
      filename: fileName,
    }
  );

  const response = await axios.post(
    `${env.fastApiUrl}/api/v1/ai/pointcloud/auto-parcels`,
    form,
    {
      params: {
        floorMinHeight: options.floorMinHeight ?? 2.0,
        floorMaxHeight: options.floorMaxHeight ?? 6.0,
        normalRadius: options.normalRadius ?? 0.4,
        maxNN: options.maxNN ?? 30,
        normalThreshold: options.normalThreshold ?? 0.9,
        zBinSize: options.zBinSize ?? 0.1,
        resolution: options.resolution ?? 0.2,
        minArea: options.minArea ?? 2.0,
        rows: options.rows ?? 1,
        columns: options.columns ?? 1,
        groundThreshold: options.groundThreshold ?? 0.2,
        baseZ: options.baseZ ?? 0.0,
        sourceCRS: options.sourceCRS ?? undefined,
        geometryCRS: options.geometryCRS ?? undefined,
      },
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    }
  );

  return response.data;
};

module.exports = {
  processPointCloud,
  processPointCloudParcels,
};
