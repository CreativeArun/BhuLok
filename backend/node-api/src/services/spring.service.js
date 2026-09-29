const axios = require("axios");
const env = require("../config/env");

const springRequest = async (method, path, data = undefined) => {
  const response = await axios({
    method,
    url: `${env.springUrl}${path}`,
    data,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 10000,
  });

  return response.data;
};

const createParcel = async (parcel) => {
  return springRequest("POST", "/api/parcels", parcel);
};

const createBuilding = async (building) => {
  return springRequest("POST", "/api/buildings", building);
};

const createFloor = async (floor) => {
  return springRequest("POST", "/api/floors", floor);
};

const createOwner = async (owner) => {
  return springRequest("POST", "/api/owners", owner);
};

const createUnit = async (unit) => {
  return springRequest("POST", "/api/units", unit);
};

const getBuildingsByParcel = async (parcelId) => {
  return springRequest(
    "GET",
    `/api/buildings/by-parcel/${parcelId}`
  );
};

const getFloorsByBuilding = async (buildingId) => {
  return springRequest(
    "GET",
    `/api/floors/by-building/${buildingId}`
  );
};

module.exports = {
  createParcel,
  createBuilding,
  createFloor,
  createOwner,
  createUnit,
  getBuildingsByParcel,
  getFloorsByBuilding,
};
