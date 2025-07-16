import { APP_URL } from '../constants/apiConstants';
import api from './index';
import { ExamResponse, ExamRequest, ExamFilter } from '@/types/examType';

export const getExamsByCourseId = async (
  courseId: number,
  filter?: ExamFilter,
): Promise<ExamResponse[]> => {
  const params = new URLSearchParams();
  if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString());
  if (filter?.search) params.append('search', filter.search);
  if (filter?.type) params.append('type', filter.type);

  const url = `${APP_URL}/tests/course/${courseId}${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await api.get(url);
  return response.data;
};

export const getExamById = async (examId: number): Promise<ExamResponse> => {
  const response = await api.get(`${APP_URL}/tests/${examId}`);
  return response.data;
};

export const createExam = async (examData: ExamRequest): Promise<ExamResponse> => {
  const response = await api.post(`${APP_URL}/tests/with-questions`, examData);
  return response.data;
};

export const updateExam = async (
  examId: number,
  examData: Partial<ExamRequest>,
): Promise<ExamResponse> => {
  const response = await api.put(`${APP_URL}/tests/${examId}`, examData);
  return response.data;
};

export const deleteExam = async (examId: number): Promise<void> => {
  await api.delete(`${APP_URL}/tests/${examId}`);
};

export const toggleExamStatus = async (examId: number): Promise<ExamResponse> => {
  const response = await api.patch(`${APP_URL}/tests/${examId}/toggle-status`);
  return response.data;
};

// Get exams for instructor dashboard
export const getMyExams = async (): Promise<ExamResponse[]> => {
  const response = await api.get(`${APP_URL}/tests/my-exams`);
  return response.data;
};
