import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTopicInstructor } from "@/shared/api/topic.api";
import { TopicInstructorCreateRequest } from "@/types/topicType";
import { message } from "antd";
import { extractErrorMessage } from "@/utils/ErrorHandle";

export const useCreateTopic = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: TopicInstructorCreateRequest) =>
      createTopicInstructor(courseId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      message.success("Topic created successfully");
    },
    onError: (error) => {
      message.error(extractErrorMessage(error));
    },
  });
};
