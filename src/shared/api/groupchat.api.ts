
import api from '.';
import { APP_URL } from '../constants/apiConstants';
import { Group } from '@/types/groupType';

export interface CreateGroupDto {
  name: string;
  courseId: number;
  memberIds: number[];
}

export const createGroupChat = async (dto: CreateGroupDto): Promise<any> => {
  try {
    const response = await api.post(`${APP_URL}/group-chat/create`, dto);
    return response.data;
  } catch (error) {
    console.error('Error creating group chat:', error);
    throw error;
  }
};

export const fetchUserGroups = async (): Promise<Group[]> => {
  try {
    const response = await api.get(`${APP_URL}/group-chat/my-groups`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user groups:', error);
    throw error;
  }
};

export const joinCommunityGroupChat = async (courseId: number): Promise<any> => {
  try {
    const response = await api.post(`${APP_URL}/group-chat/join-community`, { courseId });
    return response.data;
  } catch (error) {
    console.error('Error joining community group chat:', error);
    throw error;
  }
};
