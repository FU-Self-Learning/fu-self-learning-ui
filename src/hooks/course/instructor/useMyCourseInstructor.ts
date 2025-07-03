import { getMyCourses } from '@/shared/api/course.api';
import { useQuery } from '@tanstack/react-query';

export const useMyCourseInstructor = () => {
  return useQuery({
    queryKey: ['my-courses-instructor'],
    queryFn: getMyCourses,
  });
};
