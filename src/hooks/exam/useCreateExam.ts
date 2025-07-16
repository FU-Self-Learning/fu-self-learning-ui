import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createExam } from '@/shared/api/exam.api';
import { ExamRequest } from '@/types/examType';
import { message } from 'antd';
import { extractErrorMessage } from '@/utils/ErrorHandle';

export const useCreateExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (examData: ExamRequest) => createExam(examData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['exams', data.courseId] });
      queryClient.invalidateQueries({ queryKey: ['my-exams'] });
      message.success('Exam created successfully!');
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error);
      message.error(`Failed to create exam: ${errorMessage}`);
    },
  });
};
