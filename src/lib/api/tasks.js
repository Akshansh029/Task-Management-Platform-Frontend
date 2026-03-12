import apiClient from "./client";

// Get all tasks with optional pagination
export const getTasks = async (pageNo = 0, pageSize = 10) => {
  const response = await apiClient.get("/tasks", {
    params: { pageNo, pageSize },
  });
  return response.data;
};

// Get single task
export const getTask = async (id, projectIdRequest) => {
  const response = await apiClient.get(`/tasks/${id}`, {
    params: { projectId: projectIdRequest.projectId },
  });
  return response.data;
};

// Create task in project
export const createTask = async (taskData) => {
  const response = await apiClient.post("/projects/tasks", taskData);
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
  const response = await apiClient.patch(
    `/tasks/${taskId}/assign/${userId}`,
    {},
  );
  return response.data;
};

// Delete task
export const deleteTask = async (id) => {
  await apiClient.delete(`/tasks/${id}`);
};

// Add label to task
export const addTaskLabel = async (taskId, labelId) => {
  await apiClient.post(`/tasks/${taskId}/labels/${labelId}`, null);
};

// Remove label from task
export const removeTaskLabel = async (taskId, labelId) => {
  await apiClient.delete(`/tasks/${taskId}/labels/${labelId}`);
};
