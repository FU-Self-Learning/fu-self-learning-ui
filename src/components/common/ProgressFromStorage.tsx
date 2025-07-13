import React from 'react';
import { useProgressFromStorage } from '@/hooks/useProgressFromStorage';
import { TopicResponse } from '@/types/topicType';

interface ProgressFromStorageProps {
  courseId: string;
  topics?: TopicResponse[];
  fallbackProgress?: number; 
}

export const ProgressFromStorage: React.FC<ProgressFromStorageProps> = ({
  courseId,
  topics,
  fallbackProgress = 0
}) => {
  const calculatedProgress = useProgressFromStorage({
    courseId,
    topics,
    fallbackProgress
  });

  return calculatedProgress;
};

export default ProgressFromStorage;
