'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col-brand">
            <Link href="/" className="footer-logo">
              TIỆM <span>LỬA</span>
            </Link>
            <p className="footer-about">
              Thương hiệu chuyên cung cấp và chế tác các dòng bật lửa luxury cao cấp S.T. Dupont, Rowenta R10, Dupont Hồng Kông chính hãng. Tinh hoa chế tác, tiếng âm ngân vang khẳng định đẳng cấp quý ông.
            </p>
          </div>

          <div>
            <h4 className="footer-heading">Bộ Sưu Tập Hãng</h4>
            <ul className="footer-links">
              <li><Link href="/collections/st-dupont">S.T. Dupont France</Link></li>
              <li><Link href="/collections/dupont-hongkong">Dupont Hồng Kông</Link></li>
              <li><Link href="/collections/rowenta">Rowenta R10 Cổ Điển</Link></li>
              <li><Link href="/collections/phu-kien">Đá Lửa & Ga Chuyên Dụng</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Chăm Sóc Khách Hàng</h4>
            <ul className="footer-links">
              <li><Link href="/#">Chính Sách Bảo Hành Trọn Đời</Link></li>
              <li><Link href="/#">Hướng Dẫn Bơm Ga & Thay Đá</Link></li>
              <li><Link href="/#">Quy Trình Căn Chỉnh Âm Pinh</Link></li>
              <li><Link href="/#">Giao Hàng Miễn Phí Toàn Quốc</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Showroom & Liên Hệ</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: 8 }}>
              📍 Hớn Quản, Tây Bình Phước / Showroom Hồ Chí Minh
            </p>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: 8 }}>
              📞 Hotline VIP: 0888 368 726
            </p>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              🏦 Ngân hàng Agribank: 8888368726237 (LAI DAI VUONG)
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 TIỆM LỬA LUXURY LIGHTERS. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};
