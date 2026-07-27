'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState<'admin' | 'user'>('admin');

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, role);

    if (role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/');
    }
  };

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Trang Chủ</Link>
            <span>&rsaquo;</span>
            <span>Tài Khoản</span>
          </div>
          <h1 className="page-title">ĐĂNG NHẬP HỆ THỐNG</h1>
        </div>
      </section>

      <section style={{ padding: '60px 0 90px', background: '#fafafa' }}>
        <div className="container" style={{ maxWidth: 460 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                TIỆM <span style={{ color: 'var(--color-accent)' }}>LỬA</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4 }}>Đăng nhập trải nghiệm hệ thống</p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="clean-form-group">
                <label className="clean-form-label">Tên tài khoản / Email</label>
                <input 
                  type="text" 
                  className="clean-form-input" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                />
              </div>

              <div className="clean-form-group">
                <label className="clean-form-label">Mật khẩu</label>
                <input 
                  type="password" 
                  className="clean-form-input" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>

              <div className="clean-form-group">
                <label className="clean-form-label">Chọn vai trò giả lập</label>
                <select 
                  className="clean-form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
                >
                  <option value="admin">👑 Quản Trị Viên (Admin Dashboard)</option>
                  <option value="user">✨ Khách Hàng Thượng Lưu (Storefront)</option>
                </select>
              </div>

              <button 
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, var(--color-accent) 0%, #b08b43 100%)',
                  color: '#fff',
                  borderRadius: 10,
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  marginTop: 12,
                  boxShadow: '0 4px 18px rgba(197, 160, 89, 0.4)'
                }}
              >
                ĐĂNG NHẬP NGAY
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
