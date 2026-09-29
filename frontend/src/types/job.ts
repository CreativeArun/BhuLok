export type JobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export type JobType =
  | 'FULL_PIPELINE'
  | 'POINT_CLOUD'
  | 'PARCEL_SUBDIVISION'
  | 'CADASTRE_SYNC';

export interface UnitGeometry {
  unitNumber: number;
  floorNumber: number;
  polygon: [number, number][];
  row?: number;
  column?: number;
  area: number;
  baseZ: number;
  topZ: number;
  floorHeight: number;
  vertices?: [number, number, number][];
  faces?: number[][];
  ulpin?: string;
  geometryHash?: string;
  cadastralProperties?: Record<string, unknown>;
}

export interface BuildingGeometry {
  buildingNumber: number;
  footprintArea: number;
  footprint: [number, number][];
  floorCount: number;
  floorHeights?: number[];
  unitCount: number;
  topZ: number;
  units: UnitGeometry[];
  cadastralProperties?: Record<string, unknown>;
}

export interface JobResultData {
  buildingCount: number;
  buildings: BuildingGeometry[];
  pointCount?: number;
  groundPointCount?: number;
  nonGroundPointCount?: number;
  floorDetection?: Record<string, unknown>;
  parameters?: Record<string, unknown>;
}

export interface JobResult {
  success?: boolean;
  data?: JobResultData;
  error?: unknown;
}

export interface Job {
  jobId: string;
  projectId: string;
  type: JobType | string;
  status: JobStatus;
  progress: number;
  result?: JobResult;
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
  createdAt?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface CreateJobInput {
  projectId: string;
  type: JobType | string;
  datasetId?: string;
  options?: Record<string, unknown>;
}
