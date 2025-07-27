import apiClient from './index';
import { APP_URL } from '../constants/apiConstants';
import {
  Test,
  TestResult,
  TestResultDetail,
  TopicExam,
  FinalExam,
  CourseProgress,
  TopicProgress,
} from '@/types/testType';

export const getTestsByCourse = async (courseId: number): Promise<Test[]> => {
  const response = await apiClient.get<Test[]>(APP_URL + `/tests/course/${courseId}`);
  return response.data;
};

export const getTopicExams = async (courseId: number): Promise<TopicExam[]> => {
  const response = await apiClient.get<TopicExam[]>(
    APP_URL + `/tests/course/${courseId}/topic-exams`,
  );
  return response.data;
};

export const getFinalExam = async (courseId: number): Promise<FinalExam | null> => {
  const response = await apiClient.get<FinalExam | null>(
    APP_URL + `/tests/course/${courseId}/final-exam`,
  );
  return response.data;
};

export const getCourseProgress = async (courseId: number): Promise<CourseProgress> => {
  const response = await apiClient.get<CourseProgress>(
    APP_URL + `/tests/course/${courseId}/progress`,
  );
  return response.data;
};

export const getTopicProgress = async (topicId: number): Promise<TopicProgress> => {
  const response = await apiClient.get<TopicProgress>(APP_URL + `/tests/topic/${topicId}/progress`);
  return response.data;
};

export const canStartTopicExam = async (topicId: number): Promise<{ canStart: boolean }> => {
  const response = await apiClient.get<{ canStart: boolean }>(
    APP_URL + `/tests/topic/${topicId}/can-start-exam`,
  );
  return response.data;
};

export const canStartFinalExam = async (courseId: number): Promise<{ canStart: boolean }> => {
  const response = await apiClient.get<{ canStart: boolean }>(
    APP_URL + `/tests/course/${courseId}/can-start-final-exam`,
  );
  return response.data;
};

export const getTestDetail = async (testId: number): Promise<Test> => {
  const response = await apiClient.get<Test>(APP_URL + `/tests/${testId}`);
  return response.data;
};

export const startTest = async (data: { testId: number }): Promise<TestResult> => {
  const response = await apiClient.post(APP_URL + '/tests/start', data);
  return response.data;
};

export const submitAnswer = async (data: {
  attemptId: number;
  questionId: number;
  selectedAnswers: string[];
  timeSpent: number;
}): Promise<void> => {
  await apiClient.post(APP_URL + '/tests/answer', data);
};

export const completeTest = async (data: { attemptId: number }): Promise<TestResult> => {
  const response = await apiClient.post(APP_URL + '/tests/complete', data);
  return response.data;
};

export const getTestResults = async (courseId?: number): Promise<TestResult[]> => {
  const params = courseId ? `?courseId=${courseId}` : '';
  const response = await apiClient.get<TestResult[]>(APP_URL + `/tests/results/my${params}`);
  return response.data;
};

export const getTestResult = async (attemptId: number): Promise<TestResult> => {
  const response = await apiClient.get<TestResult>(APP_URL + `/tests/result/${attemptId}`);
  return response.data;
};

export const getTestResultDetail = async (attemptId: number): Promise<TestResultDetail> => {
  const response = await apiClient.get<TestResultDetail>(
    APP_URL + `/tests/result/${attemptId}/detail`,
  );
  return response.data;
};

export const getAnswerExplanation = async (data: {
  questionText: string;
  choices: string[];
  correctAnswers: string[];
  selectedAnswers: string[];
  isCorrect: boolean;
  topicContext?: string;
}): Promise<{
  explanation: string;
  whyCorrect: string;
  whyWrong?: string;
  learningTip: string;
}> => {
  const response = await apiClient.post(APP_URL + '/tests/explain-answer', data);
  return response.data;
};

export const getAttemptProgress = async (
  attemptId: number,
): Promise<{
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: number;
  isCompleted: boolean;
}> => {
  const response = await apiClient.get(APP_URL + `/tests/attempt/${attemptId}/progress`);
  return response.data;
};
