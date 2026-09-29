import apiClient from './api';
import type { ApiResponse } from '../types/api';
import type { Dataset } from '../types/dataset';

export const datasetService = {
  async uploadDataset(projectId: string, file: File): Promise<Dataset> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);

    const response = await apiClient.post<ApiResponse<Dataset>>('/api/v1/datasets/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  async getDatasets(projectId?: string): Promise<Dataset[]> {
    const params = projectId ? { projectId } : {};
    const response = await apiClient.get<ApiResponse<Dataset[]>>('/api/v1/datasets', { params });
    return response.data.data;
  },
};

export default datasetService;
