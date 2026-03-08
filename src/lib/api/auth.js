import apiClient from "./client";

/**
 * Login function
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} - { message, token }
 */
export const login = async (credentials) => {
  const response = await apiClient.post("/auth/login", credentials);
  return response.data;
};

/**
 * Register function
 * @param {Object} userData - { name, email, password }
 * @returns {Promise<Object>}
 */
export const register = async (userData) => {
  const response = await apiClient.post("/auth/register", userData);
  return response.data;
};

/**
 * Logout function
 * @returns {Promise<Object>}
 */
export const logout = async () => {
  const response = await apiClient.post("/auth/logout");
  return response.data;
};
