import { useQuery } from '@tanstack/react-query';
import { getTestResult } from '@/shared/api/test.api';

export const useTestResult = (attemptId: number) => {
  return useQuery({
    queryKey: ['test-result', attemptId],
    queryFn: () => getTestResult(attemptId),
    enabled: !!attemptId,
  });
};
