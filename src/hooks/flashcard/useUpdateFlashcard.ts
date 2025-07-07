import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { FlashcardRequest } from '@/types/flashcardType';
import { updateFlashcard } from '@/shared/api/flashcard.api';

export const useUpdateFlashcard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: FlashcardRequest & { id: number }) =>
      updateFlashcard(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
      message.success('Flashcard updated successfully!');
    },
    onError: () => {
      message.error('Failed to update flashcard');
    },
  });
};
