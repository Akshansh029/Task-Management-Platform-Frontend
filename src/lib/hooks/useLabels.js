import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as labelsApi from '@/lib/api/labels';
import { useToast } from '@/lib/hooks/use-toast';

export function useLabels() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const labelsQuery = useQuery({
    queryKey: ['labels'],
    queryFn: labelsApi.getLabels,
  });

  const createLabelMutation = useMutation({
    mutationFn: labelsApi.createLabel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
      toast({
        title: 'Success',
        description: 'Label created successfully',
      });
    },
  });

  const deleteLabelMutation = useMutation({
    mutationFn: labelsApi.deleteLabel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
      toast({
        title: 'Success',
        description: 'Label deleted successfully',
      });
    },
  });

  return {
    labels: labelsQuery.data || [],
    isLoading: labelsQuery.isLoading,
    createLabel: createLabelMutation,
    deleteLabel: deleteLabelMutation,
  };
}
