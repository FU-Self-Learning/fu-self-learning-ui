import { getCategories } from '@/shared/api/category.api';
import { useQuery } from '@tanstack/react-query';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
};
