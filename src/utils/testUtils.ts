import { TestAnswerProgressDto } from '@/types/testType';

// LocalStorage keys
export const TEST_ATTEMPT_KEY = 'currentTestAttemptId';

// Save current attempt ID to localStorage
export const saveCurrentAttemptId = (attemptId: number): void => {
  localStorage.setItem(TEST_ATTEMPT_KEY, attemptId.toString());
};

// Get current attempt ID from localStorage
export const getCurrentAttemptId = (): number | null => {
  const attemptId = localStorage.getItem(TEST_ATTEMPT_KEY);
  return attemptId ? parseInt(attemptId, 10) : null;
};

// Clear current attempt ID from localStorage
export const clearCurrentAttemptId = (): void => {
  localStorage.removeItem(TEST_ATTEMPT_KEY);
};

// Convert progress answers to record format for form state
export const convertProgressToAnswers = (progressAnswers: TestAnswerProgressDto[]) => {
  const answersRecord: Record<
    number,
    { questionId: number; selectedAnswers: string[]; timeSpent: number }
  > = {};

  progressAnswers.forEach((answer) => {
    answersRecord[answer.questionId] = {
      questionId: answer.questionId,
      selectedAnswers: answer.selectedAnswers,
      timeSpent: answer.timeSpent,
    };
  });

  return answersRecord;
};

// Check if browser supports localStorage
export const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};
