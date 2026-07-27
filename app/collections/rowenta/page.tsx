'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_PRODUCTS_DATA } from '@/lib/products-data';
import { ProductCard } from '@/components/product/ProductCard';

export default function RowentaCollectionPage() {
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('default');

  let filtered = INITIAL_PRODUCTS_DATA.filter(p => p.category === 'rowenta');

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
  }

  if (sortOption === 'price-asc') filtered.sort((a, b) => a.priceNum - b.priceNum);
  if (sortOption === 'price-desc') filtered.sort((a, b) => b.priceNum - a.priceNum);
  if (sortOption === 'name-asc') filtered.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <section className="collection-hero">
        <div className="container">
          <div className="breadcrumb" style={{ marginBottom: 16 }}>
            <Link href="/" style={{ color: '#fef3c7' }}>Trang Chủ</Link>
            <span style={{ color: '#fde68a', margin: '0 8px' }}>&rsaquo;</span>
            <Link href="/products" style={{ color: '#fef3c7' }}>Bộ Sưu Tập</Link>
            <span style={{ color: '#fde68a', margin: '0 8px' }}>&rsaquo;</span>
            <span style={{ color: '#fde68a', fontWeight: 700 }}>Rowenta R10 Đức</span>
          </div>

          <div style={{ width: '100%' }}>
            <span style={{ display: 'inline-block', background: 'rgba(254, 243, 199, 0.2)', color: '#fde68a', border: '1px solid #fde68a', padding: '4px 14px', borderRadius: 30, fontSize: '0.75rem', fontWeight: 700, letterSpacing: 1.5, marginBottom: 10 }}>
              🇩🇪 ROWENTA GERMANY
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.1rem', fontWeight: 800, marginBottom: 8, color: '#fff' }}>
              BỘ SƯU TẬP BẬT LỬA ROWENTA R10 ĐỨC
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#fef3c7', lineHeight: 1.5, margin: 0 }}>
              Cơ chế gạt đòn bẩy ngang độc bản Đức thập niên 70, vân dung nham mạ vàng vintage.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '40px 0 70px', background: '#fafafa' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24, padding: '16px 20px', background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text-main)' }}>
              Danh sách sản phẩm Rowenta R10 ({filtered.length})
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="Tìm theo tên sản phẩm Rowenta..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.9rem', width: 280 }}
              />
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={{ padding: '10px 16px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.9rem', background: '#fff', cursor: 'pointer' }}
              >
                <option value="default">Sắp xếp: Mới Nhất</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="name-asc">Tên: A - Z</option>
              </select>
            </div>
          </div>

          <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 24 }}>
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
