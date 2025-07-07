import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { createFlashcard } from '@/shared/api/flashcard.api';
import { FlashcardRequest } from '@/types/flashcardType';

export const useCreateFlashcard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FlashcardRequest) => createFlashcard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
      message.success('Flashcard created successfully!');
    },
    onError: () => {
      message.error('Failed to create flashcard');
    },
  });
};
