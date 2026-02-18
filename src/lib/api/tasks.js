import apiClient from "./client";

// Get all tasks with optional pagination
export const getTasks = async (projectId, pageNo = 0, pageSize = 10) => {
  const response = await apiClient.get("/tasks", {
    headers: {
      "X-Project-ID": projectId,
    },
    params: { pageNo, pageSize },
  });
  return response.data;
};

// Get single task
export const getTask = async (id, projectId) => {
  const response = await apiClient.get(`/tasks/${id}`, {
    headers: {
      "X-Project-ID": projectId,
    },
  });
  return response.data;
};

// Create task in project
export const createTask = async (projectId, taskData) => {
  const response = await apiClient.post("/projects/tasks", taskData, {
    headers: {
      "X-Project-ID": projectId,
    },
  });
  return response.data;
};

// Update task
export const updateTask = async (id, taskData, projectId) => {
  const response = await apiClient.put(`/tasks/${id}`, taskData, {
    headers: {
      "X-Project-ID": projectId,
    },
  });
  return response.data;
};

// Update task status
export const updateTaskStatus = async (id, status, projectId) => {
  const response = await apiClient.patch(
    `/tasks/${id}/status`,
    { status },
    {
      headers: {
        "X-Project-ID": projectId,
      },
    },
  );
  return response.data;
};

// Assign task to user
export const assignTask = async (taskId, userId, projectId) => {
  const response = await apiClient.patch(
    `/tasks/${taskId}/assign/${userId}`,
    {},
    {
      headers: {
        "X-Project-ID": projectId,
      },
    },
  );
  return response.data;
};

// Delete task
export const deleteTask = async (id, projectId) => {
  await apiClient.delete(`/tasks/${id}`, {
    headers: {
      "X-Project-ID": projectId,
    },
  });
};

// Add label to task
export const addTaskLabel = async (taskId, labelId, projectId) => {
  await apiClient.post(`/tasks/${taskId}/labels/${labelId}`, null, {
    headers: {
      "X-Project-ID": projectId,
    },
  });
};

// Remove label from task
export const removeTaskLabel = async (taskId, labelId, projectId) => {
  await apiClient.delete(`/tasks/${taskId}/labels/${labelId}`, {
    headers: {
      "X-Project-ID": projectId,
    },
  });
};
