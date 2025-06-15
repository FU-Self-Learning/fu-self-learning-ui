import { APP_URL } from "../constants/apiConstants";
import api from "./index";
import { Post } from "@/types/postType";

export const getAllPosts = async (pageParam: number = 1): Promise<Post[]> => {
  const response = await api.get(`${APP_URL}/posts?page=${pageParam}`);
  return response.data;
};

export const createPost = async (formData: FormData): Promise<Post> => {
  const response = await api.post(`${APP_URL}/posts`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
    transformRequest: [(data) => data],
  });
  return response.data;
};
