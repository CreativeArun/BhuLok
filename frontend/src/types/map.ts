import type { BuildingGeometry, UnitGeometry } from './job';
import type { ProjectLocation } from './project';

export interface SelectedBuilding {
  buildingNumber: number;
  projectId: string;
  projectName: string;
  location: ProjectLocation;
  ulpin: string;
  floorCount: number;
  unitCount: number;
  area: number;
  height: number;
  registryStatus: string;
  units: UnitGeometry[];
  selectedUnit?: UnitGeometry | null;
  building: BuildingGeometry;
}

export type BaseMapImagery = 'satellite' | 'streets' | 'osm' | 'natural';

export interface MapLayerOptions {
  showBuildings: boolean;
  showFootprints: boolean;
  imageryType: BaseMapImagery;
  showTerrain: boolean;
}

export interface MapSearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'building' | 'ulpin' | 'project';
  projectId: string;
  buildingNumber?: number;
  unitNumber?: number;
  latitude: number;
  longitude: number;
}
