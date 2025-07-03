import { useQuery } from '@tanstack/react-query';
import { getFollowers } from '@/shared/api/follow.api';

export const useFollowers = () => {
  return useQuery({
    queryKey: ['followers'],
    queryFn: getFollowers,
  });
};
