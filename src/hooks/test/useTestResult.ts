import { useQuery } from '@tanstack/react-query';
import { getTestResult, getTestResultDetail } from '@/shared/api/test.api';

export const useTestResult = (attemptId: number) => {
  return useQuery({
    queryKey: ['test-result', attemptId],
    queryFn: () => getTestResult(attemptId),
    enabled: !!attemptId,
  });
};

export const useTestResultDetail = (attemptId: number) => {
  return useQuery({
    queryKey: ['test-result-detail', attemptId],
    queryFn: () => getTestResultDetail(attemptId),
    enabled: !!attemptId,
  });
};
