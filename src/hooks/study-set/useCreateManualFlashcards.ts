import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { createManualFlashcards } from '@/shared/api/studyset.api';

export interface ManualFlashcard {
  front_text: string;
  back_text: string;
  generation_source?: string;
}

export const useCreateManualFlashcards = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      studySetId,
      flashcards,
    }: {
      studySetId: number;
      flashcards: ManualFlashcard[];
    }) => {
      return createManualFlashcards(studySetId, flashcards);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['study-set', variables.studySetId] });
      queryClient.invalidateQueries({ queryKey: ['study-sets'] });
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
      message.success(`Successfully created ${variables.flashcards.length} flashcards!`);
    },
    onError: (error: any) => {
      console.error('Failed to create manual flashcards:', error);
      message.error('Failed to create flashcards. Please try again.');
    },
  });
};
