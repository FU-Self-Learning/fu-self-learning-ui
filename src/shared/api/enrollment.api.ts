import api from './index';
import { APP_URL } from '../constants/apiConstants';

export const enrollmentApi = {
  getMyEnrolledCourses: () => api.get(`${APP_URL}/enrollments/my-courses`),

  checkEnrollment: (courseId: string) => api.get(`${APP_URL}/enrollments/course/${courseId}/check`),

  updateProgress: (courseId: string, progress: number) => 
    api.patch(`${APP_URL}/enrollments/course/${courseId}/progress`, { progress }),

  getCourseStats: (courseId: string) => api.get(`${APP_URL}/enrollments/course/${courseId}/stats`),
};
