'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  return (
    <div className="product-card">
      <span className="product-badge">{product.badge || 'Bán Chạy'}</span>
      
      <div className="product-img-wrapper">
        <Link href={`/products/${product.id}`}>
          <img src={product.img} alt={product.name} className="product-img" />
        </Link>
        <div className="product-quick-actions">
          <Link href={`/products/${product.id}`} className="quick-action-btn" title="Xem chi tiết">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </Link>
          <button 
            className={`quick-action-btn ${isInWishlist(product.id) ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            title="Thêm yêu thích"
            style={{ color: isInWishlist(product.id) ? '#ef4444' : 'inherit' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
        </div>
      </div>

      <div className="product-info">
        <span className="product-category">{product.categoryName}</span>
        <h3 className="product-title">
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="product-price-block">
          <span className="product-price">{product.price}</span>
        </div>
        <div className="product-action-buttons">
          <Link href={`/products/${product.id}`} className="btn-detail">Xem Chi Tiết</Link>
          <button 
            className="add-cart-btn" 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, 1);
            }}
          >
            Thêm Giỏ
          </button>
        </div>
      </div>
    </div>
  );
};
