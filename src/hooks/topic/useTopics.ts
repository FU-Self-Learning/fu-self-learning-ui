import { useQuery } from '@tanstack/react-query';
import { getTopicsByCourseId } from '@/shared/api/topic.api';
import { TopicResponse } from '@/types/topicType';

export const useTopics = (courseId: string) => {
  return useQuery<TopicResponse[]>({
    queryKey: ['topics', courseId],
    queryFn: () => getTopicsByCourseId(courseId),
    enabled: !!courseId,
  });
};
