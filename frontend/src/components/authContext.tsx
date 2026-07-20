import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { injectTokenPointer } from '../utils/api'; 
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: string;
  email: string;
  profileId: string;
  isAdmin: boolean;
  iat: number;
  exp: number;
}

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (accessToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(accessToken);
        setIsAdmin(!!decoded.isAdmin);
      } catch (error) {
        console.error("Failed to parse token authorization parameters:", error);
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, [accessToken]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedRefreshToken = localStorage.getItem('refreshToken');

        if (!storedRefreshToken) {
          setLoading(false);
          return;
        }

        const response = await axios.post(
          `${import.meta.env.VITE_URL_API}/auth/refresh`, 
          {
            refreshToken: storedRefreshToken
          }
        );
        
        const token = response.data.accessToken;
        setAccessToken(token);
        injectTokenPointer(token);
      } catch (error) {
        console.error("Session expired or user not logged in");
        localStorage.removeItem('refreshToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, isAdmin, loading }}>
      {children}
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