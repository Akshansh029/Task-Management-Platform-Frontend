import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as commentsApi from '@/lib/api/comments';
import { useToast } from '@/lib/hooks/use-toast';

export function useComments(taskId) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const commentsQuery = useQuery({
    queryKey: ['tasks', taskId, 'comments'],
    queryFn: () => commentsApi.getTaskComments(taskId),
    enabled: !!taskId,
  });

  const createCommentMutation = useMutation({
    mutationFn: (data) => commentsApi.createComment(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId, 'comments'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
      toast({
        title: 'Success',
        description: 'Comment posted',
      });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ id, data }) => commentsApi.updateComment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId, 'comments'] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (id) => commentsApi.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId, 'comments'] });
      toast({
        title: 'Success',
        description: 'Comment deleted',
      });
    },
  });

  return {
    comments: commentsQuery.data || [],
    isLoading: commentsQuery.isLoading,
    createComment: createCommentMutation,
    updateComment: updateCommentMutation,
    deleteComment: deleteCommentMutation,
  };
}
