'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState<'admin' | 'user'>('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsLoading(true);
    
    setTimeout(() => {
      login(username, role);
      setIsLoading(false);

      if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }, 600);
  };

  const handleFillDemo = (demoUser: string, demoPass: string, demoRole: 'admin' | 'user') => {
    setUsername(demoUser);
    setPassword(demoPass);
    setRole(demoRole);
  };

  return (
    <>
      {/* Compact Page Banner */}
      <section className="page-banner" style={{ padding: '35px 0 20px' }}>
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Trang Chủ</Link>
            <span>&rsaquo;</span>
            <span className="active-crumb">Đăng Nhập Hệ Thống</span>
          </div>
        </div>
      </section>

      {/* Main Luxury Split Login Section */}
      <section style={{ padding: '40px 0 90px', background: 'var(--color-bg-secondary)' }}>
        <div className="container" style={{ maxWidth: 1040 }}>
          
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
              background: '#ffffff', 
              borderRadius: 24, 
              overflow: 'hidden', 
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
              border: '1px solid var(--color-border)'
            }}
          >
            
            {/* LEFT COLUMN: Luxury Brand Visual Showcase */}
            <div 
              style={{ 
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
                color: '#fff', 
                padding: '48px 40px', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Background Ambient Glow */}
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '-20%', 
                  left: '-20%', 
                  width: '140%', 
                  height: '140%', 
                  background: 'radial-gradient(circle, rgba(197, 160, 89, 0.15) 0%, transparent 65%)', 
                  pointerEvents: 'none' 
                }} 
              />

              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(197, 160, 89, 0.2)', border: '1px solid var(--color-accent)', padding: '6px 16px', borderRadius: 30, color: 'var(--color-accent)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: 1.5, marginBottom: 24 }}>
                  ⚡ TIỆM LỬA LUXURY PORTAL
                </div>

                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1.3, marginBottom: 16 }}>
                  ĐẲNG CẤP BẬT LỬA QUÝ ÔNG
                </h2>

                <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 30 }}>
                  Trải nghiệm hệ thống quản trị và mua sắm các dòng kiệt tác S.T. Dupont France, Rowenta R10 Đức & Dupont Hongkong chế tác chuẩn âm thanh.
                </p>

                {/* Hero Showcase Image */}
                <div style={{ textAlign: 'center', position: 'relative', margin: '20px 0' }}>
                  <img 
                    src="/assets/img/products/S.T Dupont/Lacquered lighter cohiba 60 black.webp" 
                    alt="S.T. Dupont Cohiba 60th" 
                    style={{ 
                      maxHeight: 220, 
                      objectFit: 'contain', 
                      filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.6))',
                      transition: 'transform 0.4s ease'
                    }} 
                  />
                </div>
              </div>

              {/* Bottom Quote & Trust Badges */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, marginTop: 20 }}>
                <div style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--color-accent)', marginBottom: 12 }}>
                  "Tiếng Pinh ngân vang — Khẳng định vị thế thượng lưu."
                </div>
                <div style={{ display: 'flex', gap: 20, fontSize: '0.75rem', color: '#94a3b8' }}>
                  <span>🔒 Bảo mật mã hóa SSL</span>
                  <span>⚡ Xác thực 1-Touch</span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Interactive Login Form */}
            <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              
              <div style={{ marginBottom: 30 }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: 6 }}>
                  ĐĂNG NHẬP
                </h1>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  Vui lòng chọn vai trò và nhập thông tin tài khoản của bạn
                </p>
              </div>

              <form onSubmit={handleLogin}>
                
                {/* Role Switcher Pills */}
                <div style={{ marginBottom: 22 }}>
                  <label className="clean-form-label" style={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569', display: 'block', marginBottom: 8 }}>
                    VAI TRÒ TRUY CẬP HỆ THỐNG
                  </label>
                  <div style={{ display: 'flex', background: '#f1f5f9', padding: 4, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                    <button
                      type="button"
                      onClick={() => setRole('admin')}
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        borderRadius: 8,
                        fontWeight: 800,
                        fontSize: '0.825rem',
                        border: 'none',
                        cursor: 'pointer',
                        background: role === 'admin' ? 'var(--color-accent)' : 'transparent',
                        color: role === 'admin' ? '#ffffff' : '#64748b',
                        boxShadow: role === 'admin' ? '0 4px 12px rgba(197, 160, 89, 0.35)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      👑 Quản Trị Viên (Admin)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('user')}
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        borderRadius: 8,
                        fontWeight: 800,
                        fontSize: '0.825rem',
                        border: 'none',
                        cursor: 'pointer',
                        background: role === 'user' ? 'var(--color-accent)' : 'transparent',
                        color: role === 'user' ? '#ffffff' : '#64748b',
                        boxShadow: role === 'user' ? '0 4px 12px rgba(197, 160, 89, 0.35)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      ✨ Khách VIP (Store)
                    </button>
                  </div>
                </div>

                {/* Username Input */}
                <div className="clean-form-group" style={{ marginBottom: 18 }}>
                  <label className="clean-form-label" style={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569' }}>
                    Tên đăng nhập / Email <span>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      className="clean-form-input" 
                      placeholder="Nhập username (VD: admin)" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required 
                      style={{ paddingLeft: 40, height: 48, borderRadius: 10 }}
                    />
                    <span style={{ position: 'absolute', left: 14, top: 14, color: '#94a3b8', fontSize: '1rem' }}>👤</span>
                  </div>
                </div>

                {/* Password Input with Eye Toggle */}
                <div className="clean-form-group" style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label className="clean-form-label" style={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569', margin: 0 }}>
                      Mật khẩu <span>*</span>
                    </label>
                    <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Mật khẩu mặc định hệ thống: admin123'); }} style={{ fontSize: '0.775rem', color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>
                      Quên mật khẩu?
                    </a>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      className="clean-form-input" 
                      placeholder="Nhập mật khẩu" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                      style={{ paddingLeft: 40, paddingRight: 40, height: 48, borderRadius: 10 }}
                    />
                    <span style={{ position: 'absolute', left: 14, top: 14, color: '#94a3b8', fontSize: '1rem' }}>🔑</span>
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: 12, top: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '1.1rem' }}
                    >
                      {showPassword ? '👁️' : '🙈'}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                  <input type="checkbox" id="rememberMe" defaultChecked style={{ accentColor: 'var(--color-accent)', width: 16, height: 16 }} />
                  <label htmlFor="rememberMe" style={{ fontSize: '0.825rem', color: '#64748b', cursor: 'pointer' }}>Ghi nhớ phiên đăng nhập</label>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    height: 50,
                    background: 'linear-gradient(135deg, var(--color-accent) 0%, #b08b43 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 10,
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 6px 20px rgba(197, 160, 89, 0.4)',
                    transition: 'transform 0.2s ease, opacity 0.2s ease',
                    opacity: isLoading ? 0.7 : 1
                  }}
                >
                  {isLoading ? 'ĐANG XÁC THỰC...' : 'XÁC NHẬN ĐĂNG NHẬP'}
                </button>

              </form>

              {/* Demo Accounts Quick-Fill Helper */}
              <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
                  ⚡ THỬ NGHIỆM ĐĂNG NHẬP NHANH
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button 
                    type="button"
                    onClick={() => handleFillDemo('admin', 'admin123', 'admin')}
                    style={{ flex: 1, padding: '8px 10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}
                  >
                    👑 Admin (admin)
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleFillDemo('khachvip', '123456', 'user')}
                    style={{ flex: 1, padding: '8px 10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}
                  >
                    ✨ Khách VIP (khachvip)
                  </button>
                </div>
              </div>

              {/* Back to Home Link */}
              <div style={{ marginTop: 20, textAlign: 'center' }}>
                <Link href="/" style={{ fontSize: '0.825rem', color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>
                  &larr; Quay lại trang chủ Tiệm Lửa
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>
    </>
  );
}
