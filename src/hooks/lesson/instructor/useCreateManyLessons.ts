import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { extractErrorMessage } from '@/utils/ErrorHandle';
import { createManyLessons } from '@/shared/api/lesson.api';

interface CreateLessonData {
  title: string;
  description: string;
}

interface CreateManyLessonsRequest {
  topicId: string;
  lessons: CreateLessonData[];
  videoFiles: File[];
}

export const useCreateManyLessons = (topicId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ lessons, videoFiles }: Omit<CreateManyLessonsRequest, 'topicId'>) => {
      const formData = new FormData();

      // Add lessons data as JSON string
      formData.append('createLessonsData', JSON.stringify(lessons));

      // Add video files
      videoFiles.forEach((file) => {
        formData.append('videos', file);
      });

      return createManyLessons(topicId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      queryClient.invalidateQueries({ queryKey: ['lessons', topicId] });
      message.success('Lessons created successfully');
    },
    onError: (error) => {
      message.error(extractErrorMessage(error));
    },
  });
};
