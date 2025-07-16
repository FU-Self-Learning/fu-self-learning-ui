import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateExam, toggleExamStatus } from '@/shared/api/exam.api';
import { ExamRequest } from '@/types/examType';
import { message } from 'antd';
import { extractErrorMessage } from '@/utils/ErrorHandle';

export const useUpdateExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ examId, examData }: { examId: number; examData: Partial<ExamRequest> }) =>
      updateExam(examId, examData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['exam', data.id] });
      queryClient.invalidateQueries({ queryKey: ['exams', data.courseId] });
      queryClient.invalidateQueries({ queryKey: ['my-exams'] });
      message.success('Exam updated successfully!');
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error);
      message.error(`Failed to update exam: ${errorMessage}`);
    },
  });
};

export const useToggleExamStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (examId: number) => toggleExamStatus(examId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['exam', data.id] });
      queryClient.invalidateQueries({ queryKey: ['exams', data.courseId] });
      queryClient.invalidateQueries({ queryKey: ['my-exams'] });
      message.success(`Exam ${data.isActive ? 'activated' : 'deactivated'} successfully!`);
    },
    onError: (error) => {
      const errorMessage = extractErrorMessage(error);
      message.error(`Failed to toggle exam status: ${errorMessage}`);
    },
  });
};
