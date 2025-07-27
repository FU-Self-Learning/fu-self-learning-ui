import { APP_URL } from '../constants/apiConstants';
import api from './index';
import { PostResponse } from '@/types/postType';

export const getPosts = async (): Promise<PostResponse[]> => {
  const response = await api.get(`${APP_URL}/posts`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  return response.data;
};

export const createPost = async (postData: FormData): Promise<PostResponse> => {
  const response = await api.post(`${APP_URL}/posts`, postData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const likePost = async (postId: number): Promise<PostResponse> => {
  const response = await api.post(`${APP_URL}/posts/${postId}/like`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  return response.data;
};

export const unlikePost = async (postId: number): Promise<PostResponse> => {
  const response = await api.delete(`${APP_URL}/posts/${postId}/like`, {
    data: {},
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  return response.data;
};

export const getPostLikeStatus = async (postId: number): Promise<{ count: number; liked: boolean }> => {
  const response = await api.get(`${APP_URL}/posts/${postId}/like`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  return response.data;
};

export const deletePost = async (postId: number): Promise<void> => {
  await api.delete(`${APP_URL}/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
};
