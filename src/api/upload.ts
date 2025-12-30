import api from './axios';

export interface UploadResponse {
  message: string;
  created?: number;
  updated?: number;
  total?: number;
}

export const uploadApi = {
  uploadCSV: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<UploadResponse>('/upload/csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};

