export interface StudySet {
  id: number;
  name: string;
  isPublic: boolean;
  tags: string[];
  description: string;
  createdAt: string;
  updateAt: string;
  user: UserInfoStudySet;
}

interface UserInfoStudySet {
  id: string;
  username: string;
}
