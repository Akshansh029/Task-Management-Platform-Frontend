import apiClient from './client';

// Get all labels
export const getLabels = async () => {
  const response = await apiClient.get('/labels');
  return response.data;
};

// Create label
export const createLabel = async (labelData) => {
  const response = await apiClient.post('/labels', labelData);
  return response.data;
};

// Delete label
export const deleteLabel = async (id) => {
  await apiClient.delete(`/labels/${id}`);
};
