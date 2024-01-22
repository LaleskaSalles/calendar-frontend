import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
    id: number;
    login: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: null | User;
  token: null | string;
  signIn: (login: string, password: string) => Promise<void>;
  register: (login: string, password: string) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      signIn: async (login, password) => {
        try {
            const response = await axios.post('http://localhost:8080/user/login', { login, password });
            set({ isAuthenticated: true, user: response.data.user, token: response.data.token });
          } catch (error) {
            console.error('Erro durante o login:', error);
            throw error; 
          }
      },
      register: async (login, password) => {
        try {
            const response = await axios.post('http://localhost:8080/user/register', { login, password });
            
           
        } catch (error) {
            console.error('Erro durante o registro:', error);
            throw error;
        }
    },
      logout: () => {
        set({ isAuthenticated: false, user: null, token: null });
        localStorage.removeItem('token');
      },
    }),
    {
      name: "auth",
    }
  )
);

export default useAuthStore;