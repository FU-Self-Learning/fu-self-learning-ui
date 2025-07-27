import { useQuery } from '@tanstack/react-query';
import { getFinalExam } from '@/shared/api/test.api';

export const useFinalExam = (courseId: number) => {
  return useQuery({
    queryKey: ['final-exam', courseId],
    queryFn: () => getFinalExam(courseId),
    enabled: !!courseId,
  });
};
