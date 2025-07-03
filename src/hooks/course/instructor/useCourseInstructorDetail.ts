import { getCourseInstructorDetail } from '@/shared/api/course.api';
import { useQuery } from '@tanstack/react-query';

export const useCourseInstructorDetail = (id: string) => {
  return useQuery({
    queryKey: ['course-instructor-detail', id],
    queryFn: () => getCourseInstructorDetail(id),
    enabled: !!id,
  });
};
