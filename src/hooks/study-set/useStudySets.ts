import { useQuery } from '@tanstack/react-query';
import { getStudySets } from '@/shared/api/studyset.api';

export const useStudySets = (params?: { tag?: string; isPublic?: boolean }) => {
  return useQuery({
    queryKey: ['study-sets', params],
    queryFn: () => getStudySets(params),
  });
};
