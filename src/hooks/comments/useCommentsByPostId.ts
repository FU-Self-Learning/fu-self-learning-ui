import { useQuery } from '@tanstack/react-query';
import { getCommentsByPostId } from '@/shared/api/comment.api';

export const useCommentsByPostId = (postId: number) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getCommentsByPostId(postId),
    enabled: !!postId, // Chỉ lấy khi có post
  });
};
