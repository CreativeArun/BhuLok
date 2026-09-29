export interface ProjectLocation {
  latitude: number;
  longitude: number;
}

export interface Project {
  projectId: string;
  name: string;
  description?: string;
  location: ProjectLocation;
  springParcelId?: string | number | null;
  activeJobId?: string | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  location: ProjectLocation;
  springParcelId?: string | number;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  location?: ProjectLocation;
  springParcelId?: string | number;
}
