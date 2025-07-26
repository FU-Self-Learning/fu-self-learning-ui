import { useQuery } from '@tanstack/react-query';
import { getAttemptProgress } from '@/shared/api/test.api';

export const useTestProgress = (attemptId: number | null) => {
  return useQuery({
    queryKey: ['testProgress', attemptId],
    queryFn: () => getAttemptProgress(attemptId!),
    enabled: !!attemptId && attemptId > 0,
  });
};
