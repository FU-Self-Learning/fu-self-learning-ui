import { useQuery } from '@tanstack/react-query';
import { getAllUsersSocial } from '../../shared/api/user.api';

export const useUsersSocial = () => {
  return useQuery({
    queryKey: ['usersSocial'],
    queryFn: getAllUsersSocial,
  });
};
