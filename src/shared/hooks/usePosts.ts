import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllPosts } from "../api/post.api";

export const usePosts = () => {
  return useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam }) => getAllPosts(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 10) {
        return undefined;
      }
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });
};
