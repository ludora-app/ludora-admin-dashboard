import Cookies from "js-cookie";
import { create } from "zustand";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (accessToken: string, refreshToken: string, user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const ACCESS_TOKEN_KEY = "ludora_access_token";
const REFRESH_TOKEN_KEY = "ludora_refresh_token";
const USER_KEY = "ludora_user";

export const useAuthStore = create<AuthState>((set) => {
  // Initialize state from cookies if available
  const accessToken = Cookies.get(ACCESS_TOKEN_KEY) || null;
  const refreshToken = Cookies.get(REFRESH_TOKEN_KEY) || null;
  const userJson = Cookies.get(USER_KEY);
  const user = userJson ? JSON.parse(userJson) : null;

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated: !!accessToken,
    setAuth: (accessToken, refreshToken, user) => {
      Cookies.set(ACCESS_TOKEN_KEY, accessToken, { secure: true, sameSite: "strict" });
      Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { secure: true, sameSite: "strict" });
      Cookies.set(USER_KEY, JSON.stringify(user), { secure: true, sameSite: "strict" });
      set({ accessToken, refreshToken, user, isAuthenticated: true });
    },
    setTokens: (accessToken, refreshToken) => {
      Cookies.set(ACCESS_TOKEN_KEY, accessToken, { secure: true, sameSite: "strict" });
      Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { secure: true, sameSite: "strict" });
      set({ accessToken, refreshToken, isAuthenticated: true });
    },
    logout: () => {
      Cookies.remove(ACCESS_TOKEN_KEY);
      Cookies.remove(REFRESH_TOKEN_KEY);
      Cookies.remove(USER_KEY);
      set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
    },
  };
});
