export interface EnrolledCourse {
  id: number;
  progress: number; 
  isActive: boolean;
  completedAt?: string; 
  certificateUrl?: string;
  enrolledAt: string; 
  updatedAt: string; 
  user: {
    id: number;
    username: string;
    avatarUrl?: string;
  };
  course: {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    instructor: {
      id: string;
      username: string;
      avatarUrl?: string;
    };
    categories: Array<{
      id: string;
      name: string;
    }>;
    duration?: number;
    level?: string;
    rating?: number;
    totalLessons?: number;
    completedLessons?: number;
  };
}

export interface CourseStats {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  timeSpent: number;
  lastAccessedAt: string;
  averageScore?: number;
}

export interface EnrollmentCheck {
  isEnrolled: boolean;
  enrolledAt?: string;
  progress?: number;
  isActive?: boolean;
}

export interface LastWatchedVideo {
  courseId: string;
  lessonId: string;
  videoId: string;
  topicId: string;
  courseTitle: string;
  lessonTitle: string;
}
