export interface LessonInTopic {
  id: number;
  title: string;
  videoDuration: number;
  videoUrl: string;
}

export interface TopicResponse {
  id: number;
  title: string;
  description: string;
  totalDuration: number;
  lessons: LessonInTopic[];
}

// ================================ Instructor ================================

export interface TopicInstructorCreateRequest {
  title: string;
  description: string;
}
