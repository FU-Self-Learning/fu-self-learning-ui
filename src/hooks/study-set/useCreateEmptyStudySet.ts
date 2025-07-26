import { createEmptyStudySet } from '@/shared/api/studyset.api';
import { extractErrorMessage } from '@/utils/ErrorHandle';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

export const useCreateEmptyStudySet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmptyStudySet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sets'] });
      message.success('Study set created successfully!');
    },
    onError: (error) => {
      message.error(extractErrorMessage(error) || 'Failed to create study set');
    },
  });
};
