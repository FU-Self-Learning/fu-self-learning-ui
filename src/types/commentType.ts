import { UserInfo } from "@/providers/auth/types/authType";

export interface CommentResponse {
  id: number;
  content: string;
  user: UserInfo;
  replies?: CommentResponse[];
  createdAt: string;
  updatedAt: string;
}
