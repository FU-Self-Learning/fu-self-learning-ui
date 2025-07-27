import { UploadFile } from 'antd';

export type CourseStatus = 'active' | 'inactive' | 'rejected';

export interface CoursesResponse {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  instructor: InstructorCourse;
  categories: CategoryCourse[];
  status: CourseStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface InstructorCourse {
  id?: string;
  username: string;
  email?: string;
  avatarUrl?: string;
}

export interface CategoryCourse {
  id: string;
  name: string;
}

export interface CourseDetailResponse {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  videoIntroUrl: string;
  createdAt: string;
  totalLessons: number;
  totalDuration: number;
  instructor: InstructorCourse;
  price: number;
  topics: TopicCourse[];
  categories: CategoryCourse[];
}

interface TopicCourse {
  id: string;
  title: string;
  description: string;
  // duration: string;
  // videoUrl: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  image: UploadFile[];
  video: UploadFile[];
  document: UploadFile[];
  categoryIds: number[];
}

// ================================ Instructor ================================

export interface CourseInstructorDetailResponse {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoIntroUrl: string;
  documentUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
