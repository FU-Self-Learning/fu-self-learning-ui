import { APP_URL } from '../constants/apiConstants';
import api from './index';

export const createOrder = async (courseId: number, amount: number, token: string) => {
  const response = await api.post(
    `${APP_URL}/orders/create/${courseId}`,
    { amount },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
