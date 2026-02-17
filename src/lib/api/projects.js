import apiClient from "./client";

// Get all projects
export const getProjects = async () => {
  const response = await apiClient.get("/projects");

  return response.data;
};

// Get single project
export const getProject = async (id) => {
  const response = await apiClient.get(`/projects/${id}`, {
    headers: {
      "X-User-ID": "28",
    },
  });
  return response.data;
};

// Create project
export const createProject = async (projectData) => {
  const response = await apiClient.post("/projects", projectData, {
    headers: {
      "X-User-ID": "28",
    },
  });
  return response.data;
};

// Update project
export const updateProject = async (id, projectData) => {
  const response = await apiClient.put(`/projects/${id}`, projectData, {
    headers: {
      "X-User-ID": "28",
    },
  });
  return response.data;
};

// Delete project
export const deleteProject = async (id) => {
  await apiClient.delete(`/projects/${id}`, {
    headers: {
      "X-User-ID": "28",
    },
  });
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
    null,
    {
      headers: {
        "X-User-ID": "28",
      },
    },
  );
  return response.data;
};

// Remove member from project
export const removeProjectMember = async (projectId, userId) => {
  await apiClient.delete(`/projects/${projectId}/members/${userId}`, {
    headers: {
      "X-User-ID": "28",
    },
  });
};

// Get project tasks
export const getProjectTasks = async (projectId) => {
  const response = await apiClient.get(`/projects/${projectId}/tasks`, {
    headers: {
      "X-User-ID": "28",
    },
  });
  return response.data;
};
