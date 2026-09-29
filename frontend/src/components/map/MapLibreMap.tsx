import { useEffect, useRef } from 'react';
import { Map, NavigationControl, setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import type { BuildingGeometry } from '../../types/job';
import type { Project } from '../../types/project';
import type { SelectedBuilding } from '../../types/map';
import 'maplibre-gl/dist/maplibre-gl.css';

setWorkerUrl(workerUrl);

interface TargetFlyLocation {
  latitude: number;
  longitude: number;
  altitude?: number;
  buildingNumber?: number;
}

interface ProjectWithBuildings {
  project: Project;
  buildings: BuildingGeometry[];
  activeJobId?: string;
}

interface MapLibreMapProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  targetFlyLocation?: TargetFlyLocation | null;
  projectsWithBuildings?: ProjectWithBuildings[];
  selectedBuilding?: SelectedBuilding | null;
  onSelectBuilding?: (building: SelectedBuilding | null) => void;
}

/**
 * Convert local ENU-style metres used by the BhuLok geometry
 * into approximate WGS84 longitude/latitude around the project anchor.
 *
 * BhuLok local geometry uses:
 *   X = east/west metres
 *   Y = north/south metres
 */
function localToLngLat(
  latitude: number,
  longitude: number,
  x: number,
  y: number
): [number, number] {
  const latRad = (latitude * Math.PI) / 180;

  const metersPerDegreeLat = 110540;
  const metersPerDegreeLng = 111320 * Math.cos(latRad);

  return [
    longitude + x / metersPerDegreeLng,
    latitude + y / metersPerDegreeLat,
  ];
}

function createSelectedBuilding(
  project: Project,
  building: BuildingGeometry
): SelectedBuilding {
  const firstUnit = building.units?.[0];

  return {
    buildingNumber: building.buildingNumber,
    projectId: project.projectId,
    projectName: project.name,
    location: project.location,
    ulpin:
      firstUnit?.ulpin ||
      `IN-DL-P001-B${String(building.buildingNumber).padStart(3, '0')}`,
    floorCount: building.floorCount,
    unitCount: building.unitCount,
    area: building.footprintArea,
    height: building.topZ,
    registryStatus: project.springParcelId
      ? 'SYNCHRONIZED'
      : 'LOCAL_ONLY',
    units: building.units || [],
    selectedUnit: null,
    building,
  };
}

export default function MapLibreMap({
  latitude = 28.472502,
  longitude = 77.489136,
  zoom = 14,
  targetFlyLocation = null,
  projectsWithBuildings = [],
  selectedBuilding = null,
  onSelectBuilding,
}: MapLibreMapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [longitude, latitude],
      zoom,
      pitch: 55,
      bearing: -20,
    });

    map.addControl(
      new NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.on('load', () => {
      const layers = map.getStyle().layers ?? [];

      const labelLayerId = layers.find(
        (layer: import('maplibre-gl').LayerSpecification) =>
          layer.type === 'symbol' &&
          layer.layout &&
          'text-field' in layer.layout
      )?.id;

      if (!map.getLayer('3d-buildings')) {
        map.addLayer(
          {
            id: '3d-buildings',
            source: 'openmaptiles',
            'source-layer': 'building',
            type: 'fill-extrusion',
            minzoom: 13,
            paint: {
              'fill-extrusion-color': [
                'interpolate',
                ['linear'],
                ['coalesce', ['get', 'render_height'], 0],
                0,
                '#d9dde3',
                20,
                '#c8ced6',
                60,
                '#aeb7c3',
                120,
                '#8f9baa',
              ],
              'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['coalesce', ['get', 'render_height'], 0],
                0,
                0,
                20,
                20,
                60,
                60,
                120,
                120,
              ],
              'fill-extrusion-base': [
                'coalesce',
                ['get', 'render_min_height'],
                0,
              ],
              'fill-extrusion-opacity': 0.9,
            },
          },
          labelLayerId
        );
      }

      /*
       * BhuLok cadastral buildings
       *
       * These are separate from OpenFreeMap buildings.
       * OpenFreeMap provides city context.
       * BhuLok provides authoritative project/building selection.
       */
      if (!map.getSource('bhulok-buildings')) {
        map.addSource('bhulok-buildings', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });
      }

      if (!map.getLayer('bhulok-buildings')) {
        map.addLayer({
          id: 'bhulok-buildings',
          type: 'fill-extrusion',
          source: 'bhulok-buildings',
          paint: {
            'fill-extrusion-color': '#2563eb',
            'fill-extrusion-height': [
              'coalesce',
              ['get', 'height'],
              8,
            ],
            'fill-extrusion-base': 0,
            'fill-extrusion-opacity': 0.65,
          },
        });
      }

      if (!map.getLayer('bhulok-building-outline')) {
        map.addLayer({
          id: 'bhulok-building-outline',
          type: 'line',
          source: 'bhulok-buildings',
          paint: {
            'line-color': '#1d4ed8',
            'line-width': 3,
            'line-opacity': 0.9,
          },
        });
      }

      map.on('click', 'bhulok-buildings', (event) => {
        const feature = event.features?.[0];

        if (!feature) {
          return;
        }

        const projectId = feature.properties?.projectId;
        const buildingNumber = Number(
          feature.properties?.buildingNumber
        );

        if (!projectId || Number.isNaN(buildingNumber)) {
          return;
        }

        const projectItem = projectsWithBuildings.find(
          (item) => item.project.projectId === projectId
        );

        const building = projectItem?.buildings.find(
          (item) => item.buildingNumber === buildingNumber
        );

        if (!projectItem || !building) {
          return;
        }

        const selected = createSelectedBuilding(
          projectItem.project,
          building
        );

        onSelectBuilding?.(selected);

        const center = event.lngLat;

        map.flyTo({
          center: [center.lng, center.lat],
          zoom: 18,
          pitch: 60,
          bearing: -20,
          duration: 1200,
          essential: true,
        });
      });

      map.on('mouseenter', 'bhulok-buildings', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'bhulok-buildings', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [latitude, longitude, zoom]);

  /*
   * Update BhuLok building footprints whenever the backend-loaded
   * project/building data changes.
   */
  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    const source = map.getSource(
      'bhulok-buildings'
    ) as import('maplibre-gl').GeoJSONSource | undefined;

    if (!source) {
      return;
    }

    const features = projectsWithBuildings.flatMap(
      ({ project, buildings }) =>
        buildings
          .filter(
            (building) =>
              building.footprint &&
              building.footprint.length >= 3
          )
          .map((building) => ({
            type: 'Feature' as const,
            id: `${project.projectId}-${building.buildingNumber}`,
            properties: {
              projectId: project.projectId,
              projectName: project.name,
              buildingNumber: building.buildingNumber,
              height: building.topZ || 8,
              floorCount: building.floorCount,
              unitCount: building.unitCount,
              area: building.footprintArea,
            },
            geometry: {
              type: 'Polygon' as const,
              coordinates: [
                [
                  ...building.footprint.map(([x, y]) =>
                    localToLngLat(
                      project.location.latitude,
                      project.location.longitude,
                      x,
                      y
                    )
                  ),
                  localToLngLat(
                    project.location.latitude,
                    project.location.longitude,
                    building.footprint[0][0],
                    building.footprint[0][1]
                  ),
                ],
              ],
            },
          }))
    );

    source.setData({
      type: 'FeatureCollection',
      features,
    });
  }, [projectsWithBuildings]);

  /*
   * Camera control from existing BhuLok search/focus actions.
   */
  useEffect(() => {
    const map = mapRef.current;

    if (!map || !targetFlyLocation) {
      return;
    }

    map.flyTo({
      center: [
        targetFlyLocation.longitude,
        targetFlyLocation.latitude,
      ],
      zoom: 18,
      pitch: 60,
      bearing: -20,
      duration: 1400,
      essential: true,
    });
  }, [targetFlyLocation]);

  /*
   * Visual selection outline.
   */
  useEffect(() => {
    const map = mapRef.current;

    if (!map || !map.getLayer('bhulok-building-outline')) {
      return;
    }

    const selectedId =
      selectedBuilding
        ? `${selectedBuilding.projectId}-${selectedBuilding.buildingNumber}`
        : '';

    map.setPaintProperty(
      'bhulok-building-outline',
      'line-color',
      selectedId ? '#f59e0b' : '#1d4ed8'
    );

    map.setPaintProperty(
      'bhulok-building-outline',
      'line-width',
      selectedId ? 5 : 3
    );
  }, [selectedBuilding]);

  return (
    <div
      ref={mapContainer}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
}
