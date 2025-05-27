export interface UserInfo {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  avatar_url: string;
  dob: string;
}

export interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
}
