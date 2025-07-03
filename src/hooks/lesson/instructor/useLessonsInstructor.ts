import { useQuery } from '@tanstack/react-query';
import { getLessonsInstructor } from '@/shared/api/lesson.api';

export const useLessonsInstructor = (topicId: string) => {
  return useQuery({
    queryKey: ['lessonsInstructor', topicId],
    queryFn: () => getLessonsInstructor(topicId),
    enabled: !!topicId,
  });
};
