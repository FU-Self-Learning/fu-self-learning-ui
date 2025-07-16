import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeTest } from '@/shared/api/test.api';
import { CompleteTestRequest } from '@/types/testType';
import { message } from 'antd';
import { extractErrorMessage } from '@/utils/ErrorHandle';

export const useCompleteTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompleteTestRequest) => completeTest(data),
    onSuccess: (result) => {
      message.success(
        `Test completed! Score: ${result.score || 0}% ${result.isPassed ? '(Passed)' : '(Failed)'}`,
      );
      queryClient.invalidateQueries({ queryKey: ['test-attempts'] });
      queryClient.invalidateQueries({ queryKey: ['test-results'] });
    },
    onError: (error: any) => {
      message.error(extractErrorMessage(error) || 'Failed to complete test');
    },
  });
};
