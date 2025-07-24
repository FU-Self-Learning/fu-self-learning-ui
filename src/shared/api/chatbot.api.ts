import api from '.';
import { APP_URL } from '../constants/apiConstants';

export interface ChatbotCourse {
  id: number;
  title: string;
  description: string;
  categories?: string[];
}

export interface ChatbotResponse {
  response: string;
  courses?: ChatbotCourse[];
  timestamp: string;
}

export interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
  courses?: ChatbotCourse[];
  timestamp?: string;
}

export interface HistoryChatResponse {
  role: 'assistant' | 'human';
  content: string;
  timestamp?: string;
}

export const sendChatbotMessage = async (
  message: string,
  sessionId?: string,
): Promise<ChatbotResponse> => {
  const body: any = { message };
  if (sessionId) body.sessionId = sessionId;
  const response = await api.post(`${APP_URL}/chatbot`, body);
  return response.data;
};

export const getChatbotHistory = async (sessionId?: string): Promise<HistoryChatResponse[]> => {
  const params: any = {};
  if (sessionId) params.sessionId = sessionId;
  const response = await api.get(`${APP_URL}/chatbot/history`, { params });
  return response.data;
};
