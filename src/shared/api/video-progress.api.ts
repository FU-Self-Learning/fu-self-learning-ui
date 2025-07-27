import apiClient from './index';
import { APP_URL } from '../constants/apiConstants';
import { VideoProgress } from '@/types/testType';

export const getVideoProgress = async (lessonId: number): Promise<VideoProgress | null> => {
  const response = await apiClient.get<VideoProgress | null>(
    APP_URL + `/video-progress/lesson/${lessonId}`,
  );
  return response.data;
};

export const updateVideoProgress = async (data: {
  lessonId: number;
  watchedDuration: number;
  totalDuration: number;
}): Promise<VideoProgress> => {
  const response = await apiClient.post<VideoProgress>(APP_URL + '/video-progress/update', data);
  return response.data;
};

export const getTopicVideoProgress = async (
  topicId: number,
): Promise<{
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
}> => {
  const response = await apiClient.get<{
    totalLessons: number;
    completedLessons: number;
    progressPercentage: number;
  }>(APP_URL + `/video-progress/topic/${topicId}/progress`);
  return response.data;
};

export const areAllTopicVideosCompleted = async (
  topicId: number,
): Promise<{
  completed: boolean;
}> => {
  const response = await apiClient.get<{ completed: boolean }>(
    APP_URL + `/video-progress/topic/${topicId}/completed`,
  );
  return response.data;
};
