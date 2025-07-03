import api from './index';
import { APP_URL } from '../constants/apiConstants';
import { CategoryCourse } from '@/types/courseType';

export const getCategories = async (): Promise<CategoryCourse[]> => {
  const response = await api.get(`${APP_URL}/categories`);
  return response.data;
};
