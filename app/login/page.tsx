'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  // Sign In state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign Up state
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regFullname, setRegFullname] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await signIn(email, password);
    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Đăng nhập không thành công. Vui lòng kiểm tra lại Email / Số điện thoại và Mật khẩu.');
    } else {
      setSuccessMsg('Đăng nhập thành công! Đang chuyển hướng...');
      setTimeout(() => {
        if (email.includes('admin')) {
          router.push('/admin');
        } else {
          router.push('/');
        }
      }, 500);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regPassword || !regFullname) return;

    if (regPassword.length < 6) {
      setErrorMsg('Mật khẩu phải chứa ít nhất 6 ký tự!');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const res = await signUp(regEmail, regPassword, regFullname);
    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Đăng ký không thành công. Thông tin này có thể đã được đăng ký.');
    } else {
      setSuccessMsg('Đăng ký tài khoản Tiệm Lửa thành công! Bạn đã tự động đăng nhập.');
      setTimeout(() => {
        if (regEmail.includes('admin')) {
          router.push('/admin');
        } else {
          router.push('/');
        }
      }, 800);
    }
  };

  return (
    <>
      {/* Page Banner Section - Fixed Top Padding to Prevent Header Overlap */}
      <section className="page-banner" style={{ paddingTop: '105px', paddingBottom: '20px' }}>
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Trang Chủ</Link>
            <span>&rsaquo;</span>
            <span className="active-crumb">Tài Khoản Tiệm Lửa</span>
          </div>
        </div>
      </section>

      {/* Main Luxury Split Login/Signup Section */}
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
                  ⚡ THÀNH VIÊN VIP TIỆM LỬA
                </div>

                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1.3, marginBottom: 16 }}>
                  ĐẲNG CẤP BẬT LỬA QUÝ ÔNG
                </h2>

                <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 30 }}>
                  Đăng nhập tài khoản để nhận chính sách bảo hành trọn đời, căn chỉnh âm Pinh miễn phí & theo dõi đơn hàng dễ dàng.
                </p>

                {/* Hero Showcase Image */}
                <div style={{ textAlign: 'center', position: 'relative', margin: '20px 0' }}>
                  <img 
                    src="/assets/img/products/S.T Dupont/Lacquered lighter cohiba 60 black.webp" 
                    alt="S.T. Dupont Cohiba 60th" 
                    style={{ 
                      maxHeight: 220, 
                      objectFit: 'contain', 
                      filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.6))'
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
                  <span>🔒 Bảo mật thông tin mã hóa 256-bit</span>
                  <span>⚡ Hỗ trợ 24/7</span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Interactive Form Column */}
            <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              
              {/* Tab Switcher: Đăng Nhập vs. Đăng Ký */}
              <div style={{ display: 'flex', background: '#f1f5f9', padding: 4, borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 24, width: '100%' }}>
                <button
                  type="button"
                  onClick={() => { setActiveTab('signin'); setErrorMsg(''); setSuccessMsg(''); }}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: 8,
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    border: 'none',
                    cursor: 'pointer',
                    background: activeTab === 'signin' ? 'var(--color-accent)' : 'transparent',
                    color: activeTab === 'signin' ? '#ffffff' : '#64748b',
                    boxShadow: activeTab === 'signin' ? '0 4px 12px rgba(197, 160, 89, 0.35)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  🔑 ĐĂNG NHẬP
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('signup'); setErrorMsg(''); setSuccessMsg(''); }}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: 8,
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    border: 'none',
                    cursor: 'pointer',
                    background: activeTab === 'signup' ? 'var(--color-accent)' : 'transparent',
                    color: activeTab === 'signup' ? '#ffffff' : '#64748b',
                    boxShadow: activeTab === 'signup' ? '0 4px 12px rgba(197, 160, 89, 0.35)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  📝 ĐĂNG KÝ TÀI KHOẢN
                </button>
              </div>

              {/* Alert Messages */}
              {errorMsg && (
                <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, color: '#dc2626', fontSize: '0.825rem', fontWeight: 600, marginBottom: 18, width: '100%' }}>
                  ⚠️ {errorMsg}
                </div>
              )}
              {successMsg && (
                <div style={{ padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, color: '#166534', fontSize: '0.825rem', fontWeight: 600, marginBottom: 18, width: '100%' }}>
                  ✓ {successMsg}
                </div>
              )}

              {/* TAB 1: SIGN IN FORM */}
              {activeTab === 'signin' && (
                <form onSubmit={handleSignIn} style={{ width: '100%' }}>
                  <div className="clean-form-group" style={{ marginBottom: 18, width: '100%' }}>
                    <label className="clean-form-label" style={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569', display: 'block', marginBottom: 6 }}>
                      Email / Số điện thoại <span>*</span>
                    </label>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <input 
                        type="text" 
                        className="clean-form-input" 
                        placeholder="Nhập Email hoặc Số điện thoại" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                        style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 42, paddingRight: 16, height: 48, borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                      />
                      <span style={{ position: 'absolute', left: 14, top: 13, color: '#94a3b8', fontSize: '1rem' }}>📱</span>
                    </div>
                  </div>

                  <div className="clean-form-group" style={{ marginBottom: 20, width: '100%' }}>
                    <label className="clean-form-label" style={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569', display: 'block', marginBottom: 6 }}>
                      Mật khẩu <span>*</span>
                    </label>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        className="clean-form-input" 
                        placeholder="Nhập mật khẩu" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 42, paddingRight: 42, height: 48, borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                      />
                      <span style={{ position: 'absolute', left: 14, top: 13, color: '#94a3b8', fontSize: '1rem' }}>🔑</span>
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: 12, top: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '1.1rem' }}
                      >
                        {showPassword ? '👁️' : '🙈'}
                      </button>
                    </div>
                  </div>

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
                      opacity: isLoading ? 0.7 : 1
                    }}
                  >
                    {isLoading ? 'ĐANG XÁC THỰC...' : 'ĐĂNG NHẬP'}
                  </button>
                </form>
              )}

              {/* TAB 2: SIGN UP FORM */}
              {activeTab === 'signup' && (
                <form onSubmit={handleSignUp} style={{ width: '100%' }}>
                  <div className="clean-form-group" style={{ marginBottom: 16, width: '100%' }}>
                    <label className="clean-form-label" style={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569', display: 'block', marginBottom: 6 }}>
                      Họ và tên quý khách <span>*</span>
                    </label>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <input 
                        type="text" 
                        className="clean-form-input" 
                        placeholder="Ví dụ: Nguyễn Văn Hùng" 
                        value={regFullname}
                        onChange={(e) => setRegFullname(e.target.value)}
                        required 
                        style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 42, paddingRight: 16, height: 48, borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                      />
                      <span style={{ position: 'absolute', left: 14, top: 13, color: '#94a3b8', fontSize: '1rem' }}>👤</span>
                    </div>
                  </div>

                  <div className="clean-form-group" style={{ marginBottom: 16, width: '100%' }}>
                    <label className="clean-form-label" style={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569', display: 'block', marginBottom: 6 }}>
                      Email / Số điện thoại <span>*</span>
                    </label>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <input 
                        type="text" 
                        className="clean-form-input" 
                        placeholder="Nhập Email hoặc Số điện thoại" 
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required 
                        style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 42, paddingRight: 16, height: 48, borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                      />
                      <span style={{ position: 'absolute', left: 14, top: 13, color: '#94a3b8', fontSize: '1rem' }}>📱</span>
                    </div>
                  </div>

                  <div className="clean-form-group" style={{ marginBottom: 20, width: '100%' }}>
                    <label className="clean-form-label" style={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569', display: 'block', marginBottom: 6 }}>
                      Mật khẩu (Tối thiểu 6 ký tự) <span>*</span>
                    </label>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        className="clean-form-input" 
                        placeholder="Nhập mật khẩu" 
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required 
                        minLength={6}
                        style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 42, paddingRight: 42, height: 48, borderRadius: 10, border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                      />
                      <span style={{ position: 'absolute', left: 14, top: 13, color: '#94a3b8', fontSize: '1rem' }}>🔑</span>
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: 12, top: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '1.1rem' }}
                      >
                        {showPassword ? '👁️' : '🙈'}
                      </button>
                    </div>
                  </div>

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
                      opacity: isLoading ? 0.7 : 1
                    }}
                  >
                    {isLoading ? 'ĐANG TẠO TÀI KHOẢN...' : 'TẠO TÀI KHOẢN MỚI'}
                  </button>
                </form>
              )}

              {/* Back to Home Link */}
              <div style={{ marginTop: 24, textAlign: 'center' }}>
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
