'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';


import { AuthContextType, User } from '@/types/global';
import {  generateToken, parseToken } from '@/utils/token';


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const accessToken = getCookie('accessToken');
      const refreshToken = getCookie('refreshToken');

      if (!accessToken && !refreshToken) {
        logout();
        return;
      }

      if (!accessToken && refreshToken) {
        // Try to refresh the access token
        await refreshAccessToken();
      } else if (accessToken) {
        const userData = parseToken(accessToken as string);
        if (userData) {
          setUser(userData);
        } else {
          logout();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    const refreshToken = getCookie('refreshToken');
    if (!refreshToken) return false;

    try {
      const userData = parseToken(refreshToken as string);
      if (!userData) return false;
      
      const newAccessToken = generateToken(userData, false);
      setCookie('accessToken', newAccessToken, { maxAge: 300 }); // 5 minutes
      setUser(userData);
      return true;
    } catch (error) {
      logout();
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some((u: User) => u.email === email)) {
        return false;
      }

      const newUser: User = {
        id: users.length + 1,
        name,
        email,
        password,
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: User) => u.email === email && u.password === password);

      if (user) {
        const accessToken = generateToken(user  , false);
        const refreshToken = generateToken(user ,  true);

        setCookie('accessToken', accessToken, { maxAge: 300, secure: true,sameSite: 'strict' }); // 5 minutes
        setCookie('refreshToken', refreshToken, { maxAge: 24 * 60 * 60, secure: true,sameSite: 'strict' }); // 1 day
        setUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    deleteCookie('accessToken');
    deleteCookie('refreshToken');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 