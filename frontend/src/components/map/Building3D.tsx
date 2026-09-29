import React, { useEffect } from 'react';
import * as Cesium from 'cesium';
import type { BuildingGeometry } from '../../types/job';
import type { Project } from '../../types/project';
import {
  computeBoundingCenter,
  createPrismGeometry,
} from './localToCesium';

export interface Building3DProps {
  viewer: Cesium.Viewer | null;
  building: BuildingGeometry;
  project: Project;
  origin: Cesium.Matrix4;
  isSelected: boolean;
  selectedUnitNumber?: number | null;
  hasAnySelection: boolean;
  showFootprint?: boolean;
}

function createBuilding3DGeometries(
  viewer: Cesium.Viewer,
  building: BuildingGeometry,
  project: Project,
  origin: Cesium.Matrix4,
  isSelected: boolean,
  selectedUnitNumber?: number | null,
  hasAnySelection: boolean = false,
  showFootprint: boolean = true
): { entities: Cesium.Entity[]; primitives: Cesium.Primitive[] } {
  const entities: Cesium.Entity[] = [];
  const primitives: Cesium.Primitive[] = [];

  // Step 1: Log real building geometry before rendering
  const firstUnit = building.units?.[0];
  console.log('BHULOK_BUILDING_DEBUG', {
    buildingCount: 1,
    unitCount: building.units?.length || 0,
    firstUnitVertices: firstUnit?.vertices,
    firstUnitFaces: firstUnit?.faces,
    baseZ: firstUnit?.baseZ,
    topZ: firstUnit?.topZ,
    floorHeight: firstUnit?.floorHeight,
    area: firstUnit?.area || building.footprintArea,
  });

  // 1. Render each 3D Unit volume as an explicit 3D mesh Primitive
  if (building.units && building.units.length > 0) {
    for (const unit of building.units) {
      const isUnitSelected = isSelected && selectedUnitNumber === unit.unitNumber;

      // Extract unit 2D polygon (fallback to vertices if polygon missing)
      let unitPolygon = unit.polygon;
      if ((!unitPolygon || unitPolygon.length < 3) && unit.vertices && unit.vertices.length >= 3) {
        unitPolygon = unit.vertices.slice(0, 4).map(([x, y]) => [x, y]);
      }

      if (!unitPolygon || unitPolygon.length < 3) {
        continue;
      }

      // Step 5: High-visibility solid material for debugging
      let unitColor: Cesium.Color;

      if (isUnitSelected) {
        unitColor = Cesium.Color.fromCssColorString('#f59e0b'); // Selected amber
      } else if (isSelected) {
        unitColor = Cesium.Color.fromCssColorString('#3b82f6'); // Royal blue
      } else if (hasAnySelection) {
        unitColor = Cesium.Color.fromCssColorString('#3b82f6').withAlpha(0.4);
      } else {
        // High-visibility bright solid blue
        unitColor = Cesium.Color.fromCssColorString('#2563eb');
      }

      // Step 6 & 7: Heights
      const rawBaseZ = typeof unit.baseZ === 'number' && !isNaN(unit.baseZ) ? unit.baseZ : (unit.floorNumber - 1) * 3;
      const rawTopZ = typeof unit.topZ === 'number' && !isNaN(unit.topZ) && unit.topZ > rawBaseZ
        ? unit.topZ
        : rawBaseZ + (unit.floorHeight || 3);

      const height = Math.max(0.1, rawBaseZ);
      const extrudedHeight = Math.max(height + 0.5, rawTopZ);

      // Explicit 3D Prism Geometry in world Cartesian3
      const { geometry: unitGeom } = createPrismGeometry(
        origin,
        unitPolygon as [number, number][],
        height,
        extrudedHeight
      );

      const unitInstance = new Cesium.GeometryInstance({
        id: `unit_${project.projectId}_${building.buildingNumber}_${unit.unitNumber}`,
        geometry: unitGeom,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(unitColor),
        },
      });

      const unitPrimitive = new Cesium.Primitive({
        geometryInstances: unitInstance,
        appearance: new Cesium.PerInstanceColorAppearance({
          flat: false,
          translucent: false,
          closed: true,
        }),
        asynchronous: false,
      });

      viewer.scene.primitives.add(unitPrimitive);
      primitives.push(unitPrimitive);
    }
  }

  // 2. Render Cadastral Ground Footprint as an explicit 3D Primitive
  const footprint = building.footprint && building.footprint.length >= 3
    ? building.footprint
    : building.units?.[0]?.polygon;

  if (showFootprint && footprint && footprint.length >= 3) {
    const { geometry: footprintGeom } = createPrismGeometry(
      origin,
      footprint as [number, number][],
      0.02,
      0.15
    );

    const footprintInstance = new Cesium.GeometryInstance({
      id: `footprint_${project.projectId}_${building.buildingNumber}`,
      geometry: footprintGeom,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
          Cesium.Color.fromCssColorString('#10b981')
        ),
      },
    });

    const footprintPrimitive = new Cesium.Primitive({
      geometryInstances: footprintInstance,
      appearance: new Cesium.PerInstanceColorAppearance({
        flat: false,
        translucent: false,
        closed: true,
      }),
      asynchronous: false,
    });

    viewer.scene.primitives.add(footprintPrimitive);
    primitives.push(footprintPrimitive);
  }

  // 3. Rooftop Inspection Pin & Cadastral Label (Always visible above building)
  const rooftopFootprint = footprint && footprint.length >= 3 ? footprint : [[0, 0], [10, 0], [10, 10], [0, 10]] as [number, number][];
  const rooftopHeight = (building.topZ || 9) + 3.0;
  const rooftopPos = computeBoundingCenter(origin, rooftopFootprint, rooftopHeight);

  const primaryUlpin = building.units?.[0]?.ulpin || `IN-DL-P001-B${String(building.buildingNumber).padStart(3, '0')}`;

  const labelEntity = viewer.entities.add({
    position: rooftopPos,
    point: {
      pixelSize: isSelected ? 16 : 14,
      color: isSelected
        ? Cesium.Color.fromCssColorString('#f59e0b')
        : Cesium.Color.fromCssColorString('#3b82f6'),
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 3,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    label: {
      text: `Building ${building.buildingNumber} (${building.floorCount || 3} Floors)\n${primaryUlpin}`,
      font: 'bold 12px "Plus Jakarta Sans", sans-serif',
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.fromCssColorString('#0f172a'),
      outlineWidth: 4,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -16),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 100000),
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    properties: new Cesium.PropertyBag({
      isBuilding: true,
      projectId: project.projectId,
      projectName: project.name,
      buildingNumber: building.buildingNumber,
      building,
    }),
  });

  entities.push(labelEntity);

  return { entities, primitives };
}

export const Building3D: React.FC<Building3DProps> = ({
  viewer,
  building,
  project,
  origin,
  isSelected,
  selectedUnitNumber,
  hasAnySelection,
  showFootprint = true,
}) => {
  useEffect(() => {
    if (!viewer) return;

    const { entities, primitives } = createBuilding3DGeometries(
      viewer,
      building,
      project,
      origin,
      isSelected,
      selectedUnitNumber,
      hasAnySelection,
      showFootprint
    );

    return () => {
      for (const entity of entities) {
        viewer.entities.remove(entity);
      }
      for (const primitive of primitives) {
        viewer.scene.primitives.remove(primitive);
      }
    };
  }, [viewer, building, project, origin, isSelected, selectedUnitNumber, hasAnySelection, showFootprint]);

  return null;
};

export default Building3D;
