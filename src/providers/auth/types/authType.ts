export interface UserInfo {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  error: string | null;
}
