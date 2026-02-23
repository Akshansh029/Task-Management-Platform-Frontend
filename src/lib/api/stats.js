import apiClient from "./client";

// Get all stata for stat cards
export const getStats = async () => {
  const response = await apiClient.get("/stats");
  return response.data;
};
