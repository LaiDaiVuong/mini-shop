'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  login: (username: string, role?: 'admin' | 'user') => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const local = localStorage.getItem('tiemlua_user');
      if (local) {
        setUser(JSON.parse(local));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const login = (username: string, role: 'admin' | 'user' = 'user') => {
    const newUser: User = {
      username,
      fullname: role === 'admin' ? 'Lại Đại Vương' : 'Khách Hàng Thượng Lưu',
      role,
      avatar: username.charAt(0).toUpperCase()
    };
    setUser(newUser);
    localStorage.setItem('tiemlua_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tiemlua_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
