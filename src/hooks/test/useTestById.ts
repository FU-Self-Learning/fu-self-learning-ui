import { useQuery } from '@tanstack/react-query';
import { getTestDetail } from '@/shared/api/test.api';

export const useTestById = (testId: number) => {
  return useQuery({
    queryKey: ['test', testId],
    queryFn: () => getTestDetail(testId),
    enabled: !!testId,
  });
};
