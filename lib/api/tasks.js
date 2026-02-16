import { apiClient } from "./client";

export const tasksAPI = {
  getAll: async (filters = {}) => {
    const response = await apiClient.get("/tasks", { params: filters });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
  },

  getByProject: async (projectId) => {
    const response = await apiClient.get(`/projects/${projectId}/tasks`);
    return response.data;
  },

  create: async (projectId, data) => {
    const response = await apiClient.post(`/projects/${projectId}/tasks`, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/tasks/${id}`, data);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await apiClient.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },

  assignTask: async (id, userId) => {
    const response = await apiClient.patch(`/tasks/${id}/assign/${userId}`);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/tasks/${id}`);
    return response.data;
  },

  // Labels
  addLabel: async (taskId, labelId) => {
    const response = await apiClient.post(`/tasks/${taskId}/labels/${labelId}`);
    return response.data;
  },

  removeLabel: async (taskId, labelId) => {
    const response = await apiClient.delete(
      `/tasks/${taskId}/labels/${labelId}`,
    );
    return response.data;
  },
};
