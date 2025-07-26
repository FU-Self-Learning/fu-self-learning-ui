import { useMutation } from '@tanstack/react-query';
import { generateQuestionsByTopic } from '@/shared/api/exam.api';

export const useGenerateQuestionsByTopic = () => {
  const mutation = useMutation({
    mutationFn: ({ topicId, count }: { topicId: number; count: number }) =>
      generateQuestionsByTopic(topicId, count),
  });

  return {
    generate: (topicId: number, count: number) => mutation.mutateAsync({ topicId, count }),
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  };
};
