'use client';

import React from 'react';

interface OrderStatusDonutChartProps {
  pendingCount?: number;
  activeCount?: number;
  completedCount?: number;
  totalOrders?: number;
}

export const OrderStatusDonutChart: React.FC<OrderStatusDonutChartProps> = ({
  pendingCount = 1,
  activeCount = 2,
  completedCount = 3,
  totalOrders = 6
}) => {
  const total = totalOrders || 1;
  const C = 238.7; // 2 * PI * 38

  const pendingPct = pendingCount / total;
  const activePct = activeCount / total;
  const completedPct = completedCount / total;

  const pendingOffset = C * (1 - pendingPct);
  const activeOffset = C * (1 - (pendingPct + activePct));
  const completedOffset = C * (1 - (pendingPct + activePct + completedPct));

  return (
    <div className="chart-box" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 20, boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
      <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.05rem', marginBottom: 14, color: '#0f172a' }}>
        🍩 TRẠNG THÁI ĐƠN HÀNG
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 100 100" style={{ width: 140, height: 140, transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="14" />
            
            <circle 
              cx="50" cy="50" r="38" fill="none" stroke="#10b981" strokeWidth="14" 
              strokeDasharray="238.7" strokeDashoffset={completedOffset} strokeLinecap="round" 
            />
            <circle 
              cx="50" cy="50" r="38" fill="none" stroke="#3b82f6" strokeWidth="14" 
              strokeDasharray="238.7" strokeDashoffset={activeOffset} strokeLinecap="round" 
            />
            <circle 
              cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" strokeWidth="14" 
              strokeDasharray="238.7" strokeDashoffset={pendingOffset} strokeLinecap="round" 
            />
          </svg>

          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{totalOrders}</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, marginTop: 2 }}>ĐƠN HÀNG</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 140 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569', fontWeight: 600 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }}></span> Chờ xử lý
            </span>
            <strong style={{ color: '#0f172a' }}>{pendingCount}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569', fontWeight: 600 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#3b82f6' }}></span> Đang giao
            </span>
            <strong style={{ color: '#0f172a' }}>{activeCount}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569', fontWeight: 600 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }}></span> Hoàn thành
            </span>
            <strong style={{ color: '#0f172a' }}>{completedCount}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
