import { useMutation } from "@tanstack/react-query";
import { createPost } from "@/shared/api/post.api";
import { useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { extractErrorMessage } from "@/utils/ErrorHandle";

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postData: FormData) => createPost(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      message.success("Post created successfully");
    },
    onError: (error) => {
      message.error(extractErrorMessage(error));
    },
  });
};
