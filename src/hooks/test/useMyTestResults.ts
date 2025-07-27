import { useQuery } from '@tanstack/react-query';
import { getTestResults } from '@/shared/api/test.api';

export const useMyTestResults = (courseId?: number) => {
  return useQuery({
    queryKey: ['test-results', 'me', courseId],
    queryFn: () => getTestResults(courseId),
  });
};
