import * as Cesium from 'cesium';
import type { BuildingGeometry } from '../../types/job';

/**
 * Creates an East-North-Up (ENU) 4x4 transformation matrix anchored at the given
 * WGS84 geographic coordinate (latitude, longitude, height).
 *
 * In ENU frame:
 * - Local +X axis points East (meters)
 * - Local +Y axis points North (meters)
 * - Local +Z axis points Up (meters normal to the WGS84 ellipsoid)
 */
export function createLocalOrigin(
  latitude: number,
  longitude: number,
  height: number = 0
): Cesium.Matrix4 {
  const originCartesian = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
  return Cesium.Transforms.eastNorthUpToFixedFrame(originCartesian);
}

/**
 * Transforms a local Cartesian offset (x: East, y: North, z: Up) into
 * an Earth-Centered, Earth-Fixed (ECEF) Cesium Cartesian3 world position.
 */
export function localToCesium(
  origin: Cesium.Matrix4,
  x: number,
  y: number,
  z: number
): Cesium.Cartesian3 {
  const localPoint = new Cesium.Cartesian3(x, y, z);
  return Cesium.Matrix4.multiplyByPoint(origin, localPoint, new Cesium.Cartesian3());
}

/**
 * Converts a local Cartesian offset into geographic coordinates (longitude, latitude, height).
 */
export function localToGeographic(
  origin: Cesium.Matrix4,
  x: number,
  y: number,
  z: number
): { longitude: number; latitude: number; height: number } {
  const cartesian = localToCesium(origin, x, y, z);
  const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
  return {
    longitude: Cesium.Math.toDegrees(cartographic.longitude),
    latitude: Cesium.Math.toDegrees(cartographic.latitude),
    height: cartographic.height,
  };
}

/**
 * Transforms a 2D local polygon footprint [[x0, y0], [x1, y1], ...]
 * at a given local z height into an array of world Cesium Cartesian3 points.
 */
export function localPolygonToCartesians(
  origin: Cesium.Matrix4,
  polygon: [number, number][],
  z: number = 0
): Cesium.Cartesian3[] {
  return polygon.map(([x, y]) => localToCesium(origin, x, y, z));
}

/**
 * Transforms a 2D local polygon footprint [[x0, y0], [x1, y1], ...]
 * into geographic degrees [[lon0, lat0], [lon1, lat1], ...]
 */
export function localPolygonToDegrees(
  origin: Cesium.Matrix4,
  polygon: [number, number][],
  z: number = 0
): [number, number][] {
  return polygon.map(([x, y]) => {
    const geo = localToGeographic(origin, x, y, z);
    return [geo.longitude, geo.latitude];
  });
}

/**
 * Converts an array of 3D local vertices [[x, y, z], ...]
 * into world Cesium Cartesian3 coordinates.
 */
export function localVerticesToCartesians(
  origin: Cesium.Matrix4,
  vertices: [number, number, number][]
): Cesium.Cartesian3[] {
  return vertices.map(([x, y, z]) => localToCesium(origin, x, y, z));
}

/**
 * Computes the geographic center of a local footprint in world Cartesian3 coordinates.
 */
export function computeBoundingCenter(
  origin: Cesium.Matrix4,
  footprint: [number, number][],
  z: number = 0
): Cesium.Cartesian3 {
  if (!footprint || footprint.length === 0) {
    return localToCesium(origin, 0, 0, z);
  }
  let sumX = 0;
  let sumY = 0;
  for (const [x, y] of footprint) {
    sumX += x;
    sumY += y;
  }
  const avgX = sumX / footprint.length;
  const avgY = sumY / footprint.length;
  return localToCesium(origin, avgX, avgY, z);
}

/**
 * Calculates the Cesium BoundingSphere for a building from all its footprint and unit vertices.
 */
export function computeBuildingBoundingSphere(
  origin: Cesium.Matrix4,
  building: BuildingGeometry
): Cesium.BoundingSphere {
  const points: Cesium.Cartesian3[] = [];

  // 1. Footprint vertices
  if (building.footprint && building.footprint.length > 0) {
    const topZ = typeof building.topZ === 'number' && building.topZ > 0 ? building.topZ : 9;
    for (const [x, y] of building.footprint) {
      points.push(localToCesium(origin, x, y, 0));
      points.push(localToCesium(origin, x, y, topZ));
    }
  }

  // 2. Unit vertices
  if (building.units && building.units.length > 0) {
    for (const u of building.units) {
      if (u.vertices && u.vertices.length > 0) {
        for (const [vx, vy, vz] of u.vertices) {
          points.push(localToCesium(origin, vx, vy, vz));
        }
      } else if (u.polygon && u.polygon.length > 0) {
        const bz = typeof u.baseZ === 'number' ? u.baseZ : 0;
        const tz = typeof u.topZ === 'number' && u.topZ > bz ? u.topZ : bz + (u.floorHeight || 3);
        for (const [px, py] of u.polygon) {
          points.push(localToCesium(origin, px, py, bz));
          points.push(localToCesium(origin, px, py, tz));
        }
      }
    }
  }

  if (points.length === 0) {
    const center = localToCesium(origin, 0, 0, 4.5);
    return new Cesium.BoundingSphere(center, 25);
  }

  return Cesium.BoundingSphere.fromPoints(points);
}

/**
 * Verifies that local (0,0,0) maps exactly to the geographic anchor,
 * and logs BHULOK_COORD_DEBUG with sample vertex.
 */
export function verifyLocalTransform(
  projectLatitude: number,
  projectLongitude: number,
  sampleVertex: [number, number, number] = [10, 10, 3]
): void {
  const origin = createLocalOrigin(projectLatitude, projectLongitude, 0);
  const anchorCartesian = localToCesium(origin, 0, 0, 0);
  const anchorGeo = Cesium.Cartographic.fromCartesian(anchorCartesian);

  const localVertexCartesian = localToCesium(
    origin,
    sampleVertex[0],
    sampleVertex[1],
    sampleVertex[2]
  );

  console.log('BHULOK_COORD_DEBUG', {
    projectLatitude,
    projectLongitude,
    anchorCheck: {
      expected: { latitude: projectLatitude, longitude: projectLongitude },
      calculated: {
        latitude: Cesium.Math.toDegrees(anchorGeo.latitude),
        longitude: Cesium.Math.toDegrees(anchorGeo.longitude),
      },
    },
    localVertex: sampleVertex,
    cesiumCartesian: {
      x: localVertexCartesian.x,
      y: localVertexCartesian.y,
      z: localVertexCartesian.z,
    },
  });
}

/**
 * Creates an explicit closed 3D box Geometry using the 8 local vertices transformed
 * to world Cartesian3 positions via ENU origin, with explicit triangle indices.
 */
export function createExplicitBoxGeometry(
  origin: Cesium.Matrix4,
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  baseZ: number,
  topZ: number
): { geometry: Cesium.Geometry; worldPositions: Cesium.Cartesian3[]; boundingSphere: Cesium.BoundingSphere } {
  const local8: [number, number, number][] = [
    [minX, minY, baseZ], // 0
    [maxX, minY, baseZ], // 1
    [maxX, maxY, baseZ], // 2
    [minX, maxY, baseZ], // 3
    [minX, minY, topZ],  // 4
    [maxX, minY, topZ],  // 5
    [maxX, maxY, topZ],  // 6
    [minX, maxY, topZ],  // 7
  ];

  const worldPositions = local8.map(([x, y, z]) => localToCesium(origin, x, y, z));

  const posValues = new Float64Array(8 * 3);
  for (let i = 0; i < 8; i++) {
    posValues[i * 3] = worldPositions[i].x;
    posValues[i * 3 + 1] = worldPositions[i].y;
    posValues[i * 3 + 2] = worldPositions[i].z;
  }

  const indices = new Uint16Array([
    // bottom
    0, 1, 2,
    0, 2, 3,
    // top
    4, 6, 5,
    4, 7, 6,
    // sides
    0, 4, 5,
    0, 5, 1,
    1, 5, 6,
    1, 6, 2,
    2, 6, 7,
    2, 7, 3,
    3, 7, 4,
    3, 4, 0,
  ]);

  const boundingSphere = Cesium.BoundingSphere.fromPoints(worldPositions);

  let geometry = new Cesium.Geometry({
    attributes: {
      position: new Cesium.GeometryAttribute({
        componentDatatype: Cesium.ComponentDatatype.DOUBLE,
        componentsPerAttribute: 3,
        values: posValues,
      }),
    } as unknown as Cesium.GeometryAttributes,
    indices,
    primitiveType: Cesium.PrimitiveType.TRIANGLES,
    boundingSphere,
  });

  try {
    geometry = Cesium.GeometryPipeline.computeNormal(geometry);
  } catch {
    // ignore
  }

  return { geometry, worldPositions, boundingSphere };
}

/**
 * Creates an explicit 3D extruded prism Geometry from a 2D local polygon and heights baseZ/topZ.
 */
export function createPrismGeometry(
  origin: Cesium.Matrix4,
  polygon2D: [number, number][],
  baseZ: number,
  topZ: number
): { geometry: Cesium.Geometry; worldPositions: Cesium.Cartesian3[]; boundingSphere: Cesium.BoundingSphere } {
  const n = polygon2D.length;
  const worldPositions: Cesium.Cartesian3[] = [];

  // 0..n-1: bottom vertices at baseZ
  for (const [x, y] of polygon2D) {
    worldPositions.push(localToCesium(origin, x, y, baseZ));
  }
  // n..2n-1: top vertices at topZ
  for (const [x, y] of polygon2D) {
    worldPositions.push(localToCesium(origin, x, y, topZ));
  }

  const posValues = new Float64Array(2 * n * 3);
  for (let i = 0; i < 2 * n; i++) {
    posValues[i * 3] = worldPositions[i].x;
    posValues[i * 3 + 1] = worldPositions[i].y;
    posValues[i * 3 + 2] = worldPositions[i].z;
  }

  const indices: number[] = [];
  // Bottom face triangulation
  for (let i = 1; i < n - 1; i++) {
    indices.push(0, i, i + 1);
  }
  // Top face triangulation
  for (let i = 1; i < n - 1; i++) {
    indices.push(n, n + i + 1, n + i);
  }
  // Side quads (two triangles per quad)
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    indices.push(i, n + i, n + j);
    indices.push(i, n + j, j);
  }

  const boundingSphere = Cesium.BoundingSphere.fromPoints(worldPositions);

  let geometry = new Cesium.Geometry({
    attributes: {
      position: new Cesium.GeometryAttribute({
        componentDatatype: Cesium.ComponentDatatype.DOUBLE,
        componentsPerAttribute: 3,
        values: posValues,
      }),
    } as unknown as Cesium.GeometryAttributes,
    indices: new Uint16Array(indices),
    primitiveType: Cesium.PrimitiveType.TRIANGLES,
    boundingSphere,
  });

  try {
    geometry = Cesium.GeometryPipeline.computeNormal(geometry);
  } catch {
    // ignore
  }

  return { geometry, worldPositions, boundingSphere };
}
