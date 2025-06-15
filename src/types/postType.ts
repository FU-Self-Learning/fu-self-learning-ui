export interface Post {
  id: number;
  title: string;
  body: string;
  images?: string[];
  user: {
    id: number;
    username: string;
    email: string;
    phoneNumber: string | null;
    dob: string | null;
    isActive: boolean;
    avatarUrl: string | null;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

export type PostProps = {
  imageUrl: string;
  title: string;
  edition: string;
  isbn: string;
  publisher: string;
  solutionCount: number;
};
