import {
  Test,
  TestAttempt,
  TestResult,
  TestResultDetail,
  StartTestRequest,
  SubmitAnswerRequest,
  CompleteTestRequest,
  TestListFilter,
  MyTestResultsFilter,
  TestAttemptProgressDto,
} from '@/types/testType';
import apiClient from './index';
import { APP_URL } from '../constants/apiConstants';

// Get tests by course ID
export const getTestsByCourse = async (
  courseId: string,
  filters?: TestListFilter,
): Promise<Test[]> => {
  const params = new URLSearchParams();
  if (filters?.type) params.append('type', filters.type);
  if (filters?.status) params.append('status', filters.status);

  const queryString = params.toString();
  const url = `${APP_URL}/tests/course/${courseId}${queryString ? `?${queryString}` : ''}`;

  const response = await apiClient.get<Test[]>(url);
  return response.data;
};

// Get test detail
export const getTestById = async (testId: number): Promise<Test> => {
  const response = await apiClient.get<Test>(APP_URL + `/tests/${testId}`);
  return response.data;
};

// Start a test attempt
export const startTest = async (data: StartTestRequest): Promise<any> => {
  const response = await apiClient.post<any>(APP_URL + '/tests/start', data);
  return response.data;
};

// Submit an answer for a question
export const submitAnswer = async (data: SubmitAnswerRequest): Promise<void> => {
  await apiClient.post(APP_URL + '/tests/answer', data);
};

// Complete a test attempt
export const completeTest = async (data: CompleteTestRequest): Promise<TestResult> => {
  const response = await apiClient.post<TestResult>(APP_URL + '/tests/complete', data);
  return response.data;
};

// Get my test results
export const getMyTestResults = async (filters?: MyTestResultsFilter): Promise<TestResult[]> => {
  const params = new URLSearchParams();
  if (filters?.courseId) params.append('courseId', filters.courseId.toString());
  if (filters?.status) params.append('status', filters.status);
  if (filters?.isPassed !== undefined) params.append('isPassed', filters.isPassed.toString());

  const queryString = params.toString();
  const url = `${APP_URL}/tests/results/me${queryString ? `?${queryString}` : ''}`;

  const response = await apiClient.get<TestResult[]>(url);
  return response.data;
};

// Get my test attempts
export const getMyTestAttempts = async (courseId?: string): Promise<TestAttempt[]> => {
  const url = courseId
    ? `${APP_URL}/tests/attempts/me?courseId=${courseId}`
    : `${APP_URL}/tests/attempts/me`;
  const response = await apiClient.get<TestAttempt[]>(url);
  return response.data;
};

// Get specific test result
export const getTestResult = async (attemptId: number): Promise<TestResult> => {
  const response = await apiClient.get<TestResult>(APP_URL + `/tests/result/${attemptId}`);
  return response.data;
};

// Get test result detail with answers
export const getTestResultDetail = async (attemptId: number): Promise<TestResultDetail> => {
  const response = await apiClient.get<TestResultDetail>(
    APP_URL + `/tests/result/${attemptId}/detail`,
  );
  return response.data;
};

// Cancel ongoing test attempt
export const cancelTestAttempt = async (attemptId: number): Promise<void> => {
  await apiClient.post(APP_URL + `/tests/cancel/${attemptId}`);
};

// Get test attempt progress (for reload recovery)
export const getAttemptProgress = async (attemptId: number): Promise<TestAttemptProgressDto> => {
  const response = await apiClient.get<TestAttemptProgressDto>(
    APP_URL + `/tests/attempt/${attemptId}/progress`,
  );
  return response.data;
};
