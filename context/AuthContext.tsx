'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, pass: string, fullname: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const mapSupabaseUser = (sessionUser: any): User => {
    const email = sessionUser.email || '';
    const metadata = sessionUser.user_metadata || {};
    const fullname = metadata.fullname || email.split('@')[0] || 'Khách Hàng Thượng Lưu';
    const role = (metadata.role || (email.includes('admin') ? 'admin' : 'user')) as 'admin' | 'user';

    return {
      id: sessionUser.id,
      email,
      fullname,
      role,
      avatar: fullname.charAt(0).toUpperCase(),
    };
  };

  useEffect(() => {
    // 1. Get active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // 2. Listen to real-time Auth State Changes (login, logout, session refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, pass: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        setUser(mapSupabaseUser(data.user));
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Lỗi đăng nhập' };
    }
  };

  const signUp = async (email: string, pass: string, fullname: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            fullname,
            role: email.includes('admin') ? 'admin' : 'user',
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        setUser(mapSupabaseUser(data.user));
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Lỗi đăng ký' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        logout,
        isAdmin: user?.role === 'admin',
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
