import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { createStudySet } from '@/shared/api/studyset.api';

export const useCreateStudySet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStudySet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sets'] });
      message.success('Study set created successfully!');
    },
    onError: () => {
      message.error('Failed to create study set');
    },
  });
};
