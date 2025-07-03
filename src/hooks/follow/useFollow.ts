import { useMutation, useQueryClient } from '@tanstack/react-query';
import { followUser } from '@/shared/api/follow.api';
import { message } from 'antd';
import { FollowResponse } from '@/types/followType';

export const useFollow = () => {
  const queryClient = useQueryClient();
  return useMutation<FollowResponse, Error, number>({
    mutationFn: followUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      message.success('Successfully followed user!');
    },
    onError: (error) => {
      message.error('Failed to follow user: ' + error?.message);
    },
  });
};
