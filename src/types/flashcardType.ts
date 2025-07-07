export interface FlashcardResponse {
  id: number;
  front_text: string;
  back_text: string;
  is_auto_generated: boolean;
  generation_source: string;
  created_at: string;
  updated_at: string;
}

export interface FlashcardFilter {
  courseId?: number;
  topicId?: number;
  lessonId?: number;
}

export interface FlashcardRequest {
  front_text: string;
  back_text: string;
  is_auto_generated?: boolean;
  generation_source?: string;
}

export interface FlashcardGenerateRequest {
  generation_source: string;
  generation_source_id: number;
  prompt?: string;
}
