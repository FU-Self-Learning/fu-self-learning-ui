import { useQuery } from '@tanstack/react-query';
import { getAttemptProgress } from '@/shared/api/test.api';

export const useTestProgress = (attemptId: number | null) => {
  return useQuery({
    queryKey: ['testProgress', attemptId],
    queryFn: () => getAttemptProgress(attemptId!),
    enabled: !!attemptId,
    retry: false, // Don't retry on failed attempts to avoid spam
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
  });
};
