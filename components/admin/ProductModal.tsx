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
  const [category, setCategory] = useState('st-dupont');
  const [priceNum, setPriceNum] = useState<number>(0);
  const [img, setImg] = useState('');
  const [badge, setBadge] = useState('Mới');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setCategory(product.category || 'st-dupont');
      setPriceNum(product.priceNum || 0);
      setImg(product.img || '');
      setBadge(product.badge || 'Mới');
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
    if (!name || priceNum <= 0) {
      alert('Vui lòng nhập tên sản phẩm và giá bán hợp lệ!');
      return;
    }

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
      badge: badge || 'Mới',
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
        const rawDataUrl = event.target?.result as string;
        if (!rawDataUrl) return;

        // Auto compress image using Canvas to 600px max dimension
        const imgObj = new Image();
        imgObj.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 600;
          let width = imgObj.width;
          let height = imgObj.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(imgObj, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
            setImg(compressedBase64);
          } else {
            setImg(rawDataUrl);
          }
        };
        imgObj.src = rawDataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}
    >
      <div 
        style={{
          background: '#ffffff',
          borderRadius: 20,
          maxWidth: 920,
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
          border: '1px solid #e2e8f0',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Top Header Banner (#0F172A Navy Theme) */}
        <div 
          style={{
            background: '#0F172A',
            color: '#ffffff',
            padding: '20px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid #C89B3C'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.4rem' }}>{product ? '⚡' : '✨'}</span>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: 1 }}>
                {product ? 'CHỈNH SỬA & TÙY CHỈNH SẢN PHẨM' : 'THÊM SẢN PHẨM MỚI VÀO KHO'}
              </h2>
              <div style={{ fontSize: '0.775rem', color: '#C89B3C', marginTop: 2 }}>Trạm quản lý sản phẩm thương mại điện tử Tiệm Lửa</div>
            </div>
          </div>

          <button 
            type="button" 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#ffffff',
              width: 36,
              height: 36,
              borderRadius: '50%',
              fontSize: '1.4rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            &times;
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} style={{ padding: 28 }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 28 }}>
            
            {/* LEFT COLUMN: LIVE CARD PREVIEW & IMAGE SELECTION */}
            <div style={{ background: '#f8fafc', padding: 22, borderRadius: 16, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C89B3C', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 }}>
                  👁️ XEM TRƯỚC HIỂN THỊ THỰC TẾ
                </div>

                {/* Product Card Preview Container */}
                <div style={{ background: '#ffffff', borderRadius: 14, padding: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', position: 'relative', textAlign: 'center' }}>
                  
                  {/* Badge Tag */}
                  <span 
                    style={{
                      position: 'absolute',
                      top: 14,
                      left: 14,
                      zIndex: 2,
                      padding: '4px 10px',
                      borderRadius: 20,
                      fontSize: '0.725rem',
                      fontWeight: 800,
                      background: '#fffbeb',
                      color: '#C89B3C',
                      border: '1px solid #fde68a'
                    }}
                  >
                    ✨ {badge || 'Mới'}
                  </span>

                  {/* Image */}
                  <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, overflow: 'hidden' }}>
                    <img 
                      src={img || '/assets/img/products/S.T Dupont/Lacquered lighter cohiba 60 black.webp'} 
                      alt="Preview" 
                      style={{ maxHeight: 180, maxWidth: '100%', objectFit: 'contain' }}
                    />
                  </div>

                  {/* Name */}
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', marginBottom: 6, lineHeight: 1.4 }}>
                    {name || 'Tên sản phẩm bật lửa'}
                  </div>

                  {/* Price */}
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 800, color: '#C89B3C' }}>
                    {formatCurrencyVND(priceNum || 0)}
                  </div>

                </div>
              </div>

              {/* Sample Preset Images */}
              <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: 16, marginTop: 20 }}>
                <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#475569', marginBottom: 8 }}>
                  📸 Chọn nhanh mẫu ảnh đại diện:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  <button 
                    type="button" 
                    onClick={() => setImg('/assets/img/products/S.T Dupont/Lacquered lighter cohiba 60 black.webp')}
                    style={{ padding: '5px 10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    S.T. Cohiba
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setImg('/assets/img/products/S.T Dupont/Micro Diamond head lighter.webp')}
                    style={{ padding: '5px 10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    S.T. Diamond
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setImg('/assets/img/products/Dupont HongKong/Silver and Gold Lighter.webp')}
                    style={{ padding: '5px 10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Dupont HK
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setImg('/assets/img/products/Rowenta R10/Kim cương vàng.webp')}
                    style={{ padding: '5px 10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Rowenta R10
                  </button>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: FORM INPUT FIELDS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              
              {/* Field 1: Name */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Tên sản phẩm <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Ví dụ: Bật Lửa S.T. Dupont Cohiba 60th Anniversary" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  required 
                  style={{ width: '100%', boxSizing: 'border-box', height: 44, padding: '0 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem', color: '#0F172A' }}
                />
              </div>

              {/* Field 2: Category */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Danh mục sản phẩm <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  style={{ width: '100%', boxSizing: 'border-box', height: 44, padding: '0 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem', color: '#0F172A', cursor: 'pointer', fontWeight: 600 }}
                >
                  <option value="st-dupont">S.T. Dupont France</option>
                  <option value="dupont-hk">Dupont Hongkong</option>
                  <option value="rowenta">Rowenta R10 Đức</option>
                  <option value="phu-kien">Phụ Kiện Lửa</option>
                </select>
              </div>

              {/* Field 3: Price */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Giá bán (VNĐ) <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input 
                  type="number" 
                  placeholder="Nhập giá bán (VNĐ)..." 
                  value={priceNum || ''} 
                  onChange={(e) => setPriceNum(Number(e.target.value))}
                  required 
                  style={{ width: '100%', boxSizing: 'border-box', height: 44, padding: '0 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem', color: '#0F172A', fontWeight: 700 }}
                />
                
                {/* Price Quick Add Buttons */}
                <div style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 600 }}>Cộng nhanh:</span>
                  <button type="button" onClick={() => setPriceNum(prev => prev + 1000000)} style={{ padding: '3px 8px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: '0.725rem', fontWeight: 700, cursor: 'pointer' }}>+1 Tr</button>
                  <button type="button" onClick={() => setPriceNum(prev => prev + 5000000)} style={{ padding: '3px 8px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: '0.725rem', fontWeight: 700, cursor: 'pointer' }}>+5 Tr</button>
                  <button type="button" onClick={() => setPriceNum(prev => prev + 10000000)} style={{ padding: '3px 8px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: '0.725rem', fontWeight: 700, cursor: 'pointer' }}>+10 Tr</button>
                </div>
              </div>

              {/* Field 4: Image File Upload or URL */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Hình ảnh sản phẩm <span style={{ color: '#EF4444' }}>*</span>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 44, background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 8, cursor: 'pointer', marginBottom: 8 }}>
                  <span style={{ fontSize: '1rem' }}>📁</span>
                  <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#475569' }}>Tải ảnh từ máy tính</span>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
                </label>

                <input 
                  type="text" 
                  placeholder="Hoặc dán đường dẫn ảnh: /assets/img/products/..." 
                  value={img} 
                  onChange={(e) => setImg(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', height: 40, padding: '0 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.825rem', color: '#0F172A' }}
                />
              </div>

              {/* Field 5: Badge */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Nhãn nổi bật (Badge)
                </label>
                <input 
                  type="text" 
                  placeholder="Ví dụ: Bán Chạy, Mới, Giới Hạn..." 
                  value={badge} 
                  onChange={(e) => setBadge(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', height: 44, padding: '0 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.9rem', color: '#0F172A' }}
                />
                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  <button type="button" onClick={() => setBadge('Bán Chạy')} style={{ padding: '3px 8px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 4, fontSize: '0.725rem', fontWeight: 700, color: '#C89B3C', cursor: 'pointer' }}>🔥 Bán Chạy</button>
                  <button type="button" onClick={() => setBadge('Mới')} style={{ padding: '3px 8px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 4, fontSize: '0.725rem', fontWeight: 700, color: '#10B981', cursor: 'pointer' }}>✨ Mới</button>
                  <button type="button" onClick={() => setBadge('Giới Hạn')} style={{ padding: '3px 8px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 4, fontSize: '0.725rem', fontWeight: 700, color: '#EF4444', cursor: 'pointer' }}>👑 Giới Hạn</button>
                </div>
              </div>

              {/* Field 6: Description */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Mô tả sản phẩm
                </label>
                <textarea 
                  rows={3} 
                  placeholder="Nhập chi tiết về kiểu dáng, âm Pinh, xuất xứ..." 
                  value={desc} 
                  onChange={(e) => setDesc(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: 12, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', color: '#0F172A', fontFamily: 'inherit' }}
                />
              </div>

            </div>

          </div>

          {/* Action Buttons Footer */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 20, borderTop: '1px solid #e2e8f0', marginTop: 24 }}>
            <button 
              type="button" 
              onClick={onClose} 
              style={{ padding: '11px 22px', border: '1px solid #cbd5e1', background: '#ffffff', borderRadius: 8, fontWeight: 700, color: '#64748b', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Hủy Bỏ
            </button>
            <button 
              type="submit" 
              style={{ 
                padding: '11px 32px', 
                background: 'linear-gradient(135deg, #C89B3C 0%, #a67c2e 100%)', 
                border: 'none', 
                color: '#ffffff', 
                borderRadius: 8, 
                fontWeight: 800, 
                fontSize: '0.85rem', 
                boxShadow: '0 4px 18px rgba(200, 155, 60, 0.4)',
                cursor: 'pointer' 
              }}
            >
              💾 LƯU SẢN PHẨM VÀO KHO
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
