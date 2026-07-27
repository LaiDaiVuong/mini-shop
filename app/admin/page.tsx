'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, Order } from '@/lib/types';
import { INITIAL_PRODUCTS_DATA, formatCurrencyVND } from '@/lib/products-data';
import { RevenueGrowthChart } from '@/components/admin/RevenueGrowthChart';
import { OrderStatusDonutChart } from '@/components/admin/OrderStatusDonutChart';
import { ProductModal } from '@/components/admin/ProductModal';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users'>('overview');
  
  // Data States
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS_DATA);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchProd, setSearchProd] = useState('');
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Load products from localStorage or default
    try {
      const localProds = localStorage.getItem('tiemlua_admin_products');
      if (localProds) {
        setProducts(JSON.parse(localProds));
      }
    } catch (e) {
      console.error(e);
    }

    // Load orders from localStorage or mock
    try {
      const localOrders = localStorage.getItem('tiemlua_orders');
      if (localOrders) {
        setOrders(JSON.parse(localOrders));
      } else {
        const mockOrders: Order[] = [
          {
            id: 'TL882910',
            createdAt: '2026-07-27 14:30',
            customerInfo: {
              fullname: 'Nguyễn Văn Hùng',
              phone: '0988 299 999',
              email: 'hung.nguyen@gmail.com',
              city: 'TP. Hồ Chí Minh',
              district: 'Quận 1',
              address: '124 Nguyễn Huệ, Phường Bến Nghé',
              notes: 'Giao giờ hành chính, đóng hộp quà VIP',
              paymentMethod: 'bank_transfer'
            },
            items: [
              { id: 'st-cohiba-60', name: 'Bật Lửa S.T. Dupont Cohiba 60th Anniversary Black Lacquer', priceNum: 29000000, quantity: 1, img: '/assets/img/products/S.T Dupont/Lacquered lighter cohiba 60 black.webp' }
            ],
            subtotal: 29000000,
            discount: 0,
            totalAmount: 29000000,
            status: 'confirmed'
          },
          {
            id: 'TL771204',
            createdAt: '2026-07-27 11:15',
            customerInfo: {
              fullname: 'Trần Thị Minh Anh',
              phone: '0912 345 678',
              email: 'minhanh.tran@yahoo.com',
              city: 'Hà Nội',
              district: 'Hoàn Kiếm',
              address: '45 Tràng Tiền',
              paymentMethod: 'cod'
            },
            items: [
              { id: 'st-guilloche-gold', name: 'Bật Lửa S.T. Dupont Ligne 2 Guilloche Mạ Vàng 24K', priceNum: 18500000, quantity: 1, img: '/assets/img/products/S.T Dupont/Micro Diamond head lighter.webp' }
            ],
            subtotal: 18500000,
            discount: 0,
            totalAmount: 18500000,
            status: 'shipping'
          },
          {
            id: 'TL663912',
            createdAt: '2026-07-26 16:45',
            customerInfo: {
              fullname: 'Lê Hoàng Nam',
              phone: '0977 123 999',
              city: 'Bình Dương',
              district: 'Thủ Dầu Một',
              address: '88 Đại Lộ Bình Dương',
              paymentMethod: 'bank_transfer'
            },
            items: [
              { id: 'hk-bac-xuoc-gold', name: 'Bật Lửa Dupont Hongkong Bạc Xước Viền Vàng Chuẩn Âm Thanh', priceNum: 2800000, quantity: 2, img: '/assets/img/products/Dupont HongKong/Bạc xước viền vàng.webp' }
            ],
            subtotal: 5600000,
            discount: 0,
            totalAmount: 5600000,
            status: 'completed'
          }
        ];
        setOrders(mockOrders);
        localStorage.setItem('tiemlua_orders', JSON.stringify(mockOrders));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save products to local
  const handleSaveProduct = (prod: Product) => {
    let updated: Product[];
    if (editingProduct) {
      updated = products.map(p => p.id === prod.id ? prod : p);
    } else {
      updated = [prod, ...products];
    }
    setProducts(updated);
    localStorage.setItem('tiemlua_admin_products', JSON.stringify(updated));
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống?')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem('tiemlua_admin_products', JSON.stringify(updated));
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updated = orders.map(ord => ord.id === orderId ? { ...ord, status: newStatus } : ord);
    setOrders(updated);
    localStorage.setItem('tiemlua_orders', JSON.stringify(updated));
  };

  // KPI Computations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const activeCount = orders.filter(o => o.status === 'confirmed' || o.status === 'shipping').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchProd.toLowerCase()));
  const filteredOrders = orderFilterStatus === 'all' ? orders : orders.filter(o => o.status === orderFilterStatus);

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh', paddingBottom: 60 }}>
      {/* Top Admin Header Bar */}
      <div style={{ background: '#0f172a', color: '#fff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--color-accent)', color: '#fff', fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ⚡
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: 1.5 }}>TIỆM LỬA ADMIN</div>
            <div style={{ fontSize: '0.725rem', color: 'var(--color-accent)' }}>HỆ THỐNG QUẢN TRỊ VIÊN CỬA HÀNG</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link href="/" style={{ color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 600, border: '1px solid #334155', padding: '6px 14px', borderRadius: 20 }}>
            &larr; Xem Cửa Hàng
          </Link>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-accent)' }}>
            👑 Lại Đại Vương
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 30 }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 28, background: '#fff', padding: 8, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          {[
            { id: 'overview', label: '📊 Tổng Quan Hệ Thống' },
            { id: 'products', label: '📦 Quản Lý Sản Phẩm' },
            { id: 'orders', label: '🛒 Quản Lý Đơn Hàng' },
            { id: 'users', label: '👥 Quản Lý Khách Hàng' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 8,
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                background: activeTab === tab.id ? 'var(--color-accent)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#64748b',
                boxShadow: activeTab === tab.id ? '0 4px 15px rgba(197, 160, 89, 0.35)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            {/* 4 KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20, marginBottom: 28 }}>
              <div style={{ background: '#fff', padding: 20, borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>TỔNG DOANH THU</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-accent)', margin: '4px 0' }}>{formatCurrencyVND(totalRevenue)}</div>
                <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>▲ +18.5% so với tháng trước</div>
              </div>

              <div style={{ background: '#fff', padding: 20, borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>TỔNG ĐƠN HÀNG</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>{orders.length} Đơn</div>
                <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>{pendingCount} đơn chờ xử lý</div>
              </div>

              <div style={{ background: '#fff', padding: 20, borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>SẢN PHẨM NIÊM YẾT</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>{products.length}</div>
                <div style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 700 }}>Đang hoạt động trên cửa hàng</div>
              </div>

              <div style={{ background: '#fff', padding: 20, borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>KHÁCH HÀNG VIP</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>5</div>
                <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>▲ +4 Khách mới tháng này</div>
              </div>
            </div>

            {/* SVG Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, marginBottom: 32 }}>
              <RevenueGrowthChart totalRevenue={totalRevenue} />
              <OrderStatusDonutChart 
                pendingCount={pendingCount}
                activeCount={activeCount}
                completedCount={completedCount}
                totalOrders={orders.length}
              />
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Danh Sách Sản Phẩm</h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Quản lý niêm yết & tùy chỉnh thông tin sản phẩm</p>
              </div>

              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Tìm sản phẩm..." 
                  value={searchProd}
                  onChange={(e) => setSearchProd(e.target.value)}
                  style={{ padding: '8px 14px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.875rem', width: 220 }}
                />

                <button 
                  onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
                  style={{ padding: '10px 20px', background: 'linear-gradient(135deg, var(--color-accent) 0%, #b08b43 100%)', color: '#fff', borderRadius: 8, fontWeight: 800, fontSize: '0.875rem' }}
                >
                  + THÊM SẢN PHẨM MỚI
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: 12 }}>Hình ảnh</th>
                    <th style={{ padding: 12 }}>Tên sản phẩm</th>
                    <th style={{ padding: 12 }}>Danh mục</th>
                    <th style={{ padding: 12 }}>Giá bán</th>
                    <th style={{ padding: 12 }}>Nhãn Badge</th>
                    <th style={{ padding: 12, textAlign: 'right' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: 12 }}>
                        <img src={p.img} alt={p.name} style={{ width: 44, height: 44, objectFit: 'contain', background: '#fafafa', border: '1px solid #e2e8f0', borderRadius: 6 }} />
                      </td>
                      <td style={{ padding: 12, fontWeight: 700, color: '#0f172a' }}>{p.name}</td>
                      <td style={{ padding: 12, color: '#64748b' }}>{p.categoryName}</td>
                      <td style={{ padding: 12, fontWeight: 800, color: 'var(--color-accent)' }}>{p.price}</td>
                      <td style={{ padding: 12 }}>
                        <span className="badge-tag badge-gold" style={{ fontSize: '0.75rem' }}>{p.badge || 'Luxury'}</span>
                      </td>
                      <td style={{ padding: 12, textAlign: 'right' }}>
                        <button 
                          onClick={() => { setEditingProduct(p); setIsModalOpen(true); }}
                          style={{ padding: '6px 12px', background: '#3b82f6', color: '#fff', borderRadius: 6, fontWeight: 700, fontSize: '0.775rem', marginRight: 8 }}
                        >
                          ⚡ Sửa
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(p.id)}
                          style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', borderRadius: 6, fontWeight: 700, fontSize: '0.775rem' }}
                        >
                          🗑️ Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === 'orders' && (
          <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Quản Lý Đơn Hàng</h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Cập nhật trạng thái giao nhận đơn hàng</p>
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'pending', label: 'Chờ xử lý' },
                  { id: 'confirmed', label: 'Đã xác nhận' },
                  { id: 'shipping', label: 'Đang giao' },
                  { id: 'completed', label: 'Hoàn thành' }
                ].map(st => (
                  <button
                    key={st.id}
                    onClick={() => setOrderFilterStatus(st.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 20,
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: orderFilterStatus === st.id ? '#0f172a' : '#f1f5f9',
                      color: orderFilterStatus === st.id ? '#fff' : '#64748b'
                    }}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: 12 }}>Mã Đơn</th>
                    <th style={{ padding: 12 }}>Khách Hàng</th>
                    <th style={{ padding: 12 }}>Địa Chỉ Giao</th>
                    <th style={{ padding: 12 }}>Tổng Tiền</th>
                    <th style={{ padding: 12 }}>Trạng Thái</th>
                    <th style={{ padding: 12, textAlign: 'right' }}>Cập nhật</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(ord => (
                    <tr key={ord.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: 12, fontWeight: 800, color: 'var(--color-accent)' }}>#{ord.id}</td>
                      <td style={{ padding: 12 }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{ord.customerInfo.fullname}</div>
                        <div style={{ fontSize: '0.775rem', color: '#64748b' }}>{ord.customerInfo.phone}</div>
                      </td>
                      <td style={{ padding: 12, color: '#475569', maxWidth: 220 }}>
                        {ord.customerInfo.address}, {ord.customerInfo.district}, {ord.customerInfo.city}
                      </td>
                      <td style={{ padding: 12, fontWeight: 800, color: '#0f172a' }}>
                        {formatCurrencyVND(ord.totalAmount)}
                      </td>
                      <td style={{ padding: 12 }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: 20,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: ord.status === 'completed' ? '#ecfdf5' : ord.status === 'shipping' ? '#eff6ff' : '#fffbeb',
                          color: ord.status === 'completed' ? '#10b981' : ord.status === 'shipping' ? '#3b82f6' : '#f59e0b',
                          border: '1px solid currentColor'
                        }}>
                          {ord.status === 'completed' ? '✓ Hoàn Thành' : ord.status === 'shipping' ? '🚚 Đang Giao' : ord.status === 'confirmed' ? '👌 Đã Xác Nhận' : '⏳ Chờ Xử Lý'}
                        </span>
                      </td>
                      <td style={{ padding: 12, textAlign: 'right' }}>
                        <select 
                          value={ord.status} 
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                          style={{ padding: '4px 8px', borderRadius: 6, fontSize: '0.8rem', border: '1px solid #cbd5e1' }}
                        >
                          <option value="pending">Chờ xử lý</option>
                          <option value="confirmed">Đã xác nhận</option>
                          <option value="shipping">Đang giao</option>
                          <option value="completed">Hoàn thành</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: USERS */}
        {activeTab === 'users' && (
          <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Danh Sách Khách Hàng VIP</h2>
            <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: 20 }}>
              Hệ thống khách hàng thân thiết cửa hàng Tiệm Lửa
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {[
                { name: 'Lại Đại Vương', phone: '0888 368 726', role: 'Quản Trị Viên VIP', spent: '125,000,000đ' },
                { name: 'Nguyễn Văn Hùng', phone: '0988 299 999', role: 'Khách Hàng VIP', spent: '29,700,000đ' },
                { name: 'Trần Thị Minh Anh', phone: '0912 345 678', role: 'Thành Viên VIP', spent: '18,500,000đ' },
                { name: 'Lê Hoàng Nam', phone: '0977 123 999', role: 'Thành Viên VIP', spent: '5,600,000đ' }
              ].map((u, i) => (
                <div key={i} style={{ background: '#f8fafc', padding: 18, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-accent)', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{u.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)' }}>{u.role}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.825rem', color: '#475569' }}>📞 {u.phone}</div>
                  <div style={{ fontSize: '0.825rem', color: '#475569', marginTop: 4 }}>💰 Chi tiêu: <strong>{u.spent}</strong></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Edit / Add Modal Popup (2 Column Full-Width Vietnamese) */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingProduct(null); }}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </div>
  );
}
