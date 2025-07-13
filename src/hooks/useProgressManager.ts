import { useCallback } from 'react';
import { useUpdateProgress } from '@/hooks/enrollment/useEnrollment';
import { TopicResponse } from '@/types/topicType';
import { 
  calculateCourseProgress, 
  calculateProgressAfterCompletion,
  getNextLesson 
} from '@/utils/progressCalculator';
import { message } from 'antd';

export const useProgressManager = () => {
  const { mutate: updateProgress, isPending } = useUpdateProgress();

  const updateProgressOnLessonStart = useCallback((
    courseId: string,
    lessonId: string | number,
    topics: TopicResponse[],
    currentProgress?: number 
  ) => {
    if (currentProgress && currentProgress >= 100) {
      console.log(`🚫 useProgressManager: Course ${courseId} already completed (${currentProgress}%), skipping lesson start update`);
      return { progressPercentage: 100, isLastLesson: true, currentLessonIndex: 0, totalLessons: 0 };
    }

    const progressData = calculateCourseProgress(lessonId, topics);
    
    if (!progressData) {
      console.error('Could not calculate progress for lesson:', lessonId);
      return;
    }

    console.log(`🔢 Calculated progress for lesson ${lessonId}: ${progressData.progressPercentage}%, current DB progress: ${currentProgress}%`);

    if (progressData.progressPercentage >= 100) {
      updateProgress({
        courseId,
        progress: 100
      }, {
        onSuccess: () => {
          console.log('Course completed - progress set to 100%');
        },
        onError: (error) => {
          console.error('Failed to update final progress:', error);
        }
      });
      return progressData;
    }

    if (currentProgress && progressData.progressPercentage <= currentProgress) {
      console.log(`🚫 Progress not increased (${progressData.progressPercentage}% <= ${currentProgress}%), skipping update`);
      return progressData;
    }

    console.log(`⬆️ Updating progress from ${currentProgress}% to ${progressData.progressPercentage}% for lesson ${lessonId}`);

    updateProgress({
      courseId,
      progress: progressData.progressPercentage
    }, {
      onSuccess: () => {
        console.log(`Progress updated to ${progressData.progressPercentage}% for lesson ${lessonId}`);
      },
      onError: (error) => {
        console.error('Failed to update progress:', error);
        message.error('Failed to update learning progress');
      }
    });

    return progressData;
  }, [updateProgress]);

  const updateProgressOnLessonComplete = useCallback((
    courseId: string,
    completedLessonId: string | number,
    topics: TopicResponse[],
    currentProgress?: number 
  ) => {
    if (currentProgress && currentProgress >= 100) {
      console.log('Course already completed (100%), skipping completion update');
      return {
        finalProgress: 100,
        nextLesson: null,
        isCompleted: true
      };
    }

    const finalProgress = calculateProgressAfterCompletion(completedLessonId, topics);
    const nextLesson = getNextLesson(completedLessonId, topics);
    
    if (currentProgress && finalProgress <= currentProgress) {
      console.log('Progress not increased on completion, skipping update');
      return {
        finalProgress: currentProgress,
        nextLesson,
        isCompleted: currentProgress >= 100
      };
    }
    
    updateProgress({
      courseId,
      progress: finalProgress
    }, {
      onSuccess: () => {
        if (finalProgress === 100) {
          message.success('🎉 Congratulations! You have completed the course!');
        } else if (nextLesson) {
          message.success(`Lesson completed! Progress: ${finalProgress}%`);
        }
        
        console.log(`Lesson ${completedLessonId} completed. Progress: ${finalProgress}%`);
      },
      onError: (error) => {
        console.error('Failed to update progress on completion:', error);
        message.error('Failed to update completion progress');
      }
    });

    return {
      finalProgress,
      nextLesson,
      isCompleted: finalProgress === 100
    };
  }, [updateProgress]);

  const updateProgressManually = useCallback((
    courseId: string,
    progress: number
  ) => {
    const clampedProgress = Math.min(Math.max(progress, 0), 100);
    
    updateProgress({
      courseId,
      progress: clampedProgress
    }, {
      onSuccess: () => {
        console.log(`Progress manually updated to ${clampedProgress}%`);
      },
      onError: (error) => {
        console.error('Failed to update progress manually:', error);
        message.error('Failed to update progress');
      }
    });
  }, [updateProgress]);

  return {
    updateProgressOnLessonStart,
    updateProgressOnLessonComplete,
    updateProgressManually,
    isUpdating: isPending
  };
};
