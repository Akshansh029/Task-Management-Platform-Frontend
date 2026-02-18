import apiClient from "./client";

// Get all projects with optional pagination
export const getProjects = async (pageNo = 0, pageSize = 10) => {
  const response = await apiClient.get("/projects", {
    params: { pageNo, pageSize },
  });
  return response.data;
};

// Get single project
export const getProject = async (id) => {
  const response = await apiClient.get(`/projects/${id}`);
  return response.data;
};

// Create project
export const createProject = async (projectData) => {
  const response = await apiClient.post("/projects", projectData);
  return response.data;
};

// Update project
export const updateProject = async (id, projectData) => {
  const response = await apiClient.put(`/projects/${id}`, projectData);
  return response.data;
};

// Delete project
export const deleteProject = async (id) => {
  await apiClient.delete(`/projects/${id}`);
};

// Get project members
export const getProjectMembers = async (projectId) => {
  const response = await apiClient.get(`/projects/${projectId}/members`);
  return response.data;
};

// Add member to project
export const addProjectMember = async (projectId, userId) => {
  const response = await apiClient.post(
    `/projects/${projectId}/members/${userId}`,
  );

  return response;
};

// Add multiple members to project
export const addMultipleProjectMembers = async (projectId, data) => {
  const response = await apiClient.post(`/projects/${projectId}/members`, data);
  return response;
};

// Remove member from project
export const removeProjectMember = async (projectId, userId) => {
  await apiClient.delete(`/projects/${projectId}/members/${userId}`);
};

// Get project tasks
export const getProjectTasks = async (projectId) => {
  const response = await apiClient.get(`/projects/${projectId}/tasks`);
  return response.data;
};
