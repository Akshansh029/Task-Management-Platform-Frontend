import { apiClient } from "./client";

export const labelsAPI = {
  getAll: async () => {
    const response = await apiClient.get("/labels");
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post("/labels", data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/labels/${id}`);
    return response.data;
  },
};
