import { APP_URL } from '../constants/apiConstants';
import api from './index';
import {
  CourseDetailResponse,
  CourseInstructorDetailResponse,
  CoursesResponse,
  CreateCourseRequest,
} from '@/types/courseType';

export const getCourses = async (): Promise<CoursesResponse[]> => {
  const response = await api.get(`${APP_URL}/courses`);
  return response.data;
};

export const getCourseById = async (id: string): Promise<CourseDetailResponse> => {
  const response = await api.get(`${APP_URL}/courses/${id}`);
  return response.data;
};

export const createCourse = async (course: FormData) => {
  const response = await api.post(`${APP_URL}/courses`, course, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getCourseByCategory = async (categoryId: string): Promise<CoursesResponse[]> => {
  const response = await api.get(`${APP_URL}/courses/category/${categoryId}`);
  return response.data;
};

export const updateCourse = async (id: string, course: CreateCourseRequest) => {
  const response = await api.put(`${APP_URL}/courses/${id}`, course);
  return response.data;
};

export const deleteCourse = async (id: string) => {
  const response = await api.delete(`${APP_URL}/courses/${id}`);
  return response.data;
};

// ================================ Instructor ================================

export const getMyCourses = async () => {
  const response = await api.get(`${APP_URL}/courses/instructor`);
  return response.data;
};

export const getCourseInstructorDetail = async (
  courseId: string,
): Promise<CourseInstructorDetailResponse> => {
  const response = await api.get(`${APP_URL}/courses/instructor/${courseId}`);
  return response.data;
};

// ================================ PDF Course Generation ================================

export interface GeneratedTopic {
  title: string;
  description: string;
  lessons: GeneratedLesson[];
}

export interface GeneratedLesson {
  title: string;
  description: string;
}

export interface GeneratedCourseData {
  course: {
    title: string;
    description: string;
    categoryIds: number[];
  };
  topics: GeneratedTopic[];
}

export const generateCourseFromPDF = async (file: File): Promise<GeneratedCourseData> => {
  const formData = new FormData();
  formData.append('pdf', file);

  const response = await api.post(`${APP_URL}/courses/generate-from-pdf`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
