import { useQuery } from '@tanstack/react-query';
import { getTestsByCourse } from '@/shared/api/test.api';
import { TestListFilter } from '@/types/testType';

export const useTests = (courseId: string, filters?: TestListFilter) => {
  return useQuery({
    queryKey: ['tests', courseId, filters],
    queryFn: () => getTestsByCourse(Number(courseId)),
    enabled: !!courseId,
  });
};
