'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import { formatCurrencyVND } from '@/lib/products-data';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  product
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [priceNum, setPriceNum] = useState<number>(0);
  const [img, setImg] = useState('');
  const [badge, setBadge] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setCategory(product.category || 'st-dupont');
      setPriceNum(product.priceNum || 0);
      setImg(product.img || '');
      setBadge(product.badge || '');
      setDesc(product.desc || '');
    } else {
      setName('');
      setCategory('st-dupont');
      setPriceNum(0);
      setImg('/assets/img/products/S.T Dupont/Lacquered lighter cohiba 60 black.webp');
      setBadge('Mới');
      setDesc('');
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryNameMap: Record<string, string> = {
      'st-dupont': 'S.T. Dupont France',
      'dupont-hk': 'Dupont Hongkong',
      'dupont-hongkong': 'Dupont Hongkong',
      'rowenta': 'Rowenta R10',
      'phu-kien': 'Phụ Kiện Lửa'
    };

    const savedProduct: Product = {
      id: product?.id || 'prod-' + Date.now(),
      name,
      category,
      categoryName: categoryNameMap[category] || 'Bật Lửa Luxury',
      price: formatCurrencyVND(priceNum),
      priceNum,
      badge: badge || 'Luxury',
      img: img || '/assets/img/products/S.T Dupont/Lacquered lighter cohiba 60 black.webp',
      desc,
      specs: product?.specs || {
        brand: categoryNameMap[category] || 'Luxury Lighters',
        model: name,
        material: 'Đồng thau mạ cao cấp',
        origin: 'Chính hãng',
        warranty: 'Bảo hành 24 tháng'
      }
    };

    onSave(savedProduct);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImg(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`admin-modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="admin-modal-card">
        {/* Top Banner Header */}
        <div className="modal-banner-header">
          <div className="modal-banner-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            <span>{product ? 'CHỈNH SỬA & TÙY CHỈNH SẢN PHẨM' : 'THÊM SẢN PHẨM MỚI'}</span>
          </div>
          <button className="btn-close-modal" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="product-modal-grid-2">
            {/* LEFT COLUMN: LIVE CARD PREVIEW */}
            <div className="live-preview-box">
              <div className="live-preview-title-label">👁️ HIỂN THỊ THỰC TẾ</div>
              
              <div className="live-preview-img-wrapper">
                <span className="badge-tag badge-gold" style={{ position: 'absolute', top: 10, left: 10, zIndex: 2 }}>
                  {badge || 'Mới'}
                </span>
                <img src={img || '/assets/img/products/S.T Dupont/Lacquered lighter cohiba 60 black.webp'} className="live-preview-img" alt="Preview" />
              </div>

              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-main)', marginBottom: 6, lineHeight: 1.3 }}>
                {name || 'Tên Sản Phẩm Bật Lửa'}
              </div>

              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-accent)', marginBottom: 14 }}>
                {formatCurrencyVND(priceNum || 0)}
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'left', borderTop: '1px solid #cbd5e1', paddingTop: 12 }}>
                <strong>Gợi ý chọn nhanh ảnh mẫu:</strong>
                <div className="preset-img-chips">
                  <button type="button" className="chip-btn" onClick={() => setImg('/assets/img/products/S.T Dupont/Lacquered lighter cohiba 60 black.webp')}>Cohiba</button>
                  <button type="button" className="chip-btn" onClick={() => setImg('/assets/img/products/S.T Dupont/Micro Diamond head lighter.webp')}>Micro Diamond</button>
                  <button type="button" className="chip-btn" onClick={() => setImg('/assets/img/products/Dupont HongKong/Silver and Gold Lighter.webp')}>Dupont HK</button>
                  <button type="button" className="chip-btn" onClick={() => setImg('/assets/img/products/Rowenta R10/Kim cương vàng.webp')}>Rowenta</button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: FULL-WIDTH FORM INPUTS */}
            <div>
              {/* Field 1: Name */}
              <div className="clean-form-group">
                <label className="clean-form-label">Tên sản phẩm <span>*</span></label>
                <input 
                  type="text" 
                  className="clean-form-input" 
                  placeholder="Nhập tên sản phẩm..." 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>

              {/* Field 2: Category */}
              <div className="clean-form-group">
                <label className="clean-form-label">Danh mục sản phẩm <span>*</span></label>
                <select 
                  className="clean-form-select" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="st-dupont">S.T. Dupont France</option>
                  <option value="dupont-hk">Dupont Hongkong</option>
                  <option value="rowenta">Rowenta R10</option>
                  <option value="phu-kien">Phụ Kiện Lửa</option>
                </select>
              </div>

              {/* Field 3: Price */}
              <div className="clean-form-group">
                <label className="clean-form-label">Giá bán (VND) <span>*</span></label>
                <input 
                  type="number" 
                  className="clean-form-input" 
                  placeholder="Nhập giá bán (VND)..." 
                  value={priceNum || ''} 
                  onChange={(e) => setPriceNum(Number(e.target.value))}
                  required 
                />
                <div className="quick-chips-row" style={{ marginTop: 6 }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Cộng nhanh:</span>
                  <button type="button" className="price-chip-btn" onClick={() => setPriceNum(prev => prev + 1000000)}>+1 Tr</button>
                  <button type="button" className="price-chip-btn" onClick={() => setPriceNum(prev => prev + 5000000)}>+5 Tr</button>
                  <button type="button" className="price-chip-btn" onClick={() => setPriceNum(prev => prev + 10000000)}>+10 Tr</button>
                </div>
              </div>

              {/* Field 4: Image */}
              <div className="clean-form-group">
                <label className="clean-form-label">Hình ảnh sản phẩm <span>*</span></label>
                <label className="upload-image-box" style={{ cursor: 'pointer' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  <span style={{ fontSize: '0.925rem', fontWeight: 600, color: '#334155' }}>Nhấp để tải ảnh lên từ máy tính</span>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
                </label>
                
                <input 
                  type="text" 
                  className="clean-form-input" 
                  placeholder="Hoặc nhập đường dẫn ảnh: /assets/img/products/..." 
                  value={img} 
                  onChange={(e) => setImg(e.target.value)}
                  style={{ marginTop: 10 }}
                />
              </div>

              {/* Field 5: Badge Tag */}
              <div className="clean-form-group">
                <label className="clean-form-label">Nhãn nổi bật (Badge Tag)</label>
                <input 
                  type="text" 
                  className="clean-form-input" 
                  placeholder="Nhập nhãn nổi bật (vd: Bán Chạy, Mới)..." 
                  value={badge} 
                  onChange={(e) => setBadge(e.target.value)}
                />
                <div className="quick-chips-row" style={{ marginTop: 6 }}>
                  <button type="button" className="badge-chip-btn" onClick={() => setBadge('Bán Chạy')}>🔥 Bán Chạy</button>
                  <button type="button" className="badge-chip-btn" onClick={() => setBadge('Mới Nổi Bật')}>✨ Mới</button>
                  <button type="button" className="badge-chip-btn" onClick={() => setBadge('Phiên Bản Giới Hạn')}>👑 Giới Hạn</button>
                  <button type="button" className="badge-chip-btn" onClick={() => setBadge('Phụ Kiện VIP')}>🛠️ Phụ Kiện</button>
                </div>
              </div>

              {/* Field 6: Description */}
              <div className="clean-form-group" style={{ marginBottom: 0 }}>
                <label className="clean-form-label">Mô tả sản phẩm</label>
                <textarea 
                  className="clean-form-textarea" 
                  rows={3} 
                  placeholder="Nhập chi tiết về chất liệu, đặc tính âm thanh pinh..." 
                  value={desc} 
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'flex-end', paddingTop: 18, borderTop: '1px solid #e2e8f0', marginTop: 20 }}>
            <button type="button" onClick={onClose} style={{ padding: '12px 24px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 8, fontWeight: 700, color: '#64748b' }}>
              Hủy Bỏ
            </button>
            <button type="submit" style={{ padding: '12px 32px', background: 'linear-gradient(135deg, var(--color-accent) 0%, #b08b43 100%)', border: 'none', color: '#fff', borderRadius: 8, fontWeight: 800, boxShadow: '0 4px 18px rgba(197, 160, 89, 0.4)' }}>
              💾 LƯU SẢN PHẨM
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
