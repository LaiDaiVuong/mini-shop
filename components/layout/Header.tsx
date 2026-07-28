'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const pathname = usePathname();

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClass = isScrolled ? 'site-header scrolled' : 'site-header';

  return (
    <>
      <header className={headerClass}>
        <div className="container header-container">
          <Link href="/" className="brand-logo" title="Tiệm Lửa - Luxury Lighters">
            <span>TIỆM <span className="logo-accent">LỬA</span></span>
          </Link>
          
          <nav className="main-nav">
            <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Trang Chủ</Link>
            <Link href="/products" className={`nav-link ${pathname === '/products' ? 'active' : ''}`}>Tất Cả Sản Phẩm</Link>
            <Link href="/collections/st-dupont" className={`nav-link ${pathname === '/collections/st-dupont' ? 'active' : ''}`}>S.T. Dupont France</Link>
            <Link href="/collections/dupont-hongkong" className={`nav-link ${pathname === '/collections/dupont-hongkong' ? 'active' : ''}`}>Dupont Hongkong</Link>
            <Link href="/collections/rowenta" className={`nav-link ${pathname === '/collections/rowenta' ? 'active' : ''}`}>Rowenta R10</Link>
            <Link href="/collections/phu-kien" className={`nav-link ${pathname === '/collections/phu-kien' ? 'active' : ''}`}>Phụ Kiện Lửa</Link>
          </nav>
          
          <div className="header-actions">
            <div style={{ position: 'relative' }}>
              <button 
                className="action-btn" 
                title="Tài khoản"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {user ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'var(--color-accent)',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(197, 160, 89, 0.4)'
                    }}>
                      {user.avatar || user.fullname.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-main)', maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.fullname}
                    </span>
                  </div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                )}
              </button>

              {showUserDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: 240,
                  background: '#ffffff',
                  borderRadius: 12,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  border: '1px solid #e2e8f0',
                  padding: '14px 16px',
                  zIndex: 100,
                  color: '#0f172a'
                }}>
                  {user ? (
                    <>
                      <div style={{ fontWeight: 800, fontSize: '0.925rem', marginBottom: 2 }}>{user.fullname}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 4, textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.email}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--color-accent)', fontWeight: 700, marginBottom: 12 }}>
                        {user.role === 'admin' ? '👑 Quản Trị Viên VIP' : '✨ Thành Viên VIP Tiệm Lửa'}
                      </div>
                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {user.role === 'admin' && (
                          <Link href="/admin" onClick={() => setShowUserDropdown(false)} style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-accent)', textDecoration: 'none' }}>
                            ⚡ Trang Quản Lý Admin
                          </Link>
                        )}
                        <button 
                          onClick={() => { logout(); setShowUserDropdown(false); }}
                          style={{ textAlign: 'left', fontSize: '0.825rem', color: '#ef4444', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          🚪 Đăng Xuất Supabase
                        </button>
                      </div>
                    </>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Tài Khoản Supabase Live</div>
                      <Link 
                        href="/login" 
                        onClick={() => setShowUserDropdown(false)} 
                        style={{ display: 'block', padding: '10px 14px', background: 'linear-gradient(135deg, var(--color-accent) 0%, #b08b43 100%)', color: '#fff', textAlign: 'center', borderRadius: 8, fontWeight: 800, fontSize: '0.825rem', textDecoration: 'none' }}
                      >
                        Đăng Nhập / Đăng Ký
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <Link href="/wishlist" className="action-btn" title="Danh sách yêu thích">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              <span className="wishlist-badge">{wishlistCount}</span>
            </Link>
            
            <Link href="/cart" className="action-btn" title="Giỏ hàng">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              <span className="cart-badge">{cartCount}</span>
            </Link>
            
            <button className="mobile-toggle" onClick={() => setIsMobileOpen(true)} aria-label="Open menu">
              &#9776;
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <>
          <div className="mobile-nav-overlay active" onClick={() => setIsMobileOpen(false)}></div>
          <div className="mobile-nav-drawer active">
            <div className="drawer-header">
              <div className="brand-logo">TIỆM <span className="logo-accent">LỬA</span></div>
              <button className="drawer-close" onClick={() => setIsMobileOpen(false)}>&times;</button>
            </div>
            <div className="mobile-nav-links" onClick={() => setIsMobileOpen(false)}>
              <Link href="/">Trang Chủ</Link>
              <Link href="/products">Tất Cả Sản Phẩm</Link>
              <Link href="/collections/st-dupont">S.T. Dupont France</Link>
              <Link href="/collections/dupont-hongkong">Dupont Hongkong</Link>
              <Link href="/collections/rowenta">Rowenta R10 Đức</Link>
              <Link href="/collections/phu-kien">Phụ Kiện Lửa</Link>
              <Link href="/cart">Giỏ Hàng ({cartCount})</Link>
              <Link href="/wishlist">Yêu Thích ({wishlistCount})</Link>
              {user ? (
                <button onClick={() => logout()} style={{ color: '#ef4444', textAlign: 'left', background: 'none', border: 'none', fontWeight: 700, padding: 0 }}>
                  Đăng Xuất ({user.fullname})
                </button>
              ) : (
                <Link href="/login">Đăng Nhập / Đăng Ký</Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};
