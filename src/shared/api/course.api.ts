import { APP_URL } from "../constants/apiConstants";
import api from "./index";
import {
  CourseDetailResponse,
  CoursesResponse,
} from "@/types/courseType";

export const getCourses = async (): Promise<CoursesResponse[]> => {
  const response = await api.get(`${APP_URL}/courses`);
  return response.data;
};

export const getCourseById = async (
  id: string
): Promise<CourseDetailResponse> => {
  const response = await api.get(`${APP_URL}/courses/${id}`);
  return response.data;
};

export const createCourse = async (course: CoursesResponse) => {
  const response = await api.post(`${APP_URL}/courses`, course);
  return response.data;
};

export const updateCourse = async (id: string, course: CoursesResponse) => {
  const response = await api.put(`${APP_URL}/courses/${id}`, course);
  return response.data;
};

export const deleteCourse = async (id: string) => {
  const response = await api.delete(`${APP_URL}/courses/${id}`);
  return response.data;
};
