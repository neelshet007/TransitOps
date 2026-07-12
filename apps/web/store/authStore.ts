import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginApi, logoutApi, meApi, LoginPayload, AuthUser } from '../services/auth.api';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  clearError: () => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setToken: (token: string) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', token);
        }
        set({ accessToken: token });
      },

      login: async (payload: LoginPayload) => {
        set({ isLoading: true, error: null });
        try {
          const result = await loginApi(payload);
          // Persist access token
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', result.accessToken);
          }
          set({
            user: result.user,
            accessToken: result.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (err: any) {
          const message =
            err?.response?.data?.message || 'Login failed. Please check your credentials.';
          set({ isLoading: false, error: message, isAuthenticated: false });
          throw err;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await logoutApi();
        } catch {
          // Proceed with client-side logout even if API call fails
        } finally {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
          }
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      fetchMe: async () => {
        const token = get().accessToken || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }
        set({ isLoading: true });
        try {
          const user = await meApi();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
          }
          set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'transitops-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
