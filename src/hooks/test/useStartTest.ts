import { useMutation, useQueryClient } from '@tanstack/react-query';
import { startTest } from '@/shared/api/test.api';
import { StartTestRequest } from '@/types/testType';
import { message } from 'antd';
import { extractErrorMessage } from '@/utils/ErrorHandle';

export const useStartTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StartTestRequest) => startTest(data),
    onSuccess: () => {
      message.success('Test started successfully!');
      queryClient.invalidateQueries({ queryKey: ['test-attempts'] });
    },
    onError: (error: any) => {
      message.error(extractErrorMessage(error) || 'Failed to start test');
    },
  });
};
