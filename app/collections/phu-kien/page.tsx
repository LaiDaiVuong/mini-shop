'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { INITIAL_PRODUCTS_DATA } from '@/lib/products-data';
import { fetchProductsFromSupabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/product/ProductCard';

export default function PhuKienCollectionPage() {
  const [productsList, setProductsList] = useState<Product[]>(
    INITIAL_PRODUCTS_DATA.filter(p => p.category === 'phu-kien')
  );

  useEffect(() => {
    fetchProductsFromSupabase().then(data => {
      if (data && data.length > 0) {
        setProductsList(data.filter(p => p.category === 'phu-kien'));
      }
    });
  }, []);

  return (
    <>
      {/* Collection Hero Section */}
      <section className="collection-hero">
        <div className="container">
          <div className="breadcrumb" style={{ marginBottom: 16 }}>
            <Link href="/" style={{ color: '#f1f5f9' }}>Trang Chủ</Link>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>&rsaquo;</span>
            <Link href="/products" style={{ color: '#f1f5f9' }}>Sản Phẩm</Link>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>&rsaquo;</span>
            <span style={{ color: '#bae6fd', fontWeight: 700 }}>Phụ Kiện Lửa</span>
          </div>

          <div style={{ width: '100%' }}>
            <span style={{ display: 'inline-block', background: 'rgba(186, 230, 253, 0.2)', color: '#bae6fd', border: '1px solid #bae6fd', padding: '4px 14px', borderRadius: 30, fontSize: '0.75rem', fontWeight: 700, letterSpacing: 1.5, marginBottom: 10 }}>
              🛠️ PHỤ KIỆN LỬA VIP
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.1rem', fontWeight: 800, marginBottom: 8, color: '#fff' }}>
              BỘ SƯU TẬP PHỤ KIỆN BẬT LỬA VIP
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#f1f5f9', lineHeight: 1.5, margin: 0 }}>
              Gas Butane 5X Pure tinh khiết, đá lửa Magie siêu nhạy & bao da thủ công.
            </p>
          </div>
        </div>
      </section>

      {/* Main Collection Grid */}
      <section className="products-page-section" style={{ padding: '60px 0 90px', background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <div className="products-top-bar" style={{ marginBottom: 30 }}>
            <div className="products-result-count">
              Hiển thị <strong>{productsList.length}</strong> vật tư phụ kiện chuyên dụng cao cấp
            </div>
          </div>

          <div className="products-grid">
            {productsList.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
