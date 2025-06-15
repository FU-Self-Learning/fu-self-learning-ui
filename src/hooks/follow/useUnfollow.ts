import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unfollowUser } from "@/shared/api/follow.api";
import { message } from "antd";
import { UnfollowerResponse } from "@/types/followType";

export const useUnfollow = () => {
  const queryClient = useQueryClient();
  return useMutation<UnfollowerResponse, Error, number>({
    mutationFn: unfollowUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      message.success("Unfollowed successfully!");
    },
    onError: (error) => {
      message.error("Failed to unfollow: " + error?.message);
    },
  });
};
