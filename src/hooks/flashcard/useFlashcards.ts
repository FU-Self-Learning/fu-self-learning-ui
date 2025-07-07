import { useQuery } from '@tanstack/react-query';
import { getFlashcardsWithFilter } from '@/shared/api/flashcard.api';

export interface FlashcardFilter {
  courseId?: number;
  topicId?: number;
  lessonId?: number;
}

export const useFlashcards = (filter: FlashcardFilter = {}) => {
  return useQuery({
    queryKey: ['flashcards', filter],
    queryFn: async () => {
      let url = 'flashcards';
      if (filter.courseId) url = `flashcards/course/${filter.courseId}`;
      else if (filter.topicId) url = `flashcards/topic/${filter.topicId}`;
      else if (filter.lessonId) url = `flashcards/lesson/${filter.lessonId}`;
      const res = await getFlashcardsWithFilter(url);
      return res;
    },
  });
};
