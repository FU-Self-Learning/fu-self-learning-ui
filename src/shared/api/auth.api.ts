import api from "./index";
import { APP_URL } from "../constants/apiConstants";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const login = async (payload: LoginPayload) => {
  const response = await api.post(`${APP_URL}/auth/login`, payload);
  return response.data;
};

export const getGoogleLoginUrl = (redirectUrl: string) => {
  return `${APP_URL}/auth/google?redirectUrl=${encodeURIComponent(
    redirectUrl
  )}`;
};

export const logout = async () => {
  const response = await api.post(`${APP_URL}/auth/logout`);
  return response.data;
};

export const register = async (payload: RegisterPayload) => {
  const response = await api.post(`${APP_URL}/auth/register`, payload);
  return response.data;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await api.post(`${APP_URL}/users/change-password`, data);
  return response.data;
};

export const forgotPassword = async (data: { email: string }) => {
  const response = await api.post(`${APP_URL}/users/forgot-password`, data);
  return response.data;
};

export const resetPassword = async (data: {
  token: string;
  password: string;
}) => {
  const response = await api.post(
    `${APP_URL}/users/update-forgot-password`,
    data
  );
  return response.data;
};

export const getActivateAccount = (token: string) =>
  api.get(`${APP_URL}/auth/activate?token=${token}`);
