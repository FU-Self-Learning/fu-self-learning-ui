import { useQuery } from '@tanstack/react-query';
import { getFlashcardById } from '@/shared/api/flashcard.api';

export const useFlashcard = (id: number) => {
  return useQuery({
    queryKey: ['flashcard', id],
    queryFn: () => getFlashcardById(id),
    enabled: !!id,
  });
};
