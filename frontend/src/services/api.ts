import axios, { type AxiosInstance, type AxiosResponse, AxiosError } from 'axios';
import type { ApiResponse } from '../types/api';

const baseURL = import.meta.env.VITE_NODE_API_URL || 'http://localhost:5000';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.data) {
      const data = error.response.data as Record<string, unknown>;
      const message =
        (typeof data.error === 'string'
          ? data.error
          : (data.error as { message?: string })?.message) ||
        (data.message as string) ||
        error.message;
      return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
