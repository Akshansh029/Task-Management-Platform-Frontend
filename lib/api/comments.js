import { apiClient } from "./client";

export const commentsAPI = {
  getByTask: async (taskId) => {
    const response = await apiClient.get(`/tasks/${taskId}/comments`);
    return response.data;
  },

  create: async (taskId, data) => {
    const response = await apiClient.post(`/tasks/${taskId}/comments`, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/comments/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/comments/${id}`);
    return response.data;
  },
};
