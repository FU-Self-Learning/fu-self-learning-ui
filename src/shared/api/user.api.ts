import { UserInfo } from '@/providers/auth/types/authType';
import { FollowRelationship } from '@/types/followType';
import api from '.';
import { APP_URL } from '../constants/apiConstants';
// ...existing code...
export const fetchFollowerUsers = async (): Promise<UserInfo[]> => {
  try {
    const response = await api.get<FollowRelationship[]>(`${APP_URL}/follow/followers`);
    return response.data.map((item) => item.followingUser);
  } catch (error) {
    console.error('Error fetching follower users:', error);
    throw error;
  }
};

export const fetchUserProfile = async (): Promise<UserInfo> => {
  const response = await api.get(`${APP_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  return response.data;
};

export const updateUserProfile = async (payload: UserInfo): Promise<UserInfo> => {
  const response = await api.put(`${APP_URL}/users/me`, payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  return response.data;
};

export const uploadAvatar = async (payload: FormData): Promise<UserInfo> => {
  const response = await api.post(`${APP_URL}/users/avatar`, payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getAllUsers = async (): Promise<UserInfo[]> => {
  try {
    const response = await api.get(`${APP_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

export const getAllUsersSocial = async (): Promise<UserInfo[]> => {
  try {
    const response = await api.get(`${APP_URL}/users/social`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};
