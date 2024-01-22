// import create from 'zustand';

// interface AuthStore {
//   token: string | null;
//   userId: number | null;
//   nameUser: string | null;
//   setAuthData: (token: string, userId: number) => void;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthStore>((set) => ({
//   token: null,
//   userId: null,
//   nameUser: null,
//   setAuthData: (token, userId) => set({ token, userId }),
//   logout: () => set({ token: null, userId: null, nameUser: null }),
// }));