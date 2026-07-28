'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { INITIAL_PRODUCTS_DATA } from '@/lib/products-data';
import { fetchProductsFromSupabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/product/ProductCard';

export default function DupontHongkongCollectionPage() {
  const [productsList, setProductsList] = useState<Product[]>(
    INITIAL_PRODUCTS_DATA.filter(p => p.category === 'dupont-hk' || p.category === 'dupont-hongkong')
  );

  useEffect(() => {
    fetchProductsFromSupabase().then(data => {
      if (data && data.length > 0) {
        setProductsList(data.filter(p => p.category === 'dupont-hk' || p.category === 'dupont-hongkong'));
      }
    });
  }, []);

  return (
    <>
      {/* Collection Hero Section */}
      <section className="collection-hero">
        <div className="container">
          <div className="breadcrumb" style={{ marginBottom: 16 }}>
            <Link href="/" style={{ color: '#ecfdf5' }}>Trang Chủ</Link>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>&rsaquo;</span>
            <Link href="/products" style={{ color: '#ecfdf5' }}>Sản Phẩm</Link>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>&rsaquo;</span>
            <span style={{ color: '#fef08a', fontWeight: 700 }}>Dupont Hongkong</span>
          </div>

          <div style={{ width: '100%' }}>
            <span style={{ display: 'inline-block', background: 'rgba(254, 240, 138, 0.2)', color: '#fef08a', border: '1px solid #fef08a', padding: '4px 14px', borderRadius: 30, fontSize: '0.75rem', fontWeight: 700, letterSpacing: 1.5, marginBottom: 10 }}>
              🐉 DUPONT HỒNG KÔNG PREMIUM
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.1rem', fontWeight: 800, marginBottom: 8, color: '#fff' }}>
              BỘ SƯU TẬP DUPONT HỒNG KÔNG SANG TRỌNG
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#ecfdf5', lineHeight: 1.5, margin: 0 }}>
              Phiên bản chế tác phom Ligne 2, vỏ đồng phay xước mạ 18K chuẩn âm thanh.
            </p>
          </div>
        </div>
      </section>

      {/* Main Collection Grid */}
      <section className="products-page-section" style={{ padding: '60px 0 90px', background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <div className="products-top-bar" style={{ marginBottom: 30 }}>
            <div className="products-result-count">
              Hiển thị <strong>{productsList.length}</strong> mẫu Dupont Hongkong chế tác đỉnh cao
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
