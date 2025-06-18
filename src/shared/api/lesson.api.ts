import { APP_URL } from "../constants/apiConstants";
import api from "./index";

export const createManyLessons = async (
  topicId: string,
  formData: FormData
) => {
  const response = await api.post(
    `${APP_URL}/topics/${topicId}/lessons/many`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const getLessonsInstructor = async (topicId: string) => {
  const response = await api.get(`${APP_URL}/topics/${topicId}/lessons`);
  return response.data;
};
