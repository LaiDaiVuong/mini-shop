'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { INITIAL_PRODUCTS_DATA } from '@/lib/products-data';
import { fetchProductsFromSupabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/product/ProductCard';

export default function STDupontCollectionPage() {
  const [productsList, setProductsList] = useState<Product[]>(
    INITIAL_PRODUCTS_DATA.filter(p => p.category === 'st-dupont')
  );

  useEffect(() => {
    fetchProductsFromSupabase().then(data => {
      if (data && data.length > 0) {
        setProductsList(data.filter(p => p.category === 'st-dupont'));
      }
    });
  }, []);

  return (
    <>
      {/* Collection Hero Section */}
      <section className="collection-hero">
        <div className="container">
          <div className="breadcrumb" style={{ marginBottom: 16 }}>
            <Link href="/" style={{ color: '#cbd5e1' }}>Trang Chủ</Link>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>&rsaquo;</span>
            <Link href="/products" style={{ color: '#cbd5e1' }}>Sản Phẩm</Link>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>&rsaquo;</span>
            <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>S.T. Dupont France</span>
          </div>

          <div style={{ width: '100%' }}>
            <span style={{ display: 'inline-block', background: 'rgba(197, 160, 89, 0.2)', color: 'var(--color-accent)', border: '1px solid var(--color-accent)', padding: '4px 14px', borderRadius: 30, fontSize: '0.75rem', fontWeight: 700, letterSpacing: 1.5, marginBottom: 10 }}>
              🇫🇷 S.T. DUPONT PARIS
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.1rem', fontWeight: 800, marginBottom: 8, color: '#fff' }}>
              BỘ SƯU TẬP BẬT LỬA S.T. DUPONT FRANCE
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
              Tuyệt tác sơn mài tự nhiên Urushi Pháp, mạ vàng 24K & âm Pinh ngân vang thượng lưu.
            </p>
          </div>
        </div>
      </section>

      {/* Main Collection Grid */}
      <section className="products-page-section" style={{ padding: '60px 0 90px', background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <div className="products-top-bar" style={{ marginBottom: 30 }}>
            <div className="products-result-count">
              Hiển thị <strong>{productsList.length}</strong> kiệt tác S.T. Dupont chính hãng
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
