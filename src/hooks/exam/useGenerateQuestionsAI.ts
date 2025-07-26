import { useMutation } from '@tanstack/react-query';
import { generateQuestionsAI } from '@/shared/api/exam.api';

export const useGenerateQuestionsAI = () => {
  const mutation = useMutation({
    mutationFn: ({
      topicId,
      topicTitle,
      count,
    }: {
      topicId: number;
      topicTitle: string;
      count: number;
    }) => generateQuestionsAI(topicId, topicTitle, count),
  });

  return {
    generate: (topicId: number, topicTitle: string, count: number) =>
      mutation.mutateAsync({ topicId, topicTitle, count }),
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  };
};
