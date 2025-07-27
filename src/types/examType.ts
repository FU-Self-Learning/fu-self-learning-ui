export interface ExamResponse {
  id: number;
  title: string;
  description: string;
  duration: number; // in minutes
  totalQuestions: number;
  passingScore: number; // percentage
  isActive: boolean;
  courseId: number;
  topicIds: number[];
  type: 'practice' | 'midterm' | 'final' | 'quiz' | 'topic_exam' | 'final_exam';
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  createdAt: string;
  updatedAt: string;
  questions?: ExamQuestionResponse[];
}

export interface ExamQuestionResponse {
  id: number;
  question_text: string;
  correct_answer: string[];
  choices: string[];
  topicId: number;
  order?: number;
}

export interface ExamRequest {
  title: string;
  description: string;
  duration: number;
  passingScore: number;
  courseId: number;
  topicIds: number[];
  type: 'practice' | 'midterm' | 'final' | 'quiz' | 'topic_exam' | 'final_exam';
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  questions: ExamQuestionRequest[];
}

export interface ExamQuestionRequest {
  question_text: string;
  correct_answer: string[];
  choices: string[];
  topicId: number;
}

export interface ExamFilter {
  courseId?: number;
  isActive?: boolean;
  search?: string;
  type?: 'practice' | 'midterm' | 'final' | 'quiz' | 'topic_exam' | 'final_exam';
}

// For exam creation form
export interface ExamFormData {
  title: string;
  description: string;
  duration: number;
  passingScore: number;
  courseId: number;
  topicIds: number[];
  type: 'practice' | 'midterm' | 'final' | 'quiz' | 'topic_exam' | 'final_exam';
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  questions: ExamQuestionFormData[];
}

export interface ExamQuestionFormData {
  question_text: string;
  correct_answer: string[];
  choices: string[];
  topicId: number;
}
