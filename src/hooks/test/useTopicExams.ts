import { useQuery } from '@tanstack/react-query';
import { getTopicExams } from '@/shared/api/test.api';

export const useTopicExams = (courseId: number) => {
  return useQuery({
    queryKey: ['topic-exams', courseId],
    queryFn: () => getTopicExams(courseId),
    enabled: !!courseId,
  });
};
