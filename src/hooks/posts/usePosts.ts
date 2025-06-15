import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/shared/api/post.api";

export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });
};
