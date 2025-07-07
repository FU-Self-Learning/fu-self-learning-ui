import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { deleteStudySet } from '@/shared/api/studyset.api';

export const useDeleteStudySet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStudySet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sets'] });
      message.success('Study set deleted successfully!');
    },
    onError: () => {
      message.error('Failed to delete study set');
    },
  });
};
