import { APP_URL } from "../constants/apiConstants";
import api from "./index";
import { PostResponse } from "@/types/postType";

export const getPosts = async (): Promise<PostResponse[]> => {
  const response = await api.get(`${APP_URL}/posts`);
  return response.data;
};

export const createPost = async (formData: FormData): Promise<PostResponse> => {
  const response = await api.post(`${APP_URL}/posts`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
    transformRequest: [(data) => data],
  });
  return response.data;
};
