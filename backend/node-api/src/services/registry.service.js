const springService = require("./spring.service");

const registerBuilding = async ({
  parcelId,
  building,
  buildingIndex = 1,
}) => {
  if (!parcelId) {
    throw new Error("Spring parcel ID is required");
  }

  if (!building) {
    throw new Error("FastAPI building result is required");
  }

  const existingBuildings =
    await springService.getBuildingsByParcel(parcelId);

  const buildingNumber =
    `BLD-${String(buildingIndex).padStart(3, "0")}`;

  const existing = existingBuildings.find(
    (item) => item.buildingNumber === buildingNumber
  );

  if (existing) {
    return existing;
  }

  const floorCount = Number(building.floorCount);

  if (!Number.isInteger(floorCount) || floorCount < 1) {
    throw new Error("Invalid building floor count from FastAPI");
  }

  return springService.createBuilding({
    buildingNumber,
    name: `BhuLok Building ${buildingIndex}`,
    buildingType: "RESIDENTIAL",
    numberOfFloors: floorCount,
    parcelId,
  });
};

const registerFloors = async ({
  buildingId,
  floors,
}) => {
  if (!buildingId) {
    throw new Error("Spring building ID is required");
  }

  if (!Array.isArray(floors) || floors.length === 0) {
    throw new Error("FastAPI floor data is required");
  }

  const floorMap = new Map();

  for (const floor of floors) {
    const floorNumber = Number(floor.floorNumber);
    const area = Number(floor.area);

    if (!Number.isInteger(floorNumber) || floorNumber < 1) {
      throw new Error("Invalid floor number from FastAPI");
    }

    if (!Number.isFinite(area) || area <= 0) {
      throw new Error(
        `Invalid floor area for floor ${floorNumber}`
      );
    }

    if (!floorMap.has(floorNumber)) {
      floorMap.set(floorNumber, area);
    }
  }

  const existingFloors =
    await springService.getFloorsByBuilding(buildingId);

  const existingByNumber = new Map(
    existingFloors.map((floor) => [
      Number(floor.floorNumber),
      floor,
    ])
  );

  const registeredFloors = [];

  for (const [floorNumber, builtUpArea] of floorMap) {
    const existing = existingByNumber.get(floorNumber);

    if (existing) {
      registeredFloors.push(existing);
      continue;
    }

    const registeredFloor = await springService.createFloor({
      floorNumber,
      floorType:
        floorNumber === 1 ? "GROUND" : "UPPER",
      builtUpArea,
      buildingId,
    });

    registeredFloors.push(registeredFloor);
  }

  return registeredFloors;
};

module.exports = {
  registerBuilding,
  registerFloors,
};
