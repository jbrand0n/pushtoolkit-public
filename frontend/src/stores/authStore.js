import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        // Store token separately for axios interceptor
        localStorage.setItem('token', token);
        set({
          user,
          token,
          isAuthenticated: true
        });
      },

      // Restore token to localStorage on hydration
      hydrate: () => {
        const state = get();
        if (state.token) {
          localStorage.setItem('token', state.token);
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
      },

      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        // Restore token to localStorage after hydration
        if (state?.token) {
          localStorage.setItem('token', state.token);
        }
      },
    }
  )
);

export default useAuthStore;
