import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPosts, deletePost } from "@/shared/api/post.api";

export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
