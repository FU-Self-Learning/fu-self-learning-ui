import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteExam } from '@/shared/api/exam.api';
import { message } from 'antd';
import { extractErrorMessage } from '@/utils/ErrorHandle';

export const useDeleteExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (examId: number) => deleteExam(examId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      queryClient.invalidateQueries({ queryKey: ['my-exams'] });
      message.success('Exam deleted successfully!');
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error);
      message.error(`Failed to delete exam: ${errorMessage}`);
    },
  });
};
