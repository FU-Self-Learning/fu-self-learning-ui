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
  type: 'practice' | 'topic_exam' | 'final_exam';
  duration: number;
  questionCount: number;
  passingScore: number;
  isActive: boolean;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  requireVideoCompletion: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  // Add properties from TestDetailDto
  questions?: QuizQuestion[];
  currentAttempt?: any; // Use any to allow different implementations
}

export interface TopicExam extends Test {
  topicId: number;
  topicTitle: string;
  isVideoCompleted: boolean;
  isAvailable: boolean;
  // Add attempt information for progress tracking
  lastAttempt?: {
    id: number;
    status: string;
    completedAt: string;
    score: number;
    isPassed: boolean;
  };
  canRetry: boolean;
  attemptCount: number;
  // Override the currentAttempt from Test interface to be compatible
  currentAttempt?: {
    id: number;
    status: string;
    startedAt: string;
    score?: number;
    isPassed?: boolean;
  };
}

export interface FinalExam extends Test {
  isAllTopicExamsCompleted: boolean;
  completedTopicExams: number;
  totalTopicExams: number;
  isAvailable: boolean;
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
  testId: number;
  testTitle: string;
  userId: number;
  status: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  startedAt: string;
  completedAt: string;
  isPassed: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface CourseProgress {
  courseId: number;
  courseTitle: string;
  totalTopics: number;
  completedTopics: number;
  totalLessons: number;
  completedLessons: number;
  totalTopicExams: number;
  completedTopicExams: number;
  finalExamCompleted: boolean;
  finalExamScore?: number;
  certificateEarned: boolean;
  certificateUrl?: string;
  progressPercentage: number;
}

export interface TopicProgress {
  topicId: number;
  topicTitle: string;
  totalLessons: number;
  completedLessons: number;
  topicExamCompleted: boolean;
  topicExamScore?: number;
  progressPercentage: number;
  isAvailable: boolean;
}

export interface VideoProgress {
  id: number;
  userId: number;
  lessonId: number;
  watchedDuration: number;
  totalDuration: number;
  progressPercentage: number;
  isCompleted: boolean;
  completedAt?: string;
  lastWatchedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseCertificate {
  id: number;
  userId: number;
  courseId: number;
  certificateNumber: string;
  finalScore: number;
  issuedAt: string;
  certificateUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
