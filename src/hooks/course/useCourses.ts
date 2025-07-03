import { getCourses } from '@/shared/api/course.api';
import { useQuery } from '@tanstack/react-query';

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });
};
