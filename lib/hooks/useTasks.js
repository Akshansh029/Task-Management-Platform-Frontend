import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksAPI } from "../api/tasks";
import { useToast } from "@/components/ui/use-toast";

export function useTasks(filters) {
  return useQuery({
    queryKey: ["tasks", filters],
    queryFn: () => tasksAPI.getAll(filters),
  });
}

export function useProjectTasks(projectId) {
  return useQuery({
    queryKey: ["projects", projectId, "tasks"],
    queryFn: () => tasksAPI.getByProject(projectId),
    enabled: !!projectId,
  });
}

export function useTask(id) {
  return useQuery({
    queryKey: ["tasks", id],
    queryFn: () => tasksAPI.getById(id),
    enabled: !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ projectId, data }) => tasksAPI.create(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["projects", variables.projectId, "tasks"]);
      queryClient.invalidateQueries(["tasks"]);
      toast({ title: "Success", description: "Task created successfully" });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }) => tasksAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["tasks", variables.id]);
      queryClient.invalidateQueries(["tasks"]);
      toast({ title: "Success", description: "Task updated successfully" });
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => tasksAPI.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: tasksAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toast({ title: "Success", description: "Task deleted successfully" });
    },
  });
}
