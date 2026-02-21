import apiClient from "./client";

// Get all stata for stat cards
export const getStats = async () => {
  console.log("Calling getStats API...");
  const response = await apiClient.get("/stats");
  console.log("Stats response: ", response.data);
  return response.data;
};
