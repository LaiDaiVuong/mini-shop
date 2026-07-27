'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatCurrencyVND } from '@/lib/products-data';
import { Order } from '@/lib/types';

export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCart } = useCart();

  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custCity, setCustCity] = useState('TP. Hồ Chí Minh');
  const [custDistrict, setCustDistrict] = useState('Quận 1');
  const [custAddress, setCustAddress] = useState('');
  const [custNote, setCustNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'cod'>('bank');

  const [orderCode, setOrderCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const rand = Math.floor(100000 + Math.random() * 900000);
    setOrderCode('TL' + rand);
  }, []);

  const handleCopySTK = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('8888368726237').then(() => {
      alert('Đã sao chép Số tài khoản: 8888368726237');
    }).catch(() => {
      alert('Số tài khoản Agribank: 8888368726237');
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone || !custAddress) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng!');
      return;
    }

    const newOrder: Order = {
      id: orderCode,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      customerInfo: {
        fullname: custName,
        phone: custPhone,
        city: custCity,
        district: custDistrict,
        address: custAddress,
        notes: custNote,
        paymentMethod: paymentMethod === 'bank' ? 'bank_transfer' : 'cod'
      },
      items: [...cart],
      subtotal: cartSubtotal,
      discount: 0,
      totalAmount: cartSubtotal,
      status: 'pending'
    };

    try {
      const local = localStorage.getItem('tiemlua_orders');
      const existing = local ? JSON.parse(local) : [];
      localStorage.setItem('tiemlua_orders', JSON.stringify([newOrder, ...existing]));
    } catch (err) {
      console.error(err);
    }

    setCompletedOrder(newOrder);
    setIsModalOpen(true);
    clearCart();
  };

  const accountNo = '8888368726237';
  const accountName = encodeURIComponent('LAI DAI VUONG');
  const addInfo = encodeURIComponent('TIEMLUA ' + (orderCode || 'TL888888'));
  const qrUrl = `https://img.vietqr.io/image/agribank-${accountNo}-compact2.png?amount=${cartSubtotal}&addInfo=${addInfo}&accountName=${accountName}`;

  return (
    <>
      {/* Page Banner Section */}
      <section className="page-banner">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Trang Chủ</Link>
            <span>&rsaquo;</span>
            <Link href="/cart">Giỏ Hàng</Link>
            <span>&rsaquo;</span>
            <span className="active-crumb">Thanh Toán & Đặt Hàng</span>
          </div>
        </div>
      </section>

      {/* Main Checkout Section */}
      <section className="checkout-section">
        <div className="container">
          {cart.length === 0 && !isModalOpen ? (
            <div style={{ textAlign: 'center', padding: '70px 20px', background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)', maxWidth: 650, margin: '0 auto' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" style={{ marginBottom: 16 }}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: 10, color: 'var(--color-text-main)' }}>GIỎ HÀNG CỦA BẠN ĐANG TRỐNG</h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 24, fontSize: '0.9rem' }}>Vui lòng chọn sản phẩm yêu thích vào giỏ hàng trước khi tiến hành thanh toán.</p>
              <Link href="/products" className="btn-checkout-primary" style={{ display: 'inline-block', padding: '14px 32px', textDecoration: 'none', width: 'auto' }}>KHÁM PHÁ SẢN PHẨM</Link>
            </div>
          ) : (
            <form id="checkoutForm" onSubmit={handleSubmit}>
              <div className="checkout-grid">
                
                {/* LEFT COLUMN: Customer Form & Payment Options */}
                <div className="checkout-left">
                  
                  {/* Box 1: Customer Info Form */}
                  <div className="checkout-box">
                    <h2 className="checkout-box-title">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      THÔNG TIN GIAO HÀNG
                    </h2>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">Họ và tên <span>*</span></label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Ví dụ: Nguyễn Văn A" 
                          value={custName}
                          onChange={(e) => setCustName(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Số điện thoại <span>*</span></label>
                        <input 
                          type="tel" 
                          className="form-input" 
                          placeholder="Ví dụ: 0988299999" 
                          value={custPhone}
                          onChange={(e) => setCustPhone(e.target.value)}
                          required 
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">Tỉnh / Thành phố <span>*</span></label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Ví dụ: TP. Hồ Chí Minh" 
                          value={custCity}
                          onChange={(e) => setCustCity(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Quận / Huyện <span>*</span></label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Ví dụ: Quận 1" 
                          value={custDistrict}
                          onChange={(e) => setCustDistrict(e.target.value)}
                          required 
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Địa chỉ chi tiết <span>*</span></label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Số nhà, tên đường, phường/xã..." 
                        value={custAddress}
                        onChange={(e) => setCustAddress(e.target.value)}
                        required 
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Ghi chú đơn hàng (Không bắt buộc)</label>
                      <textarea 
                        className="form-textarea" 
                        rows={3} 
                        placeholder="Ghi chú về thời gian giao hàng hoặc yêu cầu đóng hộp VIP..." 
                        value={custNote}
                        onChange={(e) => setCustNote(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Box 2: Payment Method Selection */}
                  <div className="checkout-box">
                    <h2 className="checkout-box-title">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                      PHƯƠNG THỨC THANH TOÁN
                    </h2>

                    <div className="payment-options">
                      
                      {/* Option 1: Bank Transfer (VietQR) */}
                      <label className={`payment-card ${paymentMethod === 'bank' ? 'selected' : ''}`} onClick={() => setPaymentMethod('bank')}>
                        <div className="payment-header">
                          <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="bank" 
                            checked={paymentMethod === 'bank'} 
                            onChange={() => setPaymentMethod('bank')} 
                          />
                          <span className="payment-title-text">Chuyển khoản Ngân hàng (Tạo Mã QR Tự Động)</span>
                        </div>

                        {paymentMethod === 'bank' && (
                          <div className="bank-details-box">
                            <div className="bank-info-list">
                              <div className="bank-info-item">
                                <span className="bank-info-label">Ngân hàng thụ hưởng</span>
                                <span className="bank-info-val" style={{ color: 'var(--color-accent)' }}>Agribank (NH Nông Nghiệp)</span>
                              </div>
                              <div className="bank-info-item">
                                <span className="bank-info-label">Chi nhánh mở</span>
                                <span className="bank-info-val">Agribank CN Hớn Quản Tây Bình Phước</span>
                              </div>
                              <div className="bank-info-item">
                                <span className="bank-info-label">Số tài khoản</span>
                                <span className="bank-info-val">
                                  <strong>8888368726237</strong>
                                  <button className="btn-copy-stk" onClick={handleCopySTK}>Sao chép</button>
                                </span>
                              </div>
                              <div className="bank-info-item">
                                <span className="bank-info-label">Chủ tài khoản</span>
                                <span className="bank-info-val">LAI DAI VUONG</span>
                              </div>
                              <div className="bank-info-item">
                                <span className="bank-info-label">Cú pháp chuyển khoản</span>
                                <span className="bank-info-val" style={{ color: '#d97706' }}>TIEMLUA {orderCode}</span>
                              </div>
                            </div>

                            {/* Dynamic VietQR Container */}
                            <div className="qr-container">
                              <img src={qrUrl} alt="Mã QR Chuyển khoản Agribank" />
                              <div className="qr-hint">Quét mã bằng App Ngân Hàng</div>
                            </div>
                          </div>
                        )}
                      </label>

                      {/* Option 2: Cash on Delivery (COD) */}
                      <label className={`payment-card ${paymentMethod === 'cod' ? 'selected' : ''}`} onClick={() => setPaymentMethod('cod')}>
                        <div className="payment-header">
                          <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="cod" 
                            checked={paymentMethod === 'cod'} 
                            onChange={() => setPaymentMethod('cod')} 
                          />
                          <span className="payment-title-text">Thanh toán tiền mặt khi nhận hàng (COD)</span>
                        </div>
                        {paymentMethod === 'cod' && (
                          <p style={{ marginTop: 10, fontSize: '0.825rem', color: 'var(--color-text-muted)', paddingLeft: 30 }}>
                            Quý khách sẽ thanh toán tiền mặt trực tiếp cho nhân viên giao hàng sau khi đã nhận và đồng kiểm sản phẩm.
                          </p>
                        )}
                      </label>

                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN: Order Summary & Confirmation Button */}
                <div className="checkout-right">
                  <div className="checkout-box" style={{ position: 'sticky', top: 100 }}>
                    <h2 className="checkout-box-title">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                      TÓM TẮT ĐƠN HÀNG
                    </h2>

                    <div>
                      {cart.map(item => {
                        const itemTotal = item.priceNum * item.quantity;
                        return (
                          <div key={item.id} className="summary-item-row">
                            <img src={item.img} alt={item.name} className="summary-item-img" />
                            <div style={{ flex: 1 }}>
                              <div className="summary-item-title">{item.name}</div>
                              <div className="summary-item-qty">Số lượng: {item.quantity}</div>
                            </div>
                            <div className="summary-item-total">{formatCurrencyVND(itemTotal)}</div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="summary-divider" style={{ height: 1, background: 'var(--color-border)', margin: '20px 0' }}></div>

                    <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Tạm tính:</span>
                      <strong>{formatCurrencyVND(cartSubtotal)}</strong>
                    </div>

                    <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Phí vận chuyển:</span>
                      <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Miễn phí toàn quốc</span>
                    </div>

                    <div className="summary-divider" style={{ height: 1, background: 'var(--color-border)', margin: '20px 0' }}></div>

                    <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <span style={{ fontWeight: 700, letterSpacing: 0.5 }}>TỔNG THANH TOÁN:</span>
                      <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-accent)' }}>
                        {formatCurrencyVND(cartSubtotal)}
                      </strong>
                    </div>

                    <button 
                      type="submit" 
                      className="btn-checkout-primary" 
                      style={{ width: '100%', padding: 16, fontSize: '0.875rem', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', background: 'var(--color-accent)', border: 'none', borderRadius: 'var(--radius-sm)', color: '#fff', cursor: 'pointer' }}
                    >
                      XÁC NHẬN ĐẶT HÀNG
                    </button>

                    <div style={{ marginTop: 16, textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      Bằng việc bấm đặt hàng, bạn đồng ý với điều khoản dịch vụ Tiệm Lửa.
                    </div>
                  </div>
                </div>

              </div>
            </form>
          )}
        </div>
      </section>

      {/* SUCCESS ORDER CONFIRMATION MODAL */}
      <div className={`order-modal-overlay ${isModalOpen ? 'open' : ''}`}>
        <div className="order-modal-card">
          <div className="success-badge-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>

          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: 8, letterSpacing: 1 }}>
            ĐẶT HÀNG THÀNH CÔNG!
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 20 }}>
            Cảm ơn bạn đã lựa chọn tuyệt tác tại <strong>Tiệm Lửa</strong>. Mã đơn hàng của bạn là:
          </p>

          <div style={{ background: '#f8fafc', border: '1px dashed var(--color-accent)', padding: 12, borderRadius: 6, marginBottom: 20 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>MÃ ĐƠN HÀNG:</span>
            <strong style={{ fontSize: '1.2rem', color: 'var(--color-accent)', marginLeft: 8 }}>{orderCode}</strong>
          </div>

          <div style={{ textAlign: 'left', background: '#f8fafc', border: '1px solid var(--color-border)', padding: 16, borderRadius: 6, marginBottom: 24, fontSize: '0.85rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--color-text-main)', marginBottom: 6 }}>Thông tin giao hàng:</div>
            <div>• Người nhận: <strong>{custName}</strong> ({custPhone})</div>
            <div>• Địa chỉ: <strong>{custAddress}, {custDistrict}, {custCity}</strong></div>
            <div>• Hình thức: <strong>{paymentMethod === 'bank' ? 'Chuyển khoản Agribank (STK: 8888368726237)' : 'Thanh toán tiền mặt COD'}</strong></div>
            <div>• Tổng tiền: <strong style={{ color: 'var(--color-accent)' }}>{formatCurrencyVND(completedOrder?.totalAmount || cartSubtotal)}</strong></div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/" className="btn-detail" style={{ flex: 1, padding: 14, textAlign: 'center' }}>VỀ TRANG CHỦ</Link>
            <Link href="/products" className="add-cart-btn" style={{ flex: 1, padding: 14, textAlign: 'center' }}>TIẾP TỤC MUA SẮM</Link>
          </div>
        </div>
      </div>
    </>
  );
}
