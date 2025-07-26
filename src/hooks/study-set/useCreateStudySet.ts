import { createStudySet } from '@/shared/api/studyset.api';
import { extractErrorMessage } from '@/utils/ErrorHandle';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

export const useCreateStudySet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStudySet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sets'] });
      message.success('Study set created successfully!');
    },
    onError: (error) => {
      message.error(extractErrorMessage(error) || 'Failed to create study set');
    },
  });
};
