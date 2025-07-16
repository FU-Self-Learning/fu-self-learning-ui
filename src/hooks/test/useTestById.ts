import { useQuery } from '@tanstack/react-query';
import { getTestById } from '@/shared/api/test.api';

export const useTestById = (testId: number) => {
  return useQuery({
    queryKey: ['test', testId],
    queryFn: () => getTestById(testId),
    enabled: !!testId,
  });
};
