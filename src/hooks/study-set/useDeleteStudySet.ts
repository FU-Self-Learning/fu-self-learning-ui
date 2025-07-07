import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/shared/api';
import { message } from 'antd';

export const useDeleteStudySet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/study-sets/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sets'] });
      message.success('Study set deleted successfully!');
    },
    onError: () => {
      message.error('Failed to delete study set');
    },
  });
};
