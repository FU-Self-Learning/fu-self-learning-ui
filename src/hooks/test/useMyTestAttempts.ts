import { useQuery } from '@tanstack/react-query';
import { getTestResults } from '@/shared/api/test.api';

export const useMyTestAttempts = (courseId?: string) => {
  return useQuery({
    queryKey: ['test-attempts', 'me', courseId],
    queryFn: () => getTestResults(courseId ? Number(courseId) : undefined),
  });
};
