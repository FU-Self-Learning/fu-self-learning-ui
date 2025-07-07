import {
  FlashcardGenerateRequest,
  FlashcardRequest,
  FlashcardResponse,
} from '@/types/flashcardType';
import { APP_URL } from '../constants/apiConstants';
import api from './index';

export const getFlashcardsWithFilter = async (url: string): Promise<FlashcardResponse[]> => {
  const response = await api.get(`${APP_URL}/${url}`);
  return response.data;
};

export const getFlashcardById = async (id: number): Promise<FlashcardResponse> => {
  const response = await api.get(`${APP_URL}/flashcards/${id}`);
  return response.data;
};

export const deleteFlashcard = async (id: number): Promise<void> => {
  const response = await api.delete(`${APP_URL}/flashcards/${id}`);
  return response.data;
};

export const createFlashcard = async (data: FlashcardRequest): Promise<FlashcardResponse> => {
  const response = await api.post(`${APP_URL}/flashcards`, data);
  return response.data;
};

export const generateFlashcards = async (
  data: FlashcardGenerateRequest,
): Promise<FlashcardResponse[]> => {
  const response = await api.post(`${APP_URL}/flashcards/generate`, data);
  return response.data;
};

export const updateFlashcard = async (
  id: number,
  data: FlashcardRequest,
): Promise<FlashcardResponse> => {
  const response = await api.put(`${APP_URL}/flashcards/${id}`, data);
  return response.data;
};
