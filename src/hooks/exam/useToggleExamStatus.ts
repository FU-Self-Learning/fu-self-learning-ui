import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleExamStatus } from '@/shared/api/exam.api';
import { message } from 'antd';
import { extractErrorMessage } from '@/utils/ErrorHandle';

export const useToggleExamStatus = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (examId: number) => toggleExamStatus(examId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor-exams'] });
      message.success('Exam status updated successfully');
    },
    onError: (error) => {
      message.error(extractErrorMessage(error) || 'Failed to update exam status');
    },
  });

  return {
    toggle: (examId: number) => mutation.mutateAsync(examId),
    isPending: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  };
};
