'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { INITIAL_PRODUCTS_DATA } from '@/lib/products-data';
import { fetchProductsFromSupabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/product/ProductCard';

export default function HomePage() {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS_DATA);

  useEffect(() => {
    fetchProductsFromSupabase().then((data) => {
      if (data && data.length > 0) setProducts(data);
    });
  }, []);

  const featuredProducts = products.slice(0, 4);

  return (
    <>
      {/* Hero Banner Section with Auto-Switch Video Background (Homepage Only) */}
      <section className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="hero-bg-container" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {/* Static fallback image (Loads immediately when opening page) */}
          <img 
            src="/assets/img/banner/banner.png" 
            alt="Tiệm Lửa Luxury Banner" 
            className="hero-bg-img" 
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: isVideoReady ? 0 : 1,
              transition: 'opacity 1s ease',
              transform: 'none',
              zIndex: 1,
            }}
          />

          {/* Video Banner (Plays automatically once ready) */}
          <video
            autoPlay
            loop
            muted
            playsInline
            onCanPlay={() => setIsVideoReady(true)}
            onLoadedData={() => setIsVideoReady(true)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: isVideoReady ? 1 : 0,
              transition: 'opacity 1s ease',
              transform: 'none',
              zIndex: 2,
            }}
          >
            <source src="/assets/vid/videos_banner.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="hero-overlay" style={{ zIndex: 3 }}>
          <div className="container">
            <div className="hero-content">
              <span className="hero-subtitle">BỘ SƯU TẬP LUXURY 2026</span>
              <h1 className="hero-title">ĐẲNG CẤP & SANG TRỌNG</h1>
              <p className="hero-description">
                Khám phá tuyệt tác bật lửa S.T. Dupont, Rowenta R10 và Dupont Chế Tác Hồng Kông. Tiếng "Pinh" ngân vang âm hay, hoàn thiện kim loại quý & sơn mài thủ công tinh xảo.
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Link href="/products" className="btn-primary">
                  KHÁM PHÁ NGAY
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </Link>
                <Link href="/products" className="btn-secondary">
                  XEM SẢN PHẨM
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Section */}
      <section className="categories-section" id="danh-muc-noi-bat">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">DANH MỤC NỔI BẬT</span>
            <h2 className="section-title">THƯƠNG HIỆU & DÒNG SẢN PHẨM</h2>
            <div className="section-divider"></div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Lựa chọn những dòng bật lửa danh tiếng thế giới với vẻ đẹp vượt thời gian
            </p>
          </div>

          <div className="categories-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {/* Category 1: S.T Dupont France */}
            <Link href="/collections/st-dupont" className="category-card">
              <img src="/assets/img/products/S.T Dupont/Lacquered lighter cohiba 60 black.webp" alt="S.T Dupont Paris" className="category-img" />
              <div className="category-overlay">
                <h3 className="category-title">S.T. DUPONT PARIS</h3>
                <p className="category-subtitle">Bật lửa cao cấp nhập khẩu Pháp, sơn mài & mạ vàng 24K</p>
                <span className="category-link">
                  Xem Bộ Sưu Tập
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </span>
              </div>
            </Link>

            {/* Category 2: Dupont HongKong */}
            <Link href="/collections/dupont-hongkong" className="category-card">
              <img src="/assets/img/products/Dupont HongKong/sơn mài đen viền vàng.webp" alt="Dupont Hongkong" className="category-img" />
              <div className="category-overlay">
                <h3 className="category-title">DUPONT HỒNG KÔNG</h3>
                <p className="category-subtitle">Phiên bản chế tác chuẩn âm, hoàn thiện xước tinh tế</p>
                <span className="category-link">
                  Xem Bộ Sưu Tập
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </span>
              </div>
            </Link>

            {/* Category 3: Rowenta R10 */}
            <Link href="/collections/rowenta" className="category-card">
              <img src="/assets/img/products/Rowenta R10/Vàng xước.jpg" alt="Rowenta R10" className="category-img" />
              <div className="category-overlay">
                <h3 className="category-title">ROWENTA R10 ĐỨC</h3>
                <p className="category-subtitle">Cơ chế đòn bẩy độc bản & xước vàng vintage sang trọng</p>
                <span className="category-link">
                  Xem Bộ Sưu Tập
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </span>
              </div>
            </Link>

            {/* Category 4: Phụ Kiện Lửa */}
            <Link href="/collections/phu-kien" className="category-card">
              <img src="/assets/img/products/Phụ kiện/Gas nạp 150g.webp" alt="Phụ Kiện Lửa" className="category-img" />
              <div className="category-overlay">
                <h3 className="category-title">PHỤ KIỆN LỬA VIP</h3>
                <p className="category-subtitle">Gas Butane 5X Pure, đá lửa chuyên dụng & bao da thủ công</p>
                <span className="category-link">
                  Xem Bộ Sưu Tập
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="products-section" id="san-pham-noi-bat">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">TUYỆT TÁC LỰA CHỌN</span>
            <h2 className="section-title">SẢN PHẨM NỔI BẬT</h2>
            <div className="section-divider"></div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Những mẫu bật lửa bán chạy và được yêu thích nhất tại Tiệm Lửa
            </p>
          </div>

          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* View More Button */}
          <div className="section-footer-right">
            <Link href="/products" className="btn-view-more">
              Xem Thêm Sản Phẩm
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Trust Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <div>
                <h4 className="feature-title">CAM KẾT CHÍNH HÃNG</h4>
                <p className="feature-desc">100% chuẩn chất lượng & kiểm định âm thanh</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              </div>
              <div>
                <h4 className="feature-title">GIAO HÀNG TOÀN QUỐC</h4>
                <p className="feature-desc">Đóng gói sang trọng, kiểm tra trước khi nhận</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
              </div>
              <div>
                <h4 className="feature-title">BẢO HÀNH TRỌN ĐỜI</h4>
                <p className="feature-desc">Hỗ trợ vệ sinh, căn chỉnh âm & bơm ga chuẩn</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <div>
                <h4 className="feature-title">TƯ VẤN 24/7</h4>
                <p className="feature-desc">Hotline & Zalo chuyên viên am hiểu bật lửa</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
