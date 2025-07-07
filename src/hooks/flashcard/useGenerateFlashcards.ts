import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { FlashcardGenerateRequest } from '@/types/flashcardType';
import { generateFlashcards } from '@/shared/api/flashcard.api';

export const useGenerateFlashcards = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FlashcardGenerateRequest) => generateFlashcards(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
      message.success('Flashcards generated successfully!');
    },
    onError: () => {
      message.error('Failed to generate flashcards');
    },
  });
};
