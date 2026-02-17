import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as tasksApi from '@/lib/api/tasks';
import { useToast } from '@/lib/hooks/use-toast';

export function useTasks(projectId) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const tasksQuery = useQuery({
    queryKey: projectId ? ['projects', projectId, 'tasks'] : ['tasks'],
    queryFn: () => projectId ? tasksApi.getTasks() : tasksApi.getTasks(), // Fallback if no specific filter
    // Note: Technically the backend has project specific tasks, which we use in useProject
  });

  const createTaskMutation = useMutation({
    mutationFn: ({ projectId, data }) => tasksApi.createTask(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId, 'tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: 'Success',
        description: 'Task created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.userMessage || 'Failed to create task',
        variant: 'destructive',
      });
    },
  });

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    createTask: createTaskMutation,
  };
}

export function useTask(id) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const taskQuery = useQuery({
    queryKey: ['tasks', id],
    queryFn: () => tasksApi.getTask(id),
    enabled: !!id,
  });

  const updateTaskMutation = useMutation({
    mutationFn: (data) => tasksApi.updateTask(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', id] });
      queryClient.invalidateQueries({ queryKey: ['projects', data.project?.id, 'tasks'] });
      toast({
        title: 'Success',
        description: 'Task updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.userMessage || 'Failed to update task',
        variant: 'destructive',
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status) => tasksApi.updateTaskStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', id] });
      queryClient.invalidateQueries({ queryKey: ['projects', data.project?.id, 'tasks'] });
      toast({
        title: 'Success',
        description: `Task moved to ${data.status}`,
      });
    },
  });

  const assignUserMutation = useMutation({
    mutationFn: (userId) => tasksApi.assignTask(id, userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', id] });
      toast({
        title: 'Success',
        description: 'Task assigned successfully',
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: () => tasksApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      });
    },
  });

  const addLabelMutation = useMutation({
    mutationFn: (labelId) => tasksApi.addTaskLabel(id, labelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', id] });
    },
  });

  const removeLabelMutation = useMutation({
    mutationFn: (labelId) => tasksApi.removeTaskLabel(id, labelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', id] });
    },
  });

  return {
    task: taskQuery.data,
    isLoading: taskQuery.isLoading,
    isError: taskQuery.isError,
    updateTask: updateTaskMutation,
    updateStatus: updateStatusMutation,
    assignUser: assignUserMutation,
    deleteTask: deleteTaskMutation,
    addLabel: addLabelMutation,
    removeLabel: removeLabelMutation,
  };
}
