import { apiClient } from "./client";

export const projectsAPI = {
  getAll: async () => {
    const response = await apiClient.get("/projects");
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post("/projects", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/projects/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  },

  // Member management
  addMember: async (projectId, userId) => {
    const response = await apiClient.post(
      `/projects/${projectId}/members/${userId}`,
    );
    return response.data;
  },

  removeMember: async (projectId, userId) => {
    const response = await apiClient.delete(
      `/projects/${projectId}/members/${userId}`,
    );
    return response.data;
  },

  getMembers: async (projectId) => {
    const response = await apiClient.get(`/projects/${projectId}/members`);
    return response.data;
  },
};
