'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { INITIAL_PRODUCTS_DATA } from '@/lib/products-data';
import { fetchProductsFromSupabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/product/ProductCard';

export default function ProductsPage() {
  const [productsList, setProductsList] = useState<Product[]>(INITIAL_PRODUCTS_DATA);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortOption, setSortOption] = useState('newest');

  useEffect(() => {
    fetchProductsFromSupabase().then((data) => {
      if (data && data.length > 0) setProductsList(data);
    });
  }, []);

  let filtered = [...productsList];

  if (selectedCategory !== 'all') {
    filtered = filtered.filter(p => p.category === selectedCategory || (selectedCategory === 'dupont-hk' && p.category === 'dupont-hongkong'));
  }

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
  }

  if (priceRange === 'under-5m') {
    filtered = filtered.filter(p => p.priceNum < 5000000);
  } else if (priceRange === '5m-20m') {
    filtered = filtered.filter(p => p.priceNum >= 5000000 && p.priceNum <= 20000000);
  } else if (priceRange === 'over-20m') {
    filtered = filtered.filter(p => p.priceNum > 20000000);
  }

  if (sortOption === 'price-asc') filtered.sort((a, b) => a.priceNum - b.priceNum);
  if (sortOption === 'price-desc') filtered.sort((a, b) => b.priceNum - a.priceNum);
  if (sortOption === 'name-asc') filtered.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      {/* Page Banner Section */}
      <section className="page-banner products-page-banner">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Trang Chủ</Link>
            <span>&rsaquo;</span>
            <span>Sản Phẩm</span>
          </div>
          <h1 className="page-title">DANH SÁCH SẢN PHẨM</h1>
        </div>
      </section>

      {/* Products Listing Page Section */}
      <section className="products-page-section">
        <div className="container">
          <div className="products-page-layout">
            
            {/* Left Sidebar Filter */}
            <aside className="filters-sidebar">
              
              {/* Category Filter Group */}
              <div className="filter-group">
                <h3 className="filter-group-title">
                  Danh Mục
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </h3>
                <ul className="filter-list">
                  {[
                    { id: 'all', label: 'Tất Cả Sản Phẩm', count: productsList.length },
                    { id: 'st-dupont', label: 'S.T. Dupont France', count: productsList.filter(p => p.category === 'st-dupont').length },
                    { id: 'dupont-hk', label: 'Dupont Hongkong', count: productsList.filter(p => p.category === 'dupont-hk' || p.category === 'dupont-hongkong').length },
                    { id: 'rowenta', label: 'Rowenta R10', count: productsList.filter(p => p.category === 'rowenta').length },
                    { id: 'phu-kien', label: 'Phụ Kiện Lửa', count: productsList.filter(p => p.category === 'phu-kien').length },
                  ].map(cat => (
                    <li key={cat.id}>
                      <button 
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`filter-item-link ${selectedCategory === cat.id ? 'active' : ''}`}
                        style={{ border: 'none', width: '100%', background: 'transparent', cursor: 'pointer' }}
                      >
                        <span>{cat.label}</span>
                        <span className="filter-count">{cat.count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Filter Group */}
              <div className="filter-group">
                <h3 className="filter-group-title">Khoảng Giá</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { id: 'all', label: 'Tất cả mức giá' },
                    { id: 'under-5m', label: 'Dưới 5,000,000đ' },
                    { id: '5m-20m', label: '5,000,000đ - 20,000,000đ' },
                    { id: 'over-20m', label: 'Trên 20,000,000đ' },
                  ].map(p => (
                    <label key={p.id} className="price-checkbox-label">
                      <input 
                        type="radio" 
                        name="priceRange" 
                        value={p.id} 
                        checked={priceRange === p.id}
                        onChange={() => setPriceRange(p.id)}
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability Filter Group */}
              <div className="filter-group">
                <h3 className="filter-group-title">Tình Trạng</h3>
                <label className="price-checkbox-label">
                  <input type="checkbox" checked readOnly />
                  <span>Còn hàng tại Showroom</span>
                </label>
              </div>

            </aside>

            {/* Right Main Products Area */}
            <main className="products-main-content">
              
              {/* Top Bar Controls */}
              <div className="products-top-bar">
                <div className="products-result-count">
                  Hiển thị <strong>{filtered.length}</strong> trên <strong>{productsList.length}</strong> sản phẩm
                </div>

                <div className="products-controls-right">
                  {/* Search Filter Input */}
                  <div className="search-input-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input 
                      type="text" 
                      placeholder="Tìm tên sản phẩm..." 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  {/* Sort Selection */}
                  <select 
                    className="sort-select" 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="newest">Sắp xếp: Mới nhất</option>
                    <option value="price-asc">Giá: Thấp đến Cao</option>
                    <option value="price-desc">Giá: Cao đến Thấp</option>
                    <option value="name-asc">Tên: A - Z</option>
                  </select>
                </div>
              </div>

              {/* Product Grid */}
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.
                </div>
              ) : (
                <div className="products-grid">
                  {filtered.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </>
  );
}
