import { useQuery } from '@tanstack/react-query';
import { VideoProgress } from '@/types/testType';
import { getVideoProgress } from '@/shared/api/video-progress.api';

export const useVideoProgress = (lessonId: number | string | undefined) => {
  return useQuery<VideoProgress | null>({
    queryKey: ['video-progress', lessonId],
    queryFn: () => getVideoProgress(Number(lessonId)),
    enabled: !!lessonId && Number(lessonId) > 0,
  });
};
