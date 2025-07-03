import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '@/shared/api/auth.api';
import { message } from 'antd';
import { extractErrorMessage } from '@/utils/ErrorHandle';

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      message.success('Password has been reset successfully');
    },
    onError: (error) => {
      const msg = extractErrorMessage(error);
      message.error(msg);
    },
  });
};
