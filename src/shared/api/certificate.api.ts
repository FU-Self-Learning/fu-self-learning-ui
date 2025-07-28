import { APP_URL } from '../constants/apiConstants';
import api from './index';
import { CourseCertificate } from '@/types/testType';

export const getUserCertificates = async (): Promise<CourseCertificate[]> => {
  const response = await api.get(`${APP_URL}/certificates/user`);
  return response.data;
};

export const getCertificateById = async (certificateId: number): Promise<CourseCertificate> => {
  const response = await api.get(`${APP_URL}/certificates/${certificateId}`);
  return response.data;
};

export const getCourseCertificate = async (courseId: number): Promise<CourseCertificate> => {
  const response = await api.get(`${APP_URL}/certificates/course/${courseId}`);
  return response.data;
};

export const generateCertificate = async (courseId: number): Promise<CourseCertificate> => {
  const response = await api.post(`${APP_URL}/certificates/course/${courseId}/generate`);
  return response.data;
};

export const hasCertificate = async (courseId: number): Promise<{ hasCertificate: boolean }> => {
  const response = await api.get(`${APP_URL}/certificates/course/${courseId}/has-certificate`);
  return response.data;
};
