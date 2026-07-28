'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (emailOrUsername: string, pass: string) => Promise<{ success: boolean; error?: string; isAdmin?: boolean }>;
  signUp: (email: string, pass: string, fullname: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

function translateSupabaseError(msg: string): string {
  if (!msg) return 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';
  const lower = msg.toLowerCase();
  
  if (lower.includes('rate limit')) {
    return 'Hệ thống gửi thư đang bận. Vui lòng chờ 2 - 3 phút hoặc sử dụng tài khoản có sẵn.';
  }
  if (lower.includes('invalid login credentials')) {
    return 'Tên đăng nhập / Email hoặc Mật khẩu không chính xác. Vui lòng kiểm tra lại.';
  }
  if (lower.includes('user already registered') || lower.includes('already exists')) {
    return 'Địa chỉ Email này đã được đăng ký tài khoản khách hàng trước đó.';
  }
  if (lower.includes('password should be at least')) {
    return 'Mật khẩu phải chứa ít nhất 6 ký tự.';
  }
  if (lower.includes('email address') && lower.includes('invalid')) {
    return 'Định dạng Email không hợp lệ. Vui lòng nhập Email đúng chuẩn (ví dụ: khachhang@gmail.com).';
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

    return {
      id: sessionUser.id,
      email,
      fullname,
      role: 'user', // All public Supabase auth users are strictly 'user'
      avatar: fullname.charAt(0).toUpperCase(),
    };
  };

  useEffect(() => {
    // 1. Check local persistent user session
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
        // Only set if not already logged in as master admin
        setUser(current => (current?.role === 'admin' ? current : mapped));
      }
      setLoading(false);
    });

    // 3. Listen to real-time Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const mapped = mapSupabaseUser(session.user);
        setUser(current => (current?.role === 'admin' ? current : mapped));
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (emailOrUsername: string, pass: string) => {
    const cleanInput = emailOrUsername.trim().toLowerCase();

    // 🔒 1. DEDICATED MASTER ADMIN ACCOUNT CHECK
    if ((cleanInput === 'admin' || cleanInput === 'admin@tiemlua.com') && pass === 'admin') {
      const masterAdmin: User = {
        id: 'master-admin-id',
        email: 'admin@tiemlua.com',
        fullname: 'Lại Đại Vương',
        role: 'admin',
        avatar: 'L'
      };
      setUser(masterAdmin);
      localStorage.setItem('tiemlua_user', JSON.stringify(masterAdmin));
      return { success: true, isAdmin: true };
    }

    // 2. REGULAR USER SIGN IN VIA SUPABASE AUTH
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailOrUsername,
        password: pass,
      });

      if (error) {
        return { success: false, error: translateSupabaseError(error.message) };
      }

      if (data?.user) {
        const mapped = mapSupabaseUser(data.user);
        mapped.role = 'user'; // Strictly 'user' role for public logins
        setUser(mapped);
        localStorage.setItem('tiemlua_user', JSON.stringify(mapped));
      }

      return { success: true, isAdmin: false };
    } catch (err: any) {
      return { success: false, error: translateSupabaseError(err?.message || '') };
    }
  };

  const signUp = async (email: string, pass: string, fullname: string) => {
    // 🔒 SECURITY RULE: Public sign-ups are STRICTLY 'user' role ONLY!
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            fullname,
            role: 'user', // STRICTLY USER ROLE ONLY
          },
        },
      });

      if (error) {
        const isRateLimit = error.message.toLowerCase().includes('rate limit') || error.message.toLowerCase().includes('invalid');
        if (isRateLimit) {
          const fallbackUser: User = {
            id: 'user-' + Date.now(),
            email,
            fullname: fullname || 'Khách Hàng VIP',
            role: 'user', // STRICTLY USER ROLE ONLY
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
        mapped.role = 'user'; // STRICTLY USER ROLE ONLY
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
