import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsAPI } from "../api/projects";
import { useToast } from "@/components/ui/use-toast";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: projectsAPI.getAll,
  });
}

export function useProject(id) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => projectsAPI.getById(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: projectsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      toast({ title: "Success", description: "Project created successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create project",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }) => projectsAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["projects"]);
      queryClient.invalidateQueries(["projects", variables.id]);
      toast({ title: "Success", description: "Project updated successfully" });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: projectsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      toast({ title: "Success", description: "Project deleted successfully" });
    },
  });
}

export function useAddMember() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ projectId, userId }) =>
      projectsAPI.addMember(projectId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["projects", variables.projectId]);
      toast({ title: "Success", description: "Member added successfully" });
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ projectId, userId }) =>
      projectsAPI.removeMember(projectId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["projects", variables.projectId]);
      toast({ title: "Success", description: "Member removed successfully" });
    },
  });
}
