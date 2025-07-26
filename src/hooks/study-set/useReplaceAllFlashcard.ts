import { useMutation, useQueryClient } from '@tanstack/react-query';
import { replaceFlashcards } from '@/shared/api/studyset.api';
import { message } from 'antd';

export const useReplaceAllFlashcard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ studySetId, flashcards }: { studySetId: number; flashcards: any[] }) =>
      replaceFlashcards(studySetId, flashcards),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sets'] });
      message.success('Flashcards replaced successfully!');
    },
    onError: () => {
      message.error('Failed to replace flashcards');
    },
  });
};
