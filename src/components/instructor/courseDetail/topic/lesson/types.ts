export interface Lesson {
  id?: string;
  title: string;
  description: string;
  videoFile?: File;
  videoUrl?: string;
}

export interface CreateLessonData {
  title: string;
  description: string;
} 