import apiClient from './client';

// Get all users
export const getUsers = async () => {
  const response = await apiClient.get('/users');
  return response.data;
};

// Get single user
export const getUser = async (id) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

// Create user
export const createUser = async (userData) => {
  const response = await apiClient.post('/users', userData, {
    headers: {
      'X-User-ID': '28'
    }
  });
  return response.data;
};

// Update user
export const updateUser = async (id, userData) => {
  const response = await apiClient.put(`/users/${id}`, userData, {
    headers: {
      'X-User-ID': '28'
    }
  });
  return response.data;
};

// Update user role
export const updateUserRole = async (id, roleData) => {
  const response = await apiClient.patch(`/users/${id}`, roleData, {
    headers: {
      'X-User-ID': '28'
    }
  });
  return response.data;
};

// Delete user
export const deleteUser = async (id) => {
  await apiClient.delete(`/users/${id}`, {
    headers: {
      'X-User-ID': '28'
    }
  });
};
