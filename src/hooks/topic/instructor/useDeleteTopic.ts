import { useMutation } from '@tanstack/react-query';
import { deleteTopicInstructor } from '@/shared/api/topic.api';
import { message } from 'antd';
import { extractErrorMessage } from '@/utils/ErrorHandle';
import { useQueryClient } from '@tanstack/react-query';

export const useDeleteTopic = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (topicId: string) => deleteTopicInstructor(courseId, topicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics', courseId] });
      message.success('Topic deleted successfully');
    },
    onError: (error) => {
      message.error(extractErrorMessage(error));
    },
  });
};
