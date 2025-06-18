import { APP_URL } from "../constants/apiConstants";
import api from "./index";
import { TopicInstructorCreateRequest, TopicResponse } from "@/types/topicType";

export const getTopicsByCourseId = async (
  courseId: string
): Promise<TopicResponse[]> => {
  const response = await api.get(`${APP_URL}/courses/${courseId}/topics`);
  return response.data;
};

export const createTopicInstructor = async (
  courseId: string,
  request: TopicInstructorCreateRequest
): Promise<TopicResponse> => {
  const response = await api.post(`${APP_URL}/courses/${courseId}/topics`, request);
  return response.data;
};
