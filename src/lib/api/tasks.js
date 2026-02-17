import apiClient from './client';

// Get all tasks
export const getTasks = async () => {
  const response = (await apiClient.get('/tasks'));
  return response.data;
};

// Get single task
export const getTask = async (id) => {
  const response = await apiClient.get(`/tasks/${id}`);
  return response.data;
};

// Create task in project
export const createTask = async (projectId, taskData) => {
  const response = await apiClient.post(`/projects/${projectId}/tasks`, taskData);
  return response.data;
};

// Update task
export const updateTask = async (id, taskData) => {
  const response = await apiClient.put(`/tasks/${id}`, taskData);
  return response.data;
};

// Update task status
export const updateTaskStatus = async (id, status) => {
  const response = await apiClient.patch(`/tasks/${id}/status`, { status });
  return response.data;
};

// Assign task to user
export const assignTask = async (taskId, userId) => {
  const response = await apiClient.patch(`/tasks/${taskId}/assign/${userId}`);
  return response.data;
};

// Delete task
export const deleteTask = async (id) => {
  await apiClient.delete(`/tasks/${id}`);
};

// Add label to task
export const addTaskLabel = async (taskId, labelId) => {
  await apiClient.post(`/tasks/${taskId}/labels/${labelId}`);
};

// Remove label from task
export const removeTaskLabel = async (taskId, labelId) => {
  await apiClient.delete(`/tasks/${taskId}/labels/${labelId}`);
};
