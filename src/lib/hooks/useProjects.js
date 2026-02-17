import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as projectsApi from "@/lib/api/projects";
import { useToast } from "@/lib/hooks/use-toast";

export function useProjects() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: projectsApi.getProjects,
  });

  const createProjectMutation = useMutation({
    mutationFn: projectsApi.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }) => projectsApi.updateProject(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", data.id] });
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update project",
        variant: "destructive",
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: projectsApi.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      });
    },
  });

  return {
    projects: projectsQuery.data || { content: [] },
    isLoading: projectsQuery.isLoading,
    isError: projectsQuery.isError,
    error: projectsQuery.error,
    createProject: createProjectMutation,
    updateProject: updateProjectMutation,
    deleteProject: deleteProjectMutation,
  };
}

export function useProject(id) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const projectQuery = useQuery({
    queryKey: ["projects", id],
    queryFn: () => projectsApi.getProject(id),
    enabled: !!id,
  });

  const membersQuery = useQuery({
    queryKey: ["projects", id, "members"],
    queryFn: () => projectsApi.getProjectMembers(id),
    enabled: !!id,
  });

  const tasksQuery = useQuery({
    queryKey: ["projects", id, "tasks"],
    queryFn: () => projectsApi.getProjectTasks(id),
    enabled: !!id,
  });

  const addMemberMutation = useMutation({
    mutationFn: ({ userId }) => projectsApi.addProjectMember(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", id, "members"] });
      queryClient.invalidateQueries({ queryKey: ["projects", id] });
      toast({
        title: "Success",
        description: "Member added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add member",
        variant: "destructive",
      });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: ({ userId }) => projectsApi.removeProjectMember(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", id, "members"] });
      queryClient.invalidateQueries({ queryKey: ["projects", id] });
      toast({
        title: "Success",
        description: "Member removed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove member",
        variant: "destructive",
      });
    },
  });

  return {
    project: projectQuery.data,
    members: membersQuery.data,
    tasks: tasksQuery.data,
    isLoading:
      projectQuery.isLoading || membersQuery.isLoading || tasksQuery.isLoading,
    isError: projectQuery.isError,
    error: projectQuery.error,
    addMember: addMemberMutation,
    removeMember: removeMemberMutation,
  };
}
