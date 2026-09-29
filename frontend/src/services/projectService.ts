import apiClient from './api';
import type { ApiResponse } from '../types/api';
import type { CreateProjectInput, Project, UpdateProjectInput } from '../types/project';

export const projectService = {
  async getProjects(): Promise<Project[]> {
    const response = await apiClient.get<ApiResponse<Project[]>>('/api/v1/projects');
    return response.data.data;
  },

  async getProject(projectId: string): Promise<Project> {
    const response = await apiClient.get<ApiResponse<Project>>(`/api/v1/projects/${projectId}`);
    return response.data.data;
  },

  async createProject(data: CreateProjectInput): Promise<Project> {
    const response = await apiClient.post<ApiResponse<Project>>('/api/v1/projects', data);
    return response.data.data;
  },

  async updateProject(projectId: string, data: UpdateProjectInput): Promise<Project> {
    const response = await apiClient.patch<ApiResponse<Project>>(`/api/v1/projects/${projectId}`, data);
    return response.data.data;
  },

  async deleteProject(projectId: string): Promise<void> {
    await apiClient.delete<ApiResponse<unknown>>(`/api/v1/projects/${projectId}`);
  },
};

export default projectService;
