import { useQueries } from '@tanstack/react-query';
import { getVideoProgress } from '@/shared/api/video-progress.api';
import { VideoProgress } from '@/types/testType';
import { LessonInTopic } from '@/types/topicType';

export const useLessonsVideoProgress = (lessons: LessonInTopic[] | undefined) => {
  const queries = useQueries({
    queries: (lessons || []).map((lesson) => ({
      queryKey: ['video-progress', lesson.id],
      queryFn: () => getVideoProgress(lesson.id),
      enabled: !!lesson.id,
    })),
  });

  const results = queries.map((query) => query.data);
  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);

  // Create a map of lessonId to video progress
  const videoProgressMap = new Map<number, VideoProgress | null>();
  (lessons || []).forEach((lesson, index) => {
    videoProgressMap.set(lesson.id, results[index] || null);
  });

  return {
    videoProgressMap,
    isLoading,
    isError,
    results,
  };
};
