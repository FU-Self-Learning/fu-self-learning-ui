import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFinalExam } from '@/shared/api/exam.api';
import { message } from 'antd';
import { extractErrorMessage } from '@/utils/ErrorHandle';

export const useCreateFinalExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (examData: any) => createFinalExam(examData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['instructor-exams', data.courseId] });
      queryClient.invalidateQueries({ queryKey: ['exams', data.courseId] });
      message.success('Final exam created successfully!');
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error);
      message.error(`Failed to create final exam: ${errorMessage}`);
    },
  });
};
