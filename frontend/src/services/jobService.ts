import apiClient from './api';
import type { ApiResponse } from '../types/api';
import type { CreateJobInput, Job } from '../types/job';

export const jobService = {
  async createJob(data: CreateJobInput): Promise<Job> {
    const response = await apiClient.post<ApiResponse<Job>>('/api/v1/jobs', data);
    return response.data.data;
  },

  async processJob(jobId: string): Promise<Job> {
    const response = await apiClient.post<ApiResponse<Job>>(`/api/v1/jobs/${jobId}/process`);
    return response.data.data;
  },

  async getJob(jobId: string): Promise<Job> {
    const response = await apiClient.get<ApiResponse<Job>>(`/api/v1/jobs/${jobId}`);
    return response.data.data;
  },

  async cancelJob(jobId: string): Promise<Job> {
    const response = await apiClient.post<ApiResponse<Job>>(`/api/v1/jobs/${jobId}/cancel`);
    return response.data.data;
  },

  async getProjectJobs(projectId: string): Promise<Job[]> {
    const response = await apiClient.get<ApiResponse<Job[]>>(`/api/v1/projects/${projectId}/jobs`);
    return response.data.data;
  },

  // Alias for backward compatibility
  async getJobs(projectId?: string): Promise<Job[]> {
    if (projectId) {
      return this.getProjectJobs(projectId);
    }
    return [];
  },
};

export default jobService;
