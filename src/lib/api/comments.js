import apiClient from "./client";

// Get comments for a task
export const getTaskComments = async (taskId) => {
  const response = await apiClient.get(`/tasks/${taskId}/comments`);
  return response.data;
};

// Create comment
export const createComment = async (taskId, commentData) => {
  const response = await apiClient.post(
    `/tasks/${taskId}/comments`,
    commentData,
  );
  return response.data;
};

// Update comment
export const updateComment = async (id, commentData) => {
  const response = await apiClient.put(`/comments/${id}`, commentData);
  return response.data;
};

// Delete comment
export const deleteComment = async (id) => {
  await apiClient.delete(`/comments/${id}`);
};
