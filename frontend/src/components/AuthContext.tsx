import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { injectTokenPointer } from '../utils/api'; 


interface AuthContextType {
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_URL_API}/auth/refresh`, 
          {}, 
          { withCredentials: true }
        );
        
        const token = response.data.accessToken;
        setAccessToken(token);

        injectTokenPointer(token);
      } catch (error) {
        console.error("Session expired or user not logged in");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be executed within an AuthProvider wrapper tree.');
  }
  return context;
};