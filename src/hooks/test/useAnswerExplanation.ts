import { useMutation } from '@tanstack/react-query';
import { getAnswerExplanation } from '@/shared/api/test.api';

export const useAnswerExplanation = () => {
  return useMutation({
    mutationFn: getAnswerExplanation,
  });
};
