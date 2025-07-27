import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPosts, deletePost, getPostLikeStatus } from '@/shared/api/post.api';
import { PostResponse } from '@/types/postType';

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      // First, fetch all posts
      const posts = await getPosts();
      
      // Then, fetch like status for each post
      const postsWithLikeStatus = await Promise.all(
        posts.map(async (post: PostResponse) => {
          try {
            const likeStatus = await getPostLikeStatus(post.id);
            return {
              ...post,
              likesCount: likeStatus.count,
              isLikedByCurrentUser: likeStatus.liked
            };
          } catch (error) {
            console.error(`Error fetching like status for post ${post.id}:`, error);
            return post; // Return the post without updated like status if there's an error
          }
        })
      );
      
      console.log('Fetched posts with like status:', postsWithLikeStatus);
      return postsWithLikeStatus;
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
