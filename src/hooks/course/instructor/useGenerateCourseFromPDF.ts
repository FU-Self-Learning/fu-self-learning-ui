import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import { extractErrorMessage } from '@/utils/ErrorHandle';
import { generateCourseFromPDF } from '@/shared/api/course.api';

export const useGenerateCourseFromPDF = () => {
  return useMutation({
    mutationFn: (file: File) => generateCourseFromPDF(file),
    onSuccess: () => {
      message.success('Course structure generated successfully!');
    },
    onError: (error) => {
      message.error(extractErrorMessage(error) || 'Failed to generate course from PDF');
    },
  });
};
