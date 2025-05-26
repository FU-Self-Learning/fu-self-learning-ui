export interface UserInfo {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  age: number;
  avatar_url: string;
}

export interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
}
