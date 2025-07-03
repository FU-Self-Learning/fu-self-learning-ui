import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { updateTopicInstructor } from '@/shared/api/topic.api';
import { TopicInstructorCreateRequest } from '@/types/topicType';
import { extractErrorMessage } from '@/utils/ErrorHandle';

export const useUpdateTopic = (courseId: string, topicId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: TopicInstructorCreateRequest) =>
      updateTopicInstructor(courseId, topicId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      message.success('Topic updated successfully');
    },
    onError: (error) => {
      message.error(extractErrorMessage(error));
    },
  });
};
