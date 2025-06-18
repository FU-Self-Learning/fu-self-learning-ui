import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "@/shared/api/comment.api";
import { message } from "antd";

interface CreateCommentPayload {
  postId: number;
  content: string;
  parentId?: number;
}

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, CreateCommentPayload>({
    mutationFn: ({ postId, content, parentId }) =>
      createComment(postId, content, parentId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });
      message.success("Comment posted successfully!");
    },
    onError: (error) => {
      message.error("Failed to post comment: " + error?.message);
    },
  });
};
