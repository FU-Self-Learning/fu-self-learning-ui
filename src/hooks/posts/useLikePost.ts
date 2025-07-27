import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likePost, unlikePost } from '@/shared/api/post.api';
import { message } from 'antd';

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: number; isLiked: boolean }) => {
      if (isLiked) {
        return await unlikePost(postId);
      } else {
        return await likePost(postId);
      }
    },
    onMutate: async ({ postId, isLiked }) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      const previousPosts = queryClient.getQueryData(['posts']);

      queryClient.setQueryData(['posts'], (old: any) => {
        if (!old) return old;
        return old.map((post: any) => {
          if (post.id === postId) {
            return {
              ...post,
              isLikedByCurrentUser: !isLiked,
              likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1,
            };
          }
          return post;
        });
      });

      return { previousPosts, postId };
    },
    onError: (err, variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
      message.error('Failed to update like status');
    },
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(['posts'], (old: any) => {
        if (!old) return old;
        return old.map((post: any) => {
          if (post.id === updatedPost.id) {
            return updatedPost;
          }
          return post;
        });
      });
    },
  });
};
