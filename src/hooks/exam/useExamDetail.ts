import { useQuery } from '@tanstack/react-query';
import { getExamById } from '@/shared/api/exam.api';

export const useExamDetail = (examId: number) => {
  return useQuery({
    queryKey: ['exam', examId],
    queryFn: () => getExamById(examId),
    enabled: !!examId,
  });
};
