'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatCurrencyVND } from '@/lib/products-data';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartSubtotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setCouponMessage(`Mã ưu đãi "${couponCode.trim()}" đã được ghi nhận!`);
    } else {
      setCouponMessage('Vui lòng nhập mã giảm giá.');
    }
  };

  return (
    <>
      {/* Page Banner Section */}
      <section className="page-banner">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Trang Chủ</Link>
            <span>&rsaquo;</span>
            <span className="active-crumb">Giỏ Hàng Của Bạn</span>
          </div>
        </div>
      </section>

      {/* Cart Page Section */}
      <section className="cart-page-section">
        <div className="container">
          <div id="cartContentWrapper">
            {cart.length === 0 ? (
              <div className="cart-empty-box">
                <div className="empty-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                </div>
                <h2 className="empty-title">GIỎ HÀNG CỦA BẠN ĐANG TRỐNG</h2>
                <p className="empty-desc">Chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá bộ sưu tập bật lửa thượng lưu tại Tiệm Lửa!</p>
                <Link href="/products" className="btn-browse-products">KHÁM PHÁ SẢN PHẨM NGAY</Link>
              </div>
            ) : (
              <div className="cart-layout">
                {/* Left: Cart Items List */}
                <div className="cart-main-column">
                  <div className="cart-table-header">
                    <div className="th-prod">SẢN PHẨM</div>
                    <div className="th-price">ĐƠN GIÁ</div>
                    <div className="th-qty">SỐ LƯỢNG</div>
                    <div className="th-total">THÀNH TIỀN</div>
                    <div className="th-action"></div>
                  </div>

                  <div className="cart-items-list">
                    {cart.map(item => {
                      const itemTotal = item.priceNum * item.quantity;
                      return (
                        <div key={item.id} className="cart-item-row" data-id={item.id}>
                          <div className="cart-item-info">
                            <img src={item.img} alt={item.name} className="cart-item-img" />
                            <div className="cart-item-details">
                              <span className="cart-item-cat">{item.categoryName || 'Bật Lửa Luxury'}</span>
                              <h3 className="cart-item-title">
                                <Link href={`/products/${item.id}`}>{item.name}</Link>
                              </h3>
                              <span className="cart-item-unit-price-mobile">{formatCurrencyVND(item.priceNum)}</span>
                            </div>
                          </div>

                          <div className="cart-item-price">{formatCurrencyVND(item.priceNum)}</div>

                          <div className="cart-item-quantity">
                            <div className="quantity-control">
                              <button className="qty-btn qty-minus-btn" onClick={() => updateQuantity(item.id, -1)}>-</button>
                              <input type="number" className="qty-input-field" value={item.quantity} readOnly />
                              <button className="qty-btn qty-plus-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                            </div>
                          </div>

                          <div className="cart-item-subtotal">{formatCurrencyVND(itemTotal)}</div>

                          <div className="cart-item-remove">
                            <button className="remove-btn" onClick={() => removeFromCart(item.id)} title="Xóa khỏi giỏ hàng">&times;</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="cart-actions-bar">
                    <Link href="/products" className="btn-continue-shopping">&larr; tiếp tục mua sắm</Link>
                    <button className="btn-clear-cart" onClick={() => {
                      if (confirm('Bạn có chắc chắn muốn xóa toàn bộ sản phẩm trong giỏ hàng?')) {
                        clearCart();
                      }
                    }}>Xóa Tất Cả</button>
                  </div>
                </div>

                {/* Right: Order Summary */}
                <div className="cart-summary-column">
                  <div className="summary-card">
                    <h3 className="summary-title">TỔNG ĐƠN HÀNG</h3>
                    <div className="summary-divider"></div>

                    <div className="summary-row">
                      <span>Tạm tính</span>
                      <strong id="summarySubtotal">{formatCurrencyVND(cartSubtotal)}</strong>
                    </div>

                    <div className="summary-row">
                      <span>Phí vận chuyển</span>
                      <span className="free-ship-tag">Miễn phí toàn quốc</span>
                    </div>

                    <div className="coupon-box">
                      <input 
                        type="text" 
                        placeholder="Nhập mã giảm giá VIP..." 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="coupon-input" 
                      />
                      <button className="btn-apply-coupon" onClick={handleApplyCoupon}>Áp Dụng</button>
                    </div>
                    {couponMessage && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-accent)', marginTop: 6, fontWeight: 600 }}>
                        {couponMessage}
                      </div>
                    )}

                    <div className="summary-divider"></div>

                    <div className="summary-row summary-total-row">
                      <span>TỔNG CỘNG</span>
                      <strong className="summary-total-price" id="summaryTotal">{formatCurrencyVND(cartSubtotal)}</strong>
                    </div>

                    <Link href="/checkout" className="btn-checkout-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                      TIẾN HÀNH THANH TOÁN
                    </Link>

                    <div className="cart-support-box">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                      <div>
                        <strong>Cần hỗ trợ thanh toán?</strong>
                        <p>Hotline tư vấn VIP: 0888.368.726 (8h00 - 22h00)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
