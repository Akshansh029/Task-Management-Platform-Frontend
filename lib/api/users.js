import { apiClient } from "./client";

export const usersAPI = {
  // Get all users
  getAll: async () => {
    const response = await apiClient.get("/users");
    return response.data;
  },

  // Get user by ID
  getById: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  // Create user
  create: async (data) => {
    const response = await apiClient.post("/users", data);
    return response.data;
  },

  // Update user
  update: async (id, data) => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },

  // Delete user
  delete: async (id) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
};
