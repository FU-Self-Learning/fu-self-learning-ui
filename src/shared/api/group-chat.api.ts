import api from './index';
import { APP_URL } from '../constants/apiConstants';

export const groupChatApi = {
  getMyEnrolledCourses: () => api.get(`${APP_URL}/enrollments/my-courses`),
};
