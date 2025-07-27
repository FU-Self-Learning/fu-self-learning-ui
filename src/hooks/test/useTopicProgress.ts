import { useQuery } from '@tanstack/react-query';
import { getTopicProgress } from '@/shared/api/test.api';

export const useTopicProgress = (topicId: number) => {
  return useQuery({
    queryKey: ['topic-progress', topicId],
    queryFn: () => getTopicProgress(topicId),
    enabled: !!topicId,
  });
};
