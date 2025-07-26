export type TestType = 'practice' | 'quiz' | 'midterm' | 'final';

export type AttemptStatus = 'in_progress' | 'completed' | 'timeout' | 'cancelled';

export interface QuizQuestion {
  id: number;
  question_text: string;
  correct_answer?: string[];
  choices: string[];
  topicId?: number;
  topic?: {
    id: number;
    title: string;
  };
}

export interface Test {
  id: number;
  title: string;
  description: string;
  courseId: number;
  courseTitle?: string;
  type: TestType;
  duration: number;
  questionCount: number;
  passingScore: string;
  isActive?: boolean;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  questions: QuizQuestion[];
  topics?: {
    id: number;
    title: string;
  }[];
  createdAt: string;
  updatedAt?: string;
  currentAttempt?: TestAttempt;
}

export interface TestAttempt {
  id: number;
  userId?: number;
  testId: number;
  testTitle?: string;
  test?: Test;
  status: AttemptStatus;
  startedAt: string;
  completedAt?: string;
  score?: number;
  correctAnswers?: number;
  totalQuestions: number;
  timeSpent?: number;
  isPassed?: boolean;
}

export interface TestAnswer {
  id: number;
  attemptId: number;
  questionId: number;
  question: QuizQuestion;
  selectedAnswers: string[];
  isCorrect?: boolean;
  timeSpent?: number;
}

export interface StartTestRequest {
  testId: number;
}

export interface StartTestResponse {
  attempt: TestAttempt;
  questions: QuizQuestion[];
}

export interface SubmitAnswerRequest {
  attemptId: number;
  questionId: number;
  selectedAnswers: string[];
  timeSpent: number;
}

export interface CompleteTestRequest {
  attemptId: number;
}

export interface TestResult {
  id: number;
  status: 'in_progress' | 'completed' | 'not_started';
  startedAt: string;
  completedAt: string | null;
  score: number | null;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number | null;
  isPassed: boolean;
  testId: number;
  testTitle: string;
}

export interface TestAnswerDetail {
  id: number;
  questionId: number;
  questionText: string;
  choices: string[];
  correctAnswer: string[];
  selectedAnswers: string[];
  isCorrect: boolean;
  timeSpent: number;
  answeredAt: string;
}

export interface TestResultDetail extends TestResult {
  answers: TestAnswerDetail[];
}

export interface TestListFilter {
  courseId?: number;
  type?: TestType;
  status?: 'active' | 'inactive';
}

export interface MyTestResultsFilter {
  courseId?: number;
  status?: AttemptStatus;
  isPassed?: boolean;
}

export interface TestAnswerProgressDto {
  questionId: number;
  questionText: string;
  choices: string[];
  selectedAnswers: string[];
  timeSpent: number;
  answeredAt: string;
}

export interface TestAttemptProgressDto {
  attemptId: number;
  testId: number;
  testTitle: string;
  status: AttemptStatus;
  startedAt: string;
  duration: number;
  totalQuestions: number;
  answeredCount: number;
  answers: TestAnswerProgressDto[];
  timeRemaining: number;
  isExpired: boolean;
}
