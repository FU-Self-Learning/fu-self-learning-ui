import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStudySet } from '@/shared/api/studyset.api';
import { message } from 'antd';

export const useUpdateStudySet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => updateStudySet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sets'] });
      message.success('Study set updated successfully!');
    },
    onError: () => {
      message.error('Failed to update study set');
    },
  });
};
