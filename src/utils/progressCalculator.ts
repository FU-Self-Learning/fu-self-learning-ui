import { TopicResponse } from '@/types/topicType';

export interface ProgressCalculationResult {
  currentLessonIndex: number;
  totalLessons: number;
  progressPercentage: number;
  isLastLesson: boolean;
}

export const calculateCourseProgress = (
  currentLessonId: string | number,
  topics: TopicResponse[],
): ProgressCalculationResult | null => {
  if (!topics || topics.length === 0) {
    return null;
  }

  let currentLessonIndex = 0;
  let totalLessons = 0;
  let foundCurrentLesson = false;

  for (const topic of topics) {
    if (topic.lessons) {
      for (const lesson of topic.lessons) {
        totalLessons++;

        if (lesson.id.toString() === currentLessonId.toString()) {
          foundCurrentLesson = true;
        } else if (!foundCurrentLesson) {
          currentLessonIndex++;
        }
      }
    }
  }

  if (!foundCurrentLesson) {
    return null;
  }

  const completedLessons = currentLessonIndex + 1;
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);
  const isLastLesson = completedLessons === totalLessons;

  return {
    currentLessonIndex,
    totalLessons,
    progressPercentage,
    isLastLesson,
  };
};

export const calculateProgressAfterCompletion = (
  completedLessonId: string | number,
  topics: TopicResponse[],
): number => {
  const result = calculateCourseProgress(completedLessonId, topics);

  if (!result) {
    return 0;
  }
  if (result.isLastLesson) {
    return 100;
  }

  return result.progressPercentage;
};

export const getNextLesson = (currentLessonId: string | number, topics: TopicResponse[]) => {
  if (!topics || topics.length === 0) {
    return null;
  }

  let foundCurrent = false;

  for (const topic of topics) {
    if (topic.lessons) {
      for (let i = 0; i < topic.lessons.length; i++) {
        const lesson = topic.lessons[i];

        if (foundCurrent) {
          return lesson;
        }

        if (lesson.id.toString() === currentLessonId.toString()) {
          foundCurrent = true;
          if (i + 1 < topic.lessons.length) {
            return topic.lessons[i + 1];
          }
        }
      }
    }
  }

  return null;
};
