'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { formatCurrencyVND } from '@/lib/products-data';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  user?: User | null;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  user
}) => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [status, setStatus] = useState<'active' | 'locked'>('active');
  const [spentNum, setSpentNum] = useState<number>(0);

  useEffect(() => {
    if (user) {
      setFullname(user.fullname || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setRole(user.role || 'user');
      setStatus(user.status || 'active');
      setSpentNum(user.spent || 0);
    } else {
      setFullname('');
      setEmail('');
      setPhone('');
      setRole('user');
      setStatus('active');
      setSpentNum(0);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullname.trim() || !email.trim()) {
      alert('Vui lòng điền Họ tên và Email hợp lệ!');
      return;
    }

    const savedUser: User = {
      id: user?.id || 'usr-' + Date.now(),
      email: email.trim().toLowerCase(),
      fullname: fullname.trim(),
      phone: phone.trim(),
      role,
      status,
      avatar: (fullname.trim() || email.trim()).charAt(0).toUpperCase(),
      createdAt: user?.createdAt || new Date().toISOString().replace('T', ' ').substring(0, 16),
      spent: spentNum,
      spentFormatted: formatCurrencyVND(spentNum)
    };

    onSave(savedUser);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}
    >
      <div 
        style={{
          background: '#ffffff',
          borderRadius: 20,
          maxWidth: 720,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
          border: '1px solid #e2e8f0'
        }}
      >
        {/* Modal Header (#0F172A Theme) */}
        <div 
          style={{
            background: '#0F172A',
            color: '#ffffff',
            padding: '20px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid #C89B3C'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.4rem' }}>{user ? '⚡' : '👤'}</span>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: 1 }}>
                {user ? 'CHỈNH SỬA THÔNG TIN USER' : 'THÊM TÀI KHOẢN USER MỚI'}
              </h2>
              <div style={{ fontSize: '0.775rem', color: '#C89B3C', marginTop: 2 }}>Trạm quản lý người dùng & khách hàng Tiệm Lửa</div>
            </div>
          </div>

          <button 
            type="button" 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#ffffff',
              width: 36,
              height: 36,
              borderRadius: '50%',
              fontSize: '1.4rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            &times;
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: 28 }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            
            {/* LEFT: Preview Card */}
            <div style={{ background: '#f8fafc', padding: 20, borderRadius: 16, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
              <div style={{ 
                width: 72, 
                height: 72, 
                borderRadius: '50%', 
                background: role === 'admin' ? 'linear-gradient(135deg, #C89B3C 0%, #a67c2e 100%)' : '#3b82f6', 
                color: '#fff', 
                fontWeight: 800, 
                fontSize: '2rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                marginBottom: 14
              }}>
                {role === 'admin' ? '👑' : (fullname || email || 'U').charAt(0).toUpperCase()}
              </div>

              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A', marginBottom: 4 }}>
                {fullname || 'Tên Người Dùng'}
              </div>
              <div style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: 12 }}>
                {email || 'email@example.com'}
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 16 }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  background: role === 'admin' ? '#fef3c7' : '#eff6ff',
                  color: role === 'admin' ? '#b45309' : '#2563eb',
                  border: '1px solid currentColor'
                }}>
                  {role === 'admin' ? '👑 Quản Trị Viên VIP' : '👤 Khách Hàng VIP'}
                </span>

                <span style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  background: status === 'active' ? '#ecfdf5' : '#fef2f2',
                  color: status === 'active' ? '#10B981' : '#EF4444',
                  border: '1px solid currentColor'
                }}>
                  ● {status === 'active' ? 'Hoạt động' : 'Đang khóa'}
                </span>
              </div>

              <div style={{ background: '#ffffff', width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>TỔNG CHI TIÊU TÍCH LŨY</div>
                <div style={{ fontWeight: 800, color: '#C89B3C', fontSize: '1.15rem', marginTop: 2 }}>
                  {formatCurrencyVND(spentNum || 0)}
                </div>
              </div>
            </div>

            {/* RIGHT: Input Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              
              {/* Field: Full Name */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Họ và tên <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Ví dụ: Nguyễn Văn Hùng" 
                  value={fullname} 
                  onChange={(e) => setFullname(e.target.value)}
                  required 
                  style={{ width: '100%', boxSizing: 'border-box', height: 42, padding: '0 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.875rem', color: '#0F172A' }}
                />
              </div>

              {/* Field: Email */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Email / Tên đăng nhập <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Ví dụ: hung.nguyen@vip.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  style={{ width: '100%', boxSizing: 'border-box', height: 42, padding: '0 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.875rem', color: '#0F172A' }}
                />
              </div>

              {/* Field: Phone */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Số điện thoại
                </label>
                <input 
                  type="text" 
                  placeholder="Ví dụ: 0988 299 999" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', height: 42, padding: '0 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.875rem', color: '#0F172A' }}
                />
              </div>

              {/* Field: Role & Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>
                    Phân quyền (Role)
                  </label>
                  <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value as any)}
                    style={{ width: '100%', boxSizing: 'border-box', height: 42, padding: '0 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', color: '#0F172A', fontWeight: 700 }}
                  >
                    <option value="user">👤 User (Khách hàng)</option>
                    <option value="admin">👑 Admin (Quản trị)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>
                    Trạng thái
                  </label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value as any)}
                    style={{ width: '100%', boxSizing: 'border-box', height: 42, padding: '0 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', color: '#0F172A', fontWeight: 700 }}
                  >
                    <option value="active">● Hoạt động</option>
                    <option value="locked">🔒 Tạm khóa</option>
                  </select>
                </div>
              </div>

              {/* Field: Spent */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Tổng chi tiêu (VNĐ)
                </label>
                <input 
                  type="number" 
                  placeholder="Nhập tổng chi tiêu..." 
                  value={spentNum || ''} 
                  onChange={(e) => setSpentNum(Number(e.target.value))}
                  style={{ width: '100%', boxSizing: 'border-box', height: 42, padding: '0 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.875rem', color: '#0F172A', fontWeight: 700 }}
                />
              </div>

            </div>

          </div>

          {/* Action Buttons Footer */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 20, borderTop: '1px solid #e2e8f0', marginTop: 24 }}>
            <button 
              type="button" 
              onClick={onClose} 
              style={{ padding: '10px 20px', border: '1px solid #cbd5e1', background: '#ffffff', borderRadius: 8, fontWeight: 700, color: '#64748b', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Hủy Bỏ
            </button>
            <button 
              type="submit" 
              style={{ 
                padding: '10px 28px', 
                background: 'linear-gradient(135deg, #C89B3C 0%, #a67c2e 100%)', 
                border: 'none', 
                color: '#ffffff', 
                borderRadius: 8, 
                fontWeight: 800, 
                fontSize: '0.85rem', 
                boxShadow: '0 4px 18px rgba(200, 155, 60, 0.4)',
                cursor: 'pointer' 
              }}
            >
              💾 LƯU THÔNG TIN USER
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
