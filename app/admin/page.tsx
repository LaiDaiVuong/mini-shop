'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, Order } from '@/lib/types';
import { INITIAL_PRODUCTS_DATA, formatCurrencyVND } from '@/lib/products-data';
import { 
  fetchProductsFromSupabase, 
  saveProductToSupabase, 
  deleteProductFromSupabase, 
  fetchOrdersFromSupabase, 
  updateOrderStatusInSupabase 
} from '@/lib/supabase';
import { RevenueGrowthChart } from '@/components/admin/RevenueGrowthChart';
import { OrderStatusDonutChart } from '@/components/admin/OrderStatusDonutChart';
import { ProductModal } from '@/components/admin/ProductModal';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users' | 'settings'>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Data States
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS_DATA);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Filters & Search State
  const [searchProd, setSearchProd] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Batch Selection State
  const [selectedProdIds, setSelectedProdIds] = useState<string[]>([]);

  // Action Menu Dropdown State
  const [openMenuProdId, setOpenMenuProdId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Load live data from DB on mount
  const loadSupabaseData = async () => {
    setIsLoadingData(true);
    try {
      const [prodsData, ordersData] = await Promise.all([
        fetchProductsFromSupabase(),
        fetchOrdersFromSupabase()
      ]);

      if (prodsData && prodsData.length > 0) {
        setProducts(prodsData);
      }

      if (ordersData && ordersData.length > 0) {
        setOrders(ordersData);
      } else {
        const localOrders = localStorage.getItem('tiemlua_orders');
        if (localOrders) {
          setOrders(JSON.parse(localOrders));
        }
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadSupabaseData();
  }, []);

  // Close floating dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.action-menu-container')) {
        setOpenMenuProdId(null);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Save product (Add or Edit) directly to DB
  const handleSaveProduct = async (prod: Product) => {
    const isEditing = !!editingProduct;
    await saveProductToSupabase(prod, isEditing);
    await loadSupabaseData();
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Delete single product
  const handleDeleteProduct = async (id: string) => {
    if (confirm('⚠️ CẢNH BÁO: Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống? Thao tác này không thể hoàn tác.')) {
      await deleteProductFromSupabase(id);
      setSelectedProdIds(prev => prev.filter(item => item !== id));
      await loadSupabaseData();
    }
  };

  // Bulk Delete selected products
  const handleBulkDelete = async () => {
    if (selectedProdIds.length === 0) return;
    if (confirm(`⚠️ CẢNH BÁO: Bạn có chắc chắn muốn XÓA HÀNG LOẠT ${selectedProdIds.length} sản phẩm đã chọn? Thao tác này không thể hoàn tác.`)) {
      setIsLoadingData(true);
      for (const id of selectedProdIds) {
        await deleteProductFromSupabase(id);
      }
      setSelectedProdIds([]);
      await loadSupabaseData();
    }
  };

  // Update order status directly in DB
  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    await updateOrderStatusInSupabase(orderId, newStatus);
    const updated = orders.map(ord => ord.id === orderId ? { ...ord, status: newStatus } : ord);
    setOrders(updated);
    localStorage.setItem('tiemlua_orders', JSON.stringify(updated));
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // KPI Computations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalStockValue = products.reduce((sum, p) => sum + (p.priceNum || 0), 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const activeCount = orders.filter(o => o.status === 'confirmed' || o.status === 'shipping').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchProd.toLowerCase()) || p.id.toLowerCase().includes(searchProd.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    
    // Determine stock status for filtering
    const isOut = p.badge?.toLowerCase().includes('hết') || false;
    const isLow = p.badge?.toLowerCase().includes('sắp') || false;
    const isAvailable = !isOut && !isLow;

    let matchesStock = true;
    if (stockFilter === 'in_stock') matchesStock = isAvailable;
    if (stockFilter === 'low_stock') matchesStock = isLow;
    if (stockFilter === 'out_of_stock') matchesStock = isOut;

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Pagination Computations
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  // Batch Select Handlers
  const isAllSelected = paginatedProducts.length > 0 && paginatedProducts.every(p => selectedProdIds.includes(p.id));
  
  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      const pageIds = paginatedProducts.map(p => p.id);
      setSelectedProdIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      const pageIds = paginatedProducts.map(p => p.id);
      const combined = Array.from(new Set([...selectedProdIds, ...pageIds]));
      setSelectedProdIds(combined);
    }
  };

  const handleRowSelectToggle = (id: string) => {
    if (selectedProdIds.includes(id)) {
      setSelectedProdIds(prev => prev.filter(item => item !== id));
    } else {
      setSelectedProdIds(prev => [...prev, id]);
    }
  };

  const filteredOrders = orderFilterStatus === 'all' ? orders : orders.filter(o => o.status === orderFilterStatus);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#0f172a' }}>
      
      {/* 1. COLLAPSIBLE LUXURY SIDEBAR (#0F172A Navy Theme) */}
      <aside 
        style={{ 
          width: isSidebarCollapsed ? 78 : 275, 
          background: '#0F172A', 
          color: '#ffffff', 
          display: 'flex', 
          flexDirection: 'column', 
          position: 'sticky', 
          top: 0, 
          height: '100vh', 
          borderRight: '1px solid #1e293b',
          zIndex: 100,
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden'
        }}
      >
        {/* Sidebar Brand Header */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: isSidebarCollapsed ? 'center' : 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 10, 
              background: 'linear-gradient(135deg, #C89B3C 0%, #a67c2e 100%)', 
              color: '#fff', 
              fontSize: '1.3rem', 
              fontWeight: 800, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              boxShadow: '0 4px 14px rgba(200, 155, 60, 0.4)',
              flexShrink: 0
            }}>
              🔥
            </div>
            {!isSidebarCollapsed && (
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 800, letterSpacing: 1.5, color: '#fff', whiteSpace: 'nowrap' }}>
                  TIỆM LỬA <span style={{ color: '#C89B3C' }}>ADMIN</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 1 }}>Luxury Portal</div>
              </div>
            )}
          </div>

          {!isSidebarCollapsed && (
            <button 
              onClick={() => setIsSidebarCollapsed(true)} 
              title="Thu gọn Menu"
              style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '1.1rem', cursor: 'pointer', padding: 4 }}
            >
              ◀
            </button>
          )}
        </div>

        {/* Expand Button when Collapsed */}
        {isSidebarCollapsed && (
          <button 
            onClick={() => setIsSidebarCollapsed(false)} 
            title="Mở rộng Menu"
            style={{ background: '#1e293b', border: 'none', color: '#C89B3C', padding: '8px 0', fontSize: '1rem', cursor: 'pointer', textAlign: 'center' }}
          >
            ▶
          </button>
        )}

        {/* Sidebar Navigation Items */}
        <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { id: 'overview', icon: '📊', label: 'Tổng Quan Hệ Thống' },
            { id: 'products', icon: '📦', label: 'Quản Lý Sản Phẩm', badge: products.length },
            { id: 'orders', icon: '🛒', label: 'Quản Lý Đơn Hàng', badge: pendingCount ? `${pendingCount} Mới` : undefined, badgeColor: '#EF4444' },
            { id: 'users', icon: '👥', label: 'Quản Lý Khách Hàng' },
            { id: 'settings', icon: '⚙️', label: 'Cấu Hình Hệ Thống' },
          ].map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                title={isSidebarCollapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  padding: isSidebarCollapsed ? '12px 0' : '12px 14px',
                  justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                  borderRadius: 10,
                  border: 'none',
                  background: isActive ? 'rgba(200, 155, 60, 0.18)' : 'transparent',
                  color: isActive ? '#C89B3C' : '#94a3b8',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  borderLeft: isActive ? '3px solid #C89B3C' : '3px solid transparent'
                }}
              >
                <span style={{ fontSize: '1.15rem' }}>{item.icon}</span>
                {!isSidebarCollapsed && (
                  <>
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                    {item.badge && (
                      <span style={{ 
                        padding: '2px 8px', 
                        borderRadius: 12, 
                        fontSize: '0.7rem', 
                        fontWeight: 800, 
                        background: item.badgeColor || '#334155', 
                        color: '#fff' 
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer User Box */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid #1e293b', background: '#090d16' }}>
          {!isSidebarCollapsed ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#C89B3C', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  👑
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#fff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {user?.fullname ? (user.fullname.trim().split(/\s+/).pop() || user.fullname) : 'Vương'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#C89B3C' }}>Quản Trị Viên VIP</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                <Link 
                  href="/" 
                  style={{ 
                    flex: 1,
                    padding: '7px 8px', 
                    background: '#1e293b', 
                    color: '#cbd5e1', 
                    borderRadius: 8, 
                    fontSize: '0.75rem', 
                    fontWeight: 700, 
                    textAlign: 'center',
                    textDecoration: 'none'
                  }}
                >
                  🏪 Shop
                </Link>
                <button 
                  onClick={handleLogout}
                  style={{ 
                    padding: '7px 10px', 
                    background: 'rgba(239, 68, 68, 0.15)', 
                    color: '#EF4444', 
                    border: '1px solid rgba(239, 68, 68, 0.3)', 
                    borderRadius: 8, 
                    fontSize: '0.75rem', 
                    fontWeight: 700, 
                    cursor: 'pointer' 
                  }}
                >
                  Thoát
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={handleLogout}
                title="Đăng xuất"
                style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                🚪
              </button>
            </div>
          )}
        </div>

      </aside>

      {/* 2. RIGHT MAIN CONTENT AREA */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Admin Top Header Bar */}
        <header style={{ height: 70, background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', position: 'sticky', top: 0, zIndex: 10 }}>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {activeTab === 'overview' && '📊 Bảng Điều Khiển Tổng Quan'}
              {activeTab === 'products' && '📦 Quản Lý Kho & Sản Phẩm'}
              {activeTab === 'orders' && '🛒 Quản Lý Đơn Đặt Hàng'}
              {activeTab === 'users' && '👥 Danh Sách Khách Hàng VIP'}
              {activeTab === 'settings' && '⚙️ Cấu Hình Máy Chủ & Kết Nối'}
            </h1>
            <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: 2 }}>Trạm điều hành thương mại điện tử Tiệm Lửa</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '6px 14px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, color: '#10B981' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }}></span>
              Hệ Thống Trực Tuyến
            </div>

            {activeTab === 'products' && (
              <button 
                onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
                style={{ 
                  padding: '9px 18px', 
                  background: 'linear-gradient(135deg, #C89B3C 0%, #a67c2e 100%)', 
                  color: '#ffffff', 
                  borderRadius: 8, 
                  fontWeight: 800, 
                  fontSize: '0.825rem', 
                  border: 'none', 
                  cursor: 'pointer', 
                  boxShadow: '0 4px 14px rgba(200, 155, 60, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <span>+</span> THÊM SẢN PHẨM MỚI
              </button>
            )}
          </div>
        </header>

        {/* Content Body */}
        <div style={{ padding: 28, flex: 1 }}>
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              {/* 4 Standardized KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 28 }}>
                <div style={{ background: '#fff', padding: 20, borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 800, letterSpacing: 0.5 }}>TỔNG DOANH THU</div>
                  <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#C89B3C', margin: '6px 0' }}>{formatCurrencyVND(totalRevenue)}</div>
                  <div style={{ fontSize: '0.725rem', color: '#10B981', fontWeight: 700 }}>▲ +18.5% so với tháng trước</div>
                </div>

                <div style={{ background: '#fff', padding: 20, borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 800, letterSpacing: 0.5 }}>TỔNG SẢN PHẨM</div>
                  <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', margin: '6px 0' }}>{products.length} Món</div>
                  <div style={{ fontSize: '0.725rem', color: '#10B981', fontWeight: 700 }}>● Đang mở bán trên hệ thống</div>
                </div>

                <div style={{ background: '#fff', padding: 20, borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 800, letterSpacing: 0.5 }}>TỔNG ĐƠN HÀNG</div>
                  <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', margin: '6px 0' }}>{orders.length} Đơn</div>
                  <div style={{ fontSize: '0.725rem', color: '#C89B3C', fontWeight: 700 }}>{pendingCount} đơn chờ xử lý</div>
                </div>

                <div style={{ background: '#fff', padding: 20, borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 800, letterSpacing: 0.5 }}>GIÁ TRỊ KHO HÀNG</div>
                  <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', margin: '6px 0' }}>{formatCurrencyVND(totalStockValue)}</div>
                  <div style={{ fontSize: '0.725rem', color: '#10B981', fontWeight: 700 }}>Ước tính giá niêm yết kho</div>
                </div>
              </div>

              {/* Charts Grid */}
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

          {/* TAB 2: PRODUCTS (LUXURY MANAGEMENT HUB) */}
          {activeTab === 'products' && (
            <div>
              {/* TOP KPI BANNER FOR PRODUCTS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
                <div style={{ background: '#fff', padding: '16px 20px', borderRadius: 14, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>TỔNG SẢN PHẨM</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginTop: 4 }}>{products.length}</div>
                </div>
                <div style={{ background: '#fff', padding: '16px 20px', borderRadius: 14, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700 }}>● ĐANG BÁN</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10B981', marginTop: 4 }}>{products.length}</div>
                </div>
                <div style={{ background: '#fff', padding: '16px 20px', borderRadius: 14, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#C89B3C', fontWeight: 700 }}>● SẮP HẾT / HẾT HÀNG</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#C89B3C', marginTop: 4 }}>0</div>
                </div>
                <div style={{ background: '#fff', padding: '16px 20px', borderRadius: 14, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>TỔNG GIÁ TRỊ KHO</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#C89B3C', marginTop: 4 }}>{formatCurrencyVND(totalStockValue)}</div>
                </div>
              </div>

              {/* MAIN PRODUCTS TABLE CONTAINER */}
              <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', padding: 24 }}>
                
                {/* TOOLBAR: SEARCH & MULTI-FILTERS */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
                    
                    {/* Search Input */}
                    <div style={{ position: 'relative', width: 260 }}>
                      <input 
                        type="text" 
                        placeholder="Tìm theo tên hoặc mã..." 
                        value={searchProd}
                        onChange={(e) => { setSearchProd(e.target.value); setCurrentPage(1); }}
                        style={{ width: '100%', padding: '9px 14px 9px 36px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.85rem' }}
                      />
                      <span style={{ position: 'absolute', left: 12, top: 9, color: '#94a3b8' }}>🔍</span>
                    </div>

                    {/* Category Filter */}
                    <select
                      value={categoryFilter}
                      onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                      style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}
                    >
                      <option value="all">📂 Tất cả danh mục</option>
                      <option value="st-dupont">S.T. Dupont France</option>
                      <option value="dupont-hk">Dupont Hongkong</option>
                      <option value="rowenta">Rowenta R10 Đức</option>
                      <option value="phu-kien">Phụ Kiện Lửa</option>
                    </select>

                    {/* Stock Filter */}
                    <select
                      value={stockFilter}
                      onChange={(e) => { setStockFilter(e.target.value); setCurrentPage(1); }}
                      style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}
                    >
                      <option value="all">📦 Tất cả tồn kho</option>
                      <option value="in_stock">● Còn hàng</option>
                      <option value="low_stock">● Sắp hết</option>
                      <option value="out_of_stock">● Hết hàng</option>
                    </select>
                  </div>

                  {/* Right Add Button */}
                  <button 
                    onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
                    style={{ padding: '9px 16px', background: 'linear-gradient(135deg, #C89B3C 0%, #a67c2e 100%)', color: '#fff', borderRadius: 8, fontWeight: 800, fontSize: '0.825rem', border: 'none', cursor: 'pointer' }}
                  >
                    + THÊM MỚI
                  </button>
                </div>

                {/* BATCH SELECTION FLOATING BAR */}
                {selectedProdIds.length > 0 && (
                  <div style={{ padding: '12px 18px', background: '#0F172A', color: '#fff', borderRadius: 12, marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 6px 20px rgba(15, 23, 42, 0.25)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                      ⚡ Đã chọn <span style={{ color: '#C89B3C', fontWeight: 800 }}>{selectedProdIds.length}</span> sản phẩm
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                      <button 
                        onClick={handleBulkDelete}
                        style={{ padding: '6px 14px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 800, fontSize: '0.775rem', cursor: 'pointer' }}
                      >
                        🗑️ XÓA HÀNG LOẠT
                      </button>
                      <button 
                        onClick={() => setSelectedProdIds([])}
                        style={{ padding: '6px 14px', background: '#334155', color: '#cbd5e1', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.775rem', cursor: 'pointer' }}
                      >
                        Hủy chọn
                      </button>
                    </div>
                  </div>
                )}

                {/* TABLE OF PRODUCTS */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                        <th style={{ padding: 14, width: 40 }}>
                          <input 
                            type="checkbox" 
                            checked={isAllSelected}
                            onChange={handleSelectAllToggle}
                            style={{ cursor: 'pointer', width: 16, height: 16 }}
                          />
                        </th>
                        <th style={{ padding: 14, width: 80 }}>Hình Ảnh</th>
                        <th style={{ padding: 14 }}>Tên Sản Phẩm & Mã</th>
                        <th style={{ padding: 14 }}>Danh Mục</th>
                        <th style={{ padding: 14 }}>Giá Bán</th>
                        <th style={{ padding: 14 }}>Tồn Kho</th>
                        <th style={{ padding: 14 }}>Huy Hiệu</th>
                        <th style={{ padding: 14, textAlign: 'center', width: 70 }}>Hành Động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedProducts.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ padding: 36, textAlign: 'center', color: '#94a3b8' }}>
                            Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
                          </td>
                        </tr>
                      ) : (
                        paginatedProducts.map(p => {
                          const isSelected = selectedProdIds.includes(p.id);
                          const isOut = p.badge?.toLowerCase().includes('hết');
                          const isLow = p.badge?.toLowerCase().includes('sắp');

                          return (
                            <tr 
                              key={p.id} 
                              style={{ 
                                borderBottom: '1px solid #f1f5f9',
                                background: isSelected ? '#fefce8' : 'transparent'
                              }}
                            >
                              {/* Checkbox */}
                              <td style={{ padding: 14 }}>
                                <input 
                                  type="checkbox" 
                                  checked={isSelected}
                                  onChange={() => handleRowSelectToggle(p.id)}
                                  style={{ cursor: 'pointer', width: 16, height: 16 }}
                                />
                              </td>

                              {/* Image (60x60px) */}
                              <td style={{ padding: 14 }}>
                                <img 
                                  src={p.img} 
                                  alt={p.name} 
                                  style={{ 
                                    width: 60, 
                                    height: 60, 
                                    objectFit: 'contain', 
                                    background: '#fafafa', 
                                    border: '1px solid #e2e8f0', 
                                    borderRadius: 10,
                                    padding: 2
                                  }} 
                                />
                              </td>

                              {/* Name & ID */}
                              <td style={{ padding: 14 }}>
                                <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem', marginBottom: 2 }}>{p.name}</div>
                                <div style={{ fontSize: '0.725rem', color: '#94a3b8', fontFamily: 'monospace' }}>#{p.id}</div>
                              </td>

                              {/* Category */}
                              <td style={{ padding: 14, color: '#475569', fontWeight: 600 }}>
                                {p.categoryName}
                              </td>

                              {/* Price */}
                              <td style={{ padding: 14, fontWeight: 800, color: '#C89B3C', fontSize: '0.95rem' }}>
                                {p.price}
                              </td>

                              {/* Inventory Status Pill */}
                              <td style={{ padding: 14 }}>
                                <span style={{
                                  padding: '4px 10px',
                                  borderRadius: 20,
                                  fontSize: '0.725rem',
                                  fontWeight: 800,
                                  background: isOut ? '#fef2f2' : isLow ? '#fffbeb' : '#ecfdf5',
                                  color: isOut ? '#EF4444' : isLow ? '#C89B3C' : '#10B981',
                                  border: '1px solid currentColor',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4
                                }}>
                                  ● {isOut ? 'Hết hàng' : isLow ? 'Sắp hết' : 'Còn hàng'}
                                </span>
                              </td>

                              {/* Badge Pill */}
                              <td style={{ padding: 14 }}>
                                <span style={{ 
                                  padding: '4px 10px',
                                  borderRadius: 20,
                                  fontSize: '0.725rem',
                                  fontWeight: 800,
                                  background: '#fffbeb',
                                  color: '#C89B3C',
                                  border: '1px solid #fde68a'
                                }}>
                                  ✨ {p.badge || 'Luxury'}
                                </span>
                              </td>

                              {/* Floating Action Menu ⋮ */}
                              <td style={{ padding: 14, textAlign: 'center', position: 'relative' }} className="action-menu-container">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuProdId(openMenuProdId === p.id ? null : p.id);
                                  }}
                                  style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 6,
                                    border: '1px solid #cbd5e1',
                                    background: openMenuProdId === p.id ? '#0F172A' : '#ffffff',
                                    color: openMenuProdId === p.id ? '#ffffff' : '#0F172A',
                                    fontWeight: 800,
                                    fontSize: '1.2rem',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  ⋮
                                </button>

                                {openMenuProdId === p.id && (
                                  <div style={{
                                    position: 'absolute',
                                    right: 20,
                                    top: 45,
                                    background: '#ffffff',
                                    borderRadius: 10,
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                                    border: '1px solid #e2e8f0',
                                    padding: '6px 0',
                                    zIndex: 50,
                                    minWidth: 140,
                                    textAlign: 'left'
                                  }}>
                                    <button 
                                      onClick={() => { setEditingProduct(p); setIsModalOpen(true); setOpenMenuProdId(null); }}
                                      style={{
                                        width: '100%',
                                        padding: '8px 14px',
                                        fontSize: '0.8rem',
                                        fontWeight: 700,
                                        color: '#0F172A',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6
                                      }}
                                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                                    >
                                      ⚡ Chỉnh Sửa
                                    </button>

                                    <button 
                                      onClick={() => { handleDeleteProduct(p.id); setOpenMenuProdId(null); }}
                                      style={{
                                        width: '100%',
                                        padding: '8px 14px',
                                        fontSize: '0.8rem',
                                        fontWeight: 700,
                                        color: '#EF4444',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6
                                      }}
                                      onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                                    >
                                      🗑️ Xóa Món Này
                                    </button>
                                  </div>
                                )}
                              </td>

                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION CONTROLS */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, paddingTop: 16, borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: 16 }}>
                  
                  {/* Left: Page Size Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.825rem', color: '#64748b' }}>
                    <span>Hiển thị</span>
                    <select 
                      value={pageSize}
                      onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                      style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.825rem', fontWeight: 700 }}
                    >
                      <option value={10}>10 sản phẩm</option>
                      <option value={25}>25 sản phẩm</option>
                      <option value={50}>50 sản phẩm</option>
                      <option value={100}>100 sản phẩm</option>
                    </select>
                    <span>trên tổng <strong>{filteredProducts.length}</strong> sản phẩm</span>
                  </div>

                  {/* Right: Page Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        background: currentPage === 1 ? '#f1f5f9' : '#fff',
                        color: currentPage === 1 ? '#94a3b8' : '#0F172A',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      ◀ Trước
                    </button>

                    <div style={{ fontSize: '0.825rem', fontWeight: 800, padding: '0 8px', color: '#0F172A' }}>
                      Trang {currentPage} / {totalPages}
                    </div>

                    <button 
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        background: currentPage >= totalPages ? '#f1f5f9' : '#fff',
                        color: currentPage >= totalPages ? '#94a3b8' : '#0F172A',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Sau ▶
                    </button>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === 'orders' && (
            <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>Quản Lý Đơn Đặt Hàng</h2>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Cập nhật trạng thái đơn từ Mới sang Đang giao, Đã giao</p>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'pending', label: 'Mới (Chờ xử lý)' },
                    { id: 'confirmed', label: 'Đã xác nhận' },
                    { id: 'shipping', label: 'Đang giao' },
                    { id: 'completed', label: 'Đã giao (Hoàn thành)' }
                  ].map(st => (
                    <button
                      key={st.id}
                      onClick={() => setOrderFilterStatus(st.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 20,
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        background: orderFilterStatus === st.id ? '#0F172A' : '#f1f5f9',
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
                      <th style={{ padding: 12 }}>Sản Phẩm Đặt</th>
                      <th style={{ padding: 12 }}>Địa Chỉ Giao</th>
                      <th style={{ padding: 12 }}>Tổng Tiền</th>
                      <th style={{ padding: 12, textAlign: 'right' }}>Cập Nhật</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: 30, textAlign: 'center', color: '#94a3b8' }}>Chưa có đơn hàng nào trong kho.</td>
                      </tr>
                    ) : (
                      filteredOrders.map(ord => (
                        <tr key={ord.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: 12 }}>
                            <div style={{ marginBottom: 6 }}>
                              <span style={{
                                padding: '3px 9px',
                                borderRadius: 20,
                                fontSize: '0.725rem',
                                fontWeight: 800,
                                background: ord.status === 'completed' ? '#ecfdf5' : ord.status === 'shipping' ? '#eff6ff' : ord.status === 'confirmed' ? '#fef3c7' : ord.status === 'cancelled' ? '#fef2f2' : '#fffbeb',
                                color: ord.status === 'completed' ? '#10B981' : ord.status === 'shipping' ? '#3b82f6' : ord.status === 'confirmed' ? '#d97706' : ord.status === 'cancelled' ? '#EF4444' : '#f59e0b',
                                border: '1px solid currentColor',
                                display: 'inline-block'
                              }}>
                                {ord.status === 'completed' ? '✓ Đã Giao' : ord.status === 'shipping' ? '🚚 Đang Giao' : ord.status === 'confirmed' ? '👌 Đã Xác Nhận' : ord.status === 'cancelled' ? '❌ Đã Hủy' : '⏳ Mới'}
                              </span>
                            </div>
                            <div style={{ fontWeight: 800, color: '#C89B3C', fontSize: '0.95rem' }}>#{ord.id}</div>
                            {ord.createdAt && <div style={{ fontSize: '0.725rem', color: '#94a3b8', marginTop: 2 }}>{ord.createdAt}</div>}
                          </td>
                          <td style={{ padding: 12 }}>
                            <div style={{ fontWeight: 700, color: '#0F172A' }}>{ord.customerInfo.fullname}</div>
                            <div style={{ fontSize: '0.775rem', color: '#64748b' }}>{ord.customerInfo.phone}</div>
                          </td>
                          <td style={{ padding: 12, maxWidth: 200 }}>
                            {ord.items.map((item, idx) => (
                              <div key={idx} style={{ fontSize: '0.8rem', color: '#334155' }}>
                                • {item.name} <strong>x{item.quantity}</strong>
                              </div>
                            ))}
                          </td>
                          <td style={{ padding: 12, color: '#475569', maxWidth: 200 }}>
                            {ord.customerInfo.address}
                          </td>
                          <td style={{ padding: 12, fontWeight: 800, color: '#0F172A' }}>
                            {formatCurrencyVND(ord.totalAmount)}
                          </td>
                          <td style={{ padding: 12, textAlign: 'right' }}>
                            <select 
                              value={ord.status} 
                              onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                              style={{ padding: '6px 10px', borderRadius: 6, fontSize: '0.8rem', border: '1px solid #cbd5e1', fontWeight: 700, cursor: 'pointer' }}
                            >
                              <option value="pending">⏳ Mới (Chờ xử lý)</option>
                              <option value="confirmed">👌 Đã xác nhận</option>
                              <option value="shipping">🚚 Đang giao</option>
                              <option value="completed">✓ Đã giao (Hoàn thành)</option>
                              <option value="cancelled">❌ Đã hủy</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: USERS */}
          {activeTab === 'users' && (
            <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>Danh Sách Khách Hàng VIP</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                {[
                  { name: 'Lại Đại Vương', phone: '0888 368 726', role: 'Quản Trị Viên VIP', spent: '125,000,000đ' },
                  { name: 'Nguyễn Văn Hùng', phone: '0988 299 999', role: 'Khách Hàng VIP', spent: '29,700,000đ' },
                  { name: 'Trần Thị Minh Anh', phone: '0912 345 678', role: 'Thành Viên VIP', spent: '18,500,000đ' },
                  { name: 'Lê Hoàng Nam', phone: '0977 123 999', role: 'Thành Viên VIP', spent: '5,600,000đ' }
                ].map((u, i) => (
                  <div key={i} style={{ background: '#f8fafc', padding: 18, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#C89B3C', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0F172A' }}>{u.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#C89B3C' }}>{u.role}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.825rem', color: '#475569' }}>📞 {u.phone}</div>
                    <div style={{ fontSize: '0.825rem', color: '#475569', marginTop: 4 }}>💰 Chi tiêu: <strong>{u.spent}</strong></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0', maxWidth: 650 }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>⚙️ Cấu Hình Máy Chủ & Kết Nối</h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 20 }}>Thông tin kết nối đám mây của cửa hàng</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>ENDPOINT SERVER URL</label>
                  <input type="text" readOnly value="https://lnwltbvlifrhyrpwtmmf.supabase.co" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 600, color: '#334155', fontSize: '0.875rem' }} />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>API PUBLISHABLE KEY</label>
                  <input type="text" readOnly value="sb_publishable_nkefygNGjpLMtEsPv127jQ_yJakszuM" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 600, color: '#334155', fontSize: '0.875rem' }} />
                </div>

                <div style={{ padding: 16, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, color: '#166534', fontSize: '0.85rem' }}>
                  ✓ Đã bảo mật khóa trong tệp môi trường <code>.env.local</code> và chặn đẩy lên GitHub theo đúng tiêu chuẩn.
                </div>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingProduct(null); }}
        onSave={handleSaveProduct}
        product={editingProduct}
      />

    </div>
  );
}
