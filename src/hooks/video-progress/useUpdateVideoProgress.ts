import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateVideoProgress } from '@/shared/api/video-progress.api';
import { VideoProgress } from '@/types/testType';

interface UseUpdateVideoProgressOptions {
  onSuccess?: (data: VideoProgress) => void;
}

export const useUpdateVideoProgress = (options?: UseUpdateVideoProgressOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { lessonId: number; watchedDuration: number; totalDuration: number }) =>
      updateVideoProgress(data),
    onSuccess: (data: VideoProgress) => {
      // Invalidate and refetch video progress for this lesson
      queryClient.invalidateQueries({ queryKey: ['video-progress', data.lessonId] });

      // If video is completed, invalidate all video progress queries to refresh the UI
      if (data.isCompleted) {
        console.log(`Video ${data.lessonId} completed, progress: ${data.progressPercentage}%`);
        // Invalidate all video progress queries to refresh the course content
        queryClient.invalidateQueries({ queryKey: ['video-progress'] });
      }

      // Call the custom onSuccess callback if provided
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Failed to update video progress:', error);
    },
  });
};
