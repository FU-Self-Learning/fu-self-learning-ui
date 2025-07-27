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
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(['posts']);

      // Optimistically update the cache
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

      // Return the context with the previous posts
      return { previousPosts, postId };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
      message.error('Failed to update like status');
    },
    onSuccess: (updatedPost, variables, context) => {
      // Update the specific post in the cache with the server response
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
