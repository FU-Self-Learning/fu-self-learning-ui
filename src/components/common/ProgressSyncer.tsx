import { useEffect, useRef } from 'react';
import { useProgressManager } from '@/hooks/useProgressManager';
import { useLastWatchedVideo } from '@/hooks/video-progress/useLastWatchedVideo';
import { useTopics } from '@/hooks/topic/useTopics';
import { useSelector } from 'react-redux';
import { selectAuthUser, selectIsAuthenticated } from '@/providers/auth/selector/authSelector';
import { calculateCourseProgress } from '@/utils/progressCalculator';
import { useCheckEnrollment } from '@/hooks/enrollment';

interface ProgressSyncerProps {
  courseId: string;
}

export const ProgressSyncer: React.FC<ProgressSyncerProps> = ({ courseId }) => {
  const user = useSelector(selectAuthUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { lastWatchedVideo } = useLastWatchedVideo(user?.id?.toString());
  const { data: topics } = useTopics(courseId);
  const { updateProgressManually } = useProgressManager();
  const { data: enrollmentCheck } = useCheckEnrollment(courseId);
  
  const lastSyncedLessonRef = useRef<string | null>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.id || !lastWatchedVideo || !topics || !enrollmentCheck) {
      return;
    }

    const currentProgress = enrollmentCheck.progress || 0;
    if (currentProgress >= 100) {
      console.log('Course already completed (100%), skipping progress sync');
      return;
    }

    if (lastWatchedVideo.courseId !== courseId) {
      return;
    }

    if (lastSyncedLessonRef.current === lastWatchedVideo.lessonId) {
      return;
    }

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(() => {
      const progressData = calculateCourseProgress(lastWatchedVideo.lessonId, topics);
      
      if (progressData) {
        if (progressData.progressPercentage > currentProgress) {
          updateProgressManually(courseId, progressData.progressPercentage);
          lastSyncedLessonRef.current = lastWatchedVideo.lessonId;
          
          console.log(`Auto-synced progress for course ${courseId}: ${progressData.progressPercentage}%`);
        } else {
          console.log('Progress not increased, skipping sync');
        }
      }
    }, 2000); 

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [lastWatchedVideo, topics, courseId, isAuthenticated, user?.id, updateProgressManually, enrollmentCheck]);

  return null;
};

export default ProgressSyncer;
