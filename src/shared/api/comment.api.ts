import { CommentResponse } from '@/types/commentType';
import { APP_URL } from '../constants/apiConstants';
import api from './index';

export const getCommentsByPostId = async (postId: number): Promise<CommentResponse[]> => {
  const response = await api.get(`${APP_URL}/commentsPost/${postId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  return response.data;
};

export const createComment = async (
  postId: number,
  content: string,
  parentId?: null | number,
): Promise<CommentResponse> => {
  try {
    const response = await api.post(
      `${APP_URL}/commentsPost`,
      {
        postId,
        content,
        parentId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};
