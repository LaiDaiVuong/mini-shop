'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { INITIAL_PRODUCTS_DATA } from '@/lib/products-data';
import { fetchProductsFromSupabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/product/ProductCard';

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const [allProducts, setAllProducts] = useState<Product[]>(INITIAL_PRODUCTS_DATA);

  useEffect(() => {
    fetchProductsFromSupabase().then(data => {
      if (data && data.length > 0) {
        setAllProducts(data);
      }
    });
  }, []);

  const favoriteProducts = allProducts.filter(p => wishlist.includes(p.id));

  return (
    <>
      {/* Page Banner Section */}
      <section className="page-banner">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Trang Chủ</Link>
            <span>&rsaquo;</span>
            <span className="active-crumb">Sản Phẩm Yêu Thích</span>
          </div>
        </div>
      </section>

      {/* Wishlist Page Section */}
      <section className="wishlist-page-section" style={{ padding: '60px 0 100px', backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="container">
          
          {/* Wishlist Page Header */}
          <div className="wishlist-header-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, paddingBottom: 20, borderBottom: '1px solid var(--color-border)' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: 6, letterSpacing: 1 }}>
                DANH SÁCH YÊU THÍCH (<span id="wishlistTitleCount" style={{ color: 'var(--color-accent)' }}>{favoriteProducts.length}</span>)
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Những tuyệt tác bật lửa sang trọng bạn đã lưu lại</p>
            </div>
            {favoriteProducts.length > 0 && (
              <button 
                className="btn-clear-wishlist" 
                onClick={() => {
                  if (confirm('Bạn có chắc chắn muốn xóa toàn bộ danh sách yêu thích?')) {
                    favoriteProducts.forEach(p => toggleWishlist(p.id));
                  }
                }}
                style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', padding: '10px 18px', fontSize: '0.775rem', fontWeight: 600, textTransform: 'uppercase', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
              >
                Xóa Tất Cả
              </button>
            )}
          </div>

          {/* Wishlist Grid Container */}
          <div id="wishlistContentWrapper">
            {favoriteProducts.length === 0 ? (
              <div className="cart-empty-box" style={{ textAlign: 'center', padding: '70px 20px', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                <div className="empty-icon" style={{ marginBottom: 20, color: 'var(--color-accent)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </div>
                <h2 className="empty-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: 12, letterSpacing: 1 }}>DANH SÁCH YÊU THÍCH ĐANG TRỐNG</h2>
                <p className="empty-desc" style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', maxWidth: 500, margin: '0 auto 28px' }}>Hãy bấm vào biểu tượng trái tim trên các sản phẩm để lưu giữ những tuyệt tác bật lửa đẳng cấp nhất!</p>
                <Link href="/products" className="btn-browse-products" style={{ display: 'inline-block', padding: '14px 32px', background: 'var(--color-accent)', color: '#ffffff', fontSize: '0.8rem', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', borderRadius: 'var(--radius-sm)', textDecoration: 'none' }}>KHÁM PHÁ SẢN PHẨM NGAY</Link>
              </div>
            ) : (
              <div className="products-grid">
                {favoriteProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>
      </section>
    </>
  );
}
