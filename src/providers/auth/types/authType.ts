export interface UserInfo {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
  dob: string;
  role: 'user' | 'instructor' | 'admin';
}

export interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
}
