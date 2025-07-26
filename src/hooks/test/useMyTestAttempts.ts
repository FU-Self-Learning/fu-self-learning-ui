import { useQuery } from '@tanstack/react-query';
import { getMyTestAttempts } from '@/shared/api/test.api';

export const useMyTestAttempts = (courseId?: string) => {
  return useQuery({
    queryKey: ['test-attempts', 'me', courseId],
    queryFn: () => getMyTestAttempts(courseId),
  });
};
