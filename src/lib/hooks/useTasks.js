import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as tasksApi from "@/lib/api/tasks";
import { useToast } from "@/lib/hooks/use-toast";

export function useTasks(projectId, initialPage = 0, initialSize = 10) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [pageNo, setPageNo] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialSize);

  const tasksQuery = useQuery({
    queryKey: projectId
      ? ["projects", projectId, "tasks", pageNo, pageSize]
      : ["tasks", pageNo, pageSize],
    queryFn: () => tasksApi.getTasks(projectId, pageNo, pageSize),
  });

  const createTaskMutation = useMutation({
    mutationFn: ({ projectId, data }) => tasksApi.createTask(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "tasks"],
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create task",
        variant: "destructive",
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, data, projectId }) =>
      tasksApi.updateTask(taskId, data, projectId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.taskId] });
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "tasks"],
      });
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
        variant: "destructive",
      });
    },
  });

  const assignTaskMutation = useMutation({
    mutationFn: ({ taskId, userId, projectId }) =>
      tasksApi.assignTask(taskId, userId, projectId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.taskId] });
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "tasks"],
      });
      toast({
        title: "Success",
        description: "Task assigned successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to assign task",
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: ({ taskId, projectId }) =>
      tasksApi.deleteTask(taskId, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete task",
        variant: "destructive",
      });
    },
  });

  return {
    tasks: tasksQuery.data || { content: [] },
    isLoading: tasksQuery.isLoading,
    pageNo,
    setPageNo,
    pageSize,
    setPageSize,
    createTask: createTaskMutation,
    updateTask: updateTaskMutation,
    assignTask: assignTaskMutation,
    deleteTask: deleteTaskMutation,
  };
}

export function useTask(id, projectId) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const taskQuery = useQuery({
    queryKey: ["tasks", id],
    queryFn: () => tasksApi.getTask(id, projectId),
    enabled: !!id,
  });

  const updateTaskMutation = useMutation({
    mutationFn: (data) => tasksApi.updateTask(id, data, projectId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "tasks"],
      });
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status) => tasksApi.updateTaskStatus(id, status, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "tasks"],
      });
      toast({
        title: "Success",
        description: `Task status updated successfully`,
      });
    },
  });

  const assignUserMutation = useMutation({
    mutationFn: (userId) => tasksApi.assignTask(id, userId, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
      toast({
        title: "Success",
        description: "Task assigned successfully",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: () => tasksApi.deleteTask(id, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    },
  });

  const addLabelMutation = useMutation({
    mutationFn: (labelId) => tasksApi.addTaskLabel(id, labelId, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
    },
  });

  const removeLabelMutation = useMutation({
    mutationFn: (labelId) => tasksApi.removeTaskLabel(id, labelId, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
    },
  });

  return {
    task: taskQuery.data,
    isLoading: taskQuery.isLoading,
    isError: taskQuery.isError,
    error: taskQuery.error,
    updateTask: updateTaskMutation,
    updateStatus: updateStatusMutation,
    assignUser: assignUserMutation,
    deleteTask: deleteTaskMutation,
    addLabel: addLabelMutation,
    removeLabel: removeLabelMutation,
  };
}
