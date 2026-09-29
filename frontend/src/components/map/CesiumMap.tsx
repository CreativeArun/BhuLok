import React, { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import type { BuildingGeometry, UnitGeometry } from '../../types/job';
import type { MapLayerOptions, SelectedBuilding } from '../../types/map';
import type { Project } from '../../types/project';
import {
  computeBuildingBoundingSphere,
  createLocalOrigin,
} from './localToCesium';
import Building3D from './Building3D';

// Debugging interceptor for createImageBitmap failures
if (typeof window !== 'undefined' && window.createImageBitmap) {
  const origCreateImageBitmap = window.createImageBitmap;
  (window as unknown as { _origCreateImageBitmap?: typeof window.createImageBitmap })._origCreateImageBitmap = origCreateImageBitmap;
  window.createImageBitmap = async function (image: any, ...args: any[]) {
    try {
      return await (origCreateImageBitmap as any).call(this, image, ...args);
    } catch (e) {
      console.error('FAILED_IMAGE_BITMAP_DECODE', e, 'source:', image);
      if (image instanceof Blob) {
        try {
          const text = await image.text();
          console.error('FAILED_IMAGE_BLOB_CONTENT (first 300 chars):', text.slice(0, 300));
        } catch {
          // ignore
        }
      }
      throw e;
    }
  };
}

export interface ProjectWithBuildings {
  project: Project;
  buildings: BuildingGeometry[];
  activeJobId?: string;
}

interface CesiumMapProps {
  projectsWithBuildings: ProjectWithBuildings[];
  selectedBuilding: SelectedBuilding | null;
  onSelectBuilding: (building: SelectedBuilding | null) => void;
  layerOptions: MapLayerOptions;
  targetFlyLocation?: {
    latitude: number;
    longitude: number;
    altitude?: number;
    buildingNumber?: number;
  } | null;
  onViewerReady?: (viewer: Cesium.Viewer) => void;
}

export const CesiumMap: React.FC<CesiumMapProps> = ({
  projectsWithBuildings,
  selectedBuilding,
  onSelectBuilding,
  layerOptions,
  targetFlyLocation,
  onViewerReady,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<Cesium.Viewer | null>(null);
  

  const projectsWithBuildingsRef = useRef(projectsWithBuildings);
  const onSelectBuildingRef = useRef(onSelectBuilding);
  const onViewerReadyRef = useRef(onViewerReady);

  useEffect(() => {
    projectsWithBuildingsRef.current = projectsWithBuildings;
    onSelectBuildingRef.current = onSelectBuilding;
    onViewerReadyRef.current = onViewerReady;
  }, [projectsWithBuildings, onSelectBuilding, onViewerReady]);

  // 1. Initialize completely image-free Cesium Viewer
  useEffect(() => {
    if (!containerRef.current) return;

    // Check optional VITE_CESIUM_ION_TOKEN
    const rawToken = import.meta.env.VITE_CESIUM_ION_TOKEN;
    const hasValidIonToken = typeof rawToken === 'string' && rawToken.trim().length > 10;
    if (hasValidIonToken) {
      Cesium.Ion.defaultAccessToken = rawToken.trim();
    } else {
      Cesium.Ion.defaultAccessToken = '';
    }

    // Completely image-free Cesium initialization
    const cesViewer = new Cesium.Viewer(containerRef.current, {
      animation: false,
      timeline: false,
      geocoder: false,
      homeButton: false,
      baseLayerPicker: false,
      baseLayer: false,
      terrainProvider: undefined,
      skyBox: false,
      skyAtmosphere: false,
      navigationHelpButton: false,
      infoBox: false,
      selectionIndicator: false,
      sceneModePicker: false,
      fullscreenButton: false,
      scene3DOnly: true,
      shouldAnimate: true,
    });

    setViewer(cesViewer);

    // Explicitly disable image-backed scene elements
    if (cesViewer.scene.sun) {
      cesViewer.scene.sun.show = false;
    }
    if (cesViewer.scene.moon) {
      cesViewer.scene.moon.show = false;
    }
    if (cesViewer.scene.skyAtmosphere) {
      cesViewer.scene.skyAtmosphere.show = false;
    }

    // Purge any imagery layers
    try {
      cesViewer.imageryLayers.removeAll();
    } catch {
      // ignore
    }

    // Configure globe visual styling with native dark GIS base color
    cesViewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#1e293b');
    cesViewer.scene.globe.depthTestAgainstTerrain = false;
    cesViewer.scene.globe.enableLighting = false;
    cesViewer.scene.globe.showGroundAtmosphere = false;
    cesViewer.scene.globe.show = true;
    cesViewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#0f172a');

    // Capture actual render error details if any occurs
    cesViewer.scene.renderError.addEventListener((_scene, err) => {
      console.error('CESIUM_RENDER_ERROR', err, (err as Error)?.stack);
      console.error({
        imageryLayers: cesViewer.imageryLayers.length,
        terrainProvider: cesViewer.terrainProvider,
        skyBox: cesViewer.scene.skyBox,
        skyAtmosphere: cesViewer.scene.skyAtmosphere,
        primitives: cesViewer.scene.primitives.length,
      });
    });

    // Interaction handler for building selection
    const handler = new Cesium.ScreenSpaceEventHandler(cesViewer.scene.canvas);

    handler.setInputAction((click: { position: Cesium.Cartesian2 }) => {
      const pickedObject = cesViewer.scene.pick(click.position);

      if (Cesium.defined(pickedObject)) {
        // Case A: Picked an Entity (rooftop pin/label)
        if (pickedObject.id instanceof Cesium.Entity) {
          const entity = pickedObject.id;
          const props = entity.properties;

          if (props && props.hasProperty('isBuilding') && props.isBuilding.getValue()) {
            const projectId = props.projectId.getValue() as string;
            const buildingNumber = props.buildingNumber.getValue() as number;
            const building = props.building.getValue() as BuildingGeometry;
            const projectName = props.projectName.getValue() as string;
            const unit = props.hasProperty('unit') ? (props.unit.getValue() as UnitGeometry) : null;

            const projItem = projectsWithBuildingsRef.current.find(
              (p) => p.project.projectId === projectId
            );
            const location = projItem?.project.location || {
              latitude: 28.6139,
              longitude: 77.209,
            };

            const selected: SelectedBuilding = {
              buildingNumber,
              projectId,
              projectName,
              location,
              ulpin: unit?.ulpin || `IN-DL-P001-B${String(buildingNumber).padStart(3, '0')}`,
              floorCount: building.floorCount,
              unitCount: building.unitCount,
              area: building.footprintArea,
              height: building.topZ,
              registryStatus: projItem?.project.springParcelId ? 'SYNCHRONIZED' : 'LOCAL_ONLY',
              units: building.units || [],
              selectedUnit: unit,
              building,
            };

            onSelectBuildingRef.current(selected);
            return;
          }
        }

        // Case B: Picked a Primitive / GeometryInstance
        if (typeof pickedObject.id === 'string') {
          const id = pickedObject.id;
          const parts = id.split('_');
          let projectId: string | null = null;
          let buildingNumber: number | null = null;

          if (id.startsWith('prim_') || id.startsWith('debug_box_')) {
            projectId = parts[parts.length - 2];
            buildingNumber = parseInt(parts[parts.length - 1], 10);
          } else if (id.startsWith('unit_')) {
            projectId = parts[1];
            buildingNumber = parseInt(parts[2], 10);
          }

          if (projectId && buildingNumber !== null) {
            const projItem = projectsWithBuildingsRef.current.find(
              (p) => p.project.projectId === projectId
            );
            const building = projItem?.buildings.find((b) => b.buildingNumber === buildingNumber);

            if (projItem && building) {
              const selected: SelectedBuilding = {
                buildingNumber,
                projectId,
                projectName: projItem.project.name,
                location: projItem.project.location,
                ulpin: building.units?.[0]?.ulpin || `IN-DL-P001-B${String(buildingNumber).padStart(3, '0')}`,
                floorCount: building.floorCount,
                unitCount: building.unitCount,
                area: building.footprintArea,
                height: building.topZ,
                registryStatus: projItem.project.springParcelId ? 'SYNCHRONIZED' : 'LOCAL_ONLY',
                units: building.units || [],
                selectedUnit: null,
                building,
              };

              onSelectBuildingRef.current(selected);
              return;
            }
          }
        }
      }

      onSelectBuildingRef.current(null);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // Cursor hover styling
    handler.setInputAction((movement: { endPosition: Cesium.Cartesian2 }) => {
      const picked = cesViewer.scene.pick(movement.endPosition);
      if (Cesium.defined(picked)) {
        if (
          picked.id instanceof Cesium.Entity &&
          picked.id.properties?.hasProperty('isBuilding')
        ) {
          cesViewer.canvas.style.cursor = 'pointer';
          return;
        }
        if (typeof picked.id === 'string') {
          cesViewer.canvas.style.cursor = 'pointer';
          return;
        }
      }
      cesViewer.canvas.style.cursor = 'default';
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    if (onViewerReadyRef.current) {
      onViewerReadyRef.current(cesViewer);
    }

    return () => {
      handler.destroy();
      if (!cesViewer.isDestroyed()) {
        cesViewer.destroy();
      }
      setViewer(null);
    };
  }, []);



  // 3. Camera Fly-To updates on targetFlyLocation change
  useEffect(() => {
    if (!viewer || !targetFlyLocation) return;

    // If target has a buildingNumber, fly to that building's bounding sphere
    if (targetFlyLocation.buildingNumber !== undefined) {
      for (const item of projectsWithBuildings) {
        const bldg = item.buildings.find((b) => b.buildingNumber === targetFlyLocation.buildingNumber);
        if (bldg) {
          const origin = createLocalOrigin(
            item.project.location.latitude,
            item.project.location.longitude,
            0
          );
          const bs = computeBuildingBoundingSphere(origin, bldg);
          viewer.camera.flyToBoundingSphere(bs, {
            duration: 1.5,
            offset: new Cesium.HeadingPitchRange(
              0.8,
              -0.6,
              Math.max(bs.radius * 6, 80)
            ),
          });
          return;
        }
      }
    }

    // Default destination fly
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        targetFlyLocation.longitude,
        targetFlyLocation.latitude,
        targetFlyLocation.altitude || 120
      ),
      orientation: {
        heading: Cesium.Math.toRadians(20),
        pitch: Cesium.Math.toRadians(-35),
        roll: 0.0,
      },
      duration: 1.5,
    });
  }, [viewer, targetFlyLocation, projectsWithBuildings]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <div ref={containerRef} className="w-full h-full" />

      {/* Render 3D Building Components */}
      {viewer &&
        layerOptions.showBuildings &&
        projectsWithBuildings.map(({ project, buildings }) => {
          const origin = createLocalOrigin(project.location.latitude, project.location.longitude, 0);
          return buildings.map((building) => {
            const isThisBuildingSelected =
              selectedBuilding?.projectId === project.projectId &&
              selectedBuilding?.buildingNumber === building.buildingNumber;

            const selectedUnitNumber = isThisBuildingSelected
              ? selectedBuilding?.selectedUnit?.unitNumber
              : null;

            return (
              <Building3D
                key={`${project.projectId}-${building.buildingNumber}`}
                viewer={viewer}
                building={building}
                project={project}
                origin={origin}
                isSelected={isThisBuildingSelected}
                selectedUnitNumber={selectedUnitNumber}
                hasAnySelection={selectedBuilding !== null}
                showFootprint={layerOptions.showFootprints}
              />
            );
          });
        })}
    </div>
  );
};

export default CesiumMap;
