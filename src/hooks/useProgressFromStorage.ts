import { useEffect, useState } from 'react';
import { useLastWatchedVideo } from '@/hooks/video-progress/useLastWatchedVideo';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/providers/auth/selector/authSelector';
import { TopicResponse } from '@/types/topicType';
import { calculateCourseProgress } from '@/utils/progressCalculator';

interface UseProgressFromStorageProps {
  courseId: string;
  topics?: TopicResponse[];
  fallbackProgress?: number;
}

export const useProgressFromStorage = ({
  courseId,
  topics,
  fallbackProgress = 0,
}: UseProgressFromStorageProps) => {
  const [calculatedProgress, setCalculatedProgress] = useState<number>(fallbackProgress);
  const user = useSelector(selectAuthUser);
  const { getLastWatchedVideoForCourse } = useLastWatchedVideo(user?.id?.toString());

  useEffect(() => {
    if (!topics || !user?.id) {
      setCalculatedProgress(fallbackProgress);
      return;
    }

    const lastWatchedVideo = getLastWatchedVideoForCourse(courseId);

    let currentProgress = fallbackProgress;
    let progressData = null;

    if (lastWatchedVideo && lastWatchedVideo.lessonId) {
      progressData = calculateCourseProgress(lastWatchedVideo.lessonId, topics);

      if (progressData) {
        currentProgress = Math.max(progressData.progressPercentage, fallbackProgress);
      }
    }

    if (currentProgress >= 100) {
      console.log(`🎉 Course ${courseId} already completed (${currentProgress}%), locking at 100%`);
      setCalculatedProgress(100);
      return;
    }

    console.log(
      `📊 Course ${courseId} progress calculated: ${currentProgress}% (from localStorage: ${progressData?.progressPercentage || 'none'}, fallback: ${fallbackProgress}%)`,
    );
    setCalculatedProgress(currentProgress);
  }, [courseId, topics, fallbackProgress, user?.id, getLastWatchedVideoForCourse]);

  return calculatedProgress;
};
