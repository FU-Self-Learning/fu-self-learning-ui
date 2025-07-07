import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { deleteFlashcard } from '@/shared/api/flashcard.api';

export const useDeleteFlashcard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => deleteFlashcard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
      message.success('Flashcard deleted successfully!');
    },
    onError: () => {
      message.error('Failed to delete flashcard');
    },
  });
};
