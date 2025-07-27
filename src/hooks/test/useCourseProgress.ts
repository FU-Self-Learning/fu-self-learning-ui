import { useQuery } from '@tanstack/react-query';
import { getCourseProgress } from '@/shared/api/test.api';

export const useCourseProgress = (courseId: number) => {
  return useQuery({
    queryKey: ['course-progress', courseId],
    queryFn: () => getCourseProgress(courseId),
    enabled: !!courseId,
  });
};
