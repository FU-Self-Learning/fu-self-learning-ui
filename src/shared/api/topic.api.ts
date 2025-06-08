import { APP_URL } from "../constants/apiConstants";
import api from "./index";
import { TopicResponse } from "@/types/topicType";

export const getTopicsByCourseId = async (courseId: string): Promise<TopicResponse[]> => {
  const response = await api.get(`${APP_URL}/courses/${courseId}/topics`);
  return response.data;
};