import { APP_URL } from '../constants/apiConstants';
import api from '.';

export const getStudySets = async (params: any) => {
  const res = await api.get(`${APP_URL}/study-sets`, { params });
  return res.data;
};

export const getStudySet = async (id: number) => {
  const res = await api.get(`${APP_URL}/study-sets/${id}`);
  return res.data;
};

export const createStudySet = async (data: any) => {
  const res = await api.post(`${APP_URL}/study-sets`, data);
  return res.data;
};

export const createEmptyStudySet = async (data: any) => {
  const res = await api.post(`${APP_URL}/study-sets/empty`, data);
  return res.data;
};

export const updateStudySet = async (id: number, data: any) => {
  const res = await api.put(`${APP_URL}/study-sets/${id}`, data);
  return res.data;
};

export const createManualFlashcards = async (studySetId: number, flashcards: any[]) => {
  const res = await api.post(`${APP_URL}/study-sets/${studySetId}/manual`, {
    flashcards: flashcards.map((card) => ({
      front_text: card.front_text,
      back_text: card.back_text,
      generation_source: 'manual',
    })),
  });
  return res.data;
};

export const replaceFlashcards = async (studySetId: number, flashcards: any[]) => {
  const res = await api.put(`${APP_URL}/study-sets/${studySetId}/flashcards`, {
    flashcards: flashcards.map((card) => ({
      front_text: card.front_text,
      back_text: card.back_text,
      generation_source: 'manual',
    })),
  });
  return res.data;
};

export const deleteStudySet = async (id: number) => {
  const res = await api.delete(`${APP_URL}/study-sets/${id}`);
  return res.data;
};
