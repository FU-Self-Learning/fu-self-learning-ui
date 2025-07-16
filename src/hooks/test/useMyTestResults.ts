import { useQuery } from '@tanstack/react-query';
import { getMyTestResults } from '@/shared/api/test.api';
import { MyTestResultsFilter } from '@/types/testType';

export const useMyTestResults = (filters?: MyTestResultsFilter) => {
  return useQuery({
    queryKey: ['test-results', 'me', filters],
    queryFn: () => getMyTestResults(filters),
  });
};
