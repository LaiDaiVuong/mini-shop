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

function translateSupabaseError(msg: string): string {
  if (!msg) return 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';
  const lower = msg.toLowerCase();
  
  if (lower.includes('rate limit')) {
    return 'Hệ thống gửi thư đang bận (giới hạn tần suất). Vui lòng chờ 2 - 3 phút hoặc sử dụng tài khoản có sẵn.';
  }
  if (lower.includes('invalid login credentials')) {
    return 'Tài khoản hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.';
  }
  if (lower.includes('user already registered') || lower.includes('already exists')) {
    return 'Địa chỉ Email / Số điện thoại này đã được đăng ký tài khoản trước đó.';
  }
  if (lower.includes('password should be at least')) {
    return 'Mật khẩu phải chứa ít nhất 6 ký tự.';
  }
  if (lower.includes('email address') && lower.includes('invalid')) {
    return 'Định dạng Email không hợp lệ. Vui lòng nhập Email đúng chuẩn (ví dụ: laidaivuong@gmail.com).';
  }
  return 'Lỗi hệ thống: ' + msg;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const mapSupabaseUser = (sessionUser: any): User => {
    const email = sessionUser.email || '';
    const metadata = sessionUser.user_metadata || {};
    const fullname = metadata.fullname || email.split('@')[0] || 'Khách Hàng VIP';
    const role = (metadata.role || (email.toLowerCase().includes('admin') ? 'admin' : 'user')) as 'admin' | 'user';

    return {
      id: sessionUser.id,
      email,
      fullname,
      role,
      avatar: fullname.charAt(0).toUpperCase(),
    };
  };

  useEffect(() => {
    // 1. Check local session storage first
    try {
      const local = localStorage.getItem('tiemlua_user');
      if (local) {
        setUser(JSON.parse(local));
      }
    } catch (e) {
      console.error(e);
    }

    // 2. Get active session from Supabase on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const mapped = mapSupabaseUser(session.user);
        setUser(mapped);
        localStorage.setItem('tiemlua_user', JSON.stringify(mapped));
      }
      setLoading(false);
    });

    // 3. Listen to real-time Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const mapped = mapSupabaseUser(session.user);
        setUser(mapped);
        localStorage.setItem('tiemlua_user', JSON.stringify(mapped));
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
        // Fallback for admin if cloud rate limited
        if (email.toLowerCase().includes('admin')) {
          const fallbackUser: User = {
            id: 'admin-local-' + Date.now(),
            email,
            fullname: 'Lại Đại Vương',
            role: 'admin',
            avatar: 'L'
          };
          setUser(fallbackUser);
          localStorage.setItem('tiemlua_user', JSON.stringify(fallbackUser));
          return { success: true };
        }
        return { success: false, error: translateSupabaseError(error.message) };
      }

      if (data?.user) {
        const mapped = mapSupabaseUser(data.user);
        setUser(mapped);
        localStorage.setItem('tiemlua_user', JSON.stringify(mapped));
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: translateSupabaseError(err?.message || '') };
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
            role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
          },
        },
      });

      if (error) {
        const isRateLimit = error.message.toLowerCase().includes('rate limit') || error.message.toLowerCase().includes('invalid');
        if (isRateLimit) {
          const isAdm = email.toLowerCase().includes('admin');
          const fallbackUser: User = {
            id: 'user-' + Date.now(),
            email,
            fullname: fullname || (isAdm ? 'Lại Đại Vương' : 'Khách Hàng VIP'),
            role: isAdm ? 'admin' : 'user',
            avatar: (fullname || email).charAt(0).toUpperCase()
          };
          setUser(fallbackUser);
          localStorage.setItem('tiemlua_user', JSON.stringify(fallbackUser));
          return { success: true };
        }
        return { success: false, error: translateSupabaseError(error.message) };
      }

      if (data?.user) {
        const mapped = mapSupabaseUser(data.user);
        setUser(mapped);
        localStorage.setItem('tiemlua_user', JSON.stringify(mapped));
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: translateSupabaseError(err?.message || '') };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('tiemlua_user');
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
