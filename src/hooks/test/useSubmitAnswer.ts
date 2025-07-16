import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitAnswer } from '@/shared/api/test.api';
import { SubmitAnswerRequest } from '@/types/testType';
import { message } from 'antd';
import { extractErrorMessage } from '@/utils/ErrorHandle';

export const useSubmitAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitAnswerRequest) => submitAnswer(data),
    onSuccess: () => {
      // Optionally invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['test-attempts'] });
    },
    onError: (error: any) => {
      message.error(extractErrorMessage(error) || 'Failed to submit answer');
    },
  });
};
