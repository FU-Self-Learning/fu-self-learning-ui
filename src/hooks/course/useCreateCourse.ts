import { createCourse } from '@/shared/api/course.api';
import { extractErrorMessage } from '@/utils/ErrorHandle';
import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';

export const useCreateCourse = () => {
  return useMutation({
    mutationFn: (data: FormData) => createCourse(data),
    onSuccess: () => {
      message.success('Course created successfully');
    },
    onError: (error) => {
      message.error(extractErrorMessage(error));
    },
  });
};
