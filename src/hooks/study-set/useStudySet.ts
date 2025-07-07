import { useQuery } from '@tanstack/react-query';
import { getStudySet } from '@/shared/api/studyset.api';

export const useStudySet = (id: number) => {
  return useQuery({
    queryKey: ['study-set', id],
    queryFn: () => getStudySet(id),
    enabled: !!id,
  });
};
