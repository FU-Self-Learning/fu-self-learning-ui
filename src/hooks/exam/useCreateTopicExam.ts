import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTopicExam } from '@/shared/api/exam.api';
import { message } from 'antd';
import { extractErrorMessage } from '@/utils/ErrorHandle';

export const useCreateTopicExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (examData: any) => createTopicExam(examData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['instructor-exams', data.courseId] });
      queryClient.invalidateQueries({ queryKey: ['exams', data.courseId] });
      message.success('Topic exam created successfully!');
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error);
      message.error(`Failed to create topic exam: ${errorMessage}`);
    },
  });
};
