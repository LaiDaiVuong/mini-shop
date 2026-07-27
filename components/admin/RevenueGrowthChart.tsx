'use client';

import React from 'react';

export const RevenueGrowthChart: React.FC<{ totalRevenue?: number }> = ({ totalRevenue = 0 }) => {
  const currentMonthVal = totalRevenue > 0 ? Math.round(totalRevenue / 1000000) + ' Triệu' : '148 Triệu';

  return (
    <div className="chart-box" style={{ background: '#0f172a', color: '#ffffff', border: '1px solid #1e293b', boxShadow: '0 10px 30px rgba(0,0,0,0.25)', borderRadius: 14, padding: 20 }}>
      <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.05rem', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#f8fafc' }}>📈 BIỂU ĐỒ TĂNG TRƯỞNG DOANH THU (2026)</span>
        <span className="badge-tag" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
          Đơn vị: Triệu VND
        </span>
      </div>

      <div style={{ position: 'relative', width: '100%', height: 205, background: '#1e293b', borderRadius: 12, border: '1px solid #334155', padding: '18px 12px 10px' }}>
        <svg viewBox="0 0 500 140" preserveAspectRatio="none" style={{ width: '100%', height: 135, overflow: 'visible' }}>
          <defs>
            <linearGradient id="lineThemeGradientNext" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1"/>
              <stop offset="50%" stopColor="#3b82f6"/>
              <stop offset="100%" stopColor="#10b981"/>
            </linearGradient>
            
            <linearGradient id="areaThemeFillNext" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35"/>
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0"/>
            </linearGradient>
            
            <filter id="glowThemeNext" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="25" x2="500" y2="25" stroke="rgba(255,255,255,0.08)" strokeDasharray="4" />
          <line x1="0" y1="65" x2="500" y2="65" stroke="rgba(255,255,255,0.08)" strokeDasharray="4" />
          <line x1="0" y1="105" x2="500" y2="105" stroke="rgba(255,255,255,0.08)" strokeDasharray="4" />

          {/* Smooth Area Fill */}
          <path d="M 30,110 C 85,100 100,80 140,75 C 185,70 205,50 250,45 C 295,40 320,28 360,22 C 410,16 440,12 470,8 L 470,135 L 30,135 Z" fill="url(#areaThemeFillNext)" />

          {/* Glowing Curved Line */}
          <path d="M 30,110 C 85,100 100,80 140,75 C 185,70 205,50 250,45 C 295,40 320,28 360,22 C 410,16 440,12 470,8" fill="none" stroke="url(#lineThemeGradientNext)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#glowThemeNext)" />

          {/* Data Nodes */}
          <g>
            <circle cx="30" cy="110" r="5" fill="#0f172a" stroke="#6366f1" strokeWidth="3" />
            <text x="30" y="93" textAnchor="middle" fontSize="11" fontWeight="700" fill="#cbd5e1">42 Triệu</text>
          </g>
          <g>
            <circle cx="140" cy="75" r="5" fill="#0f172a" stroke="#3b82f6" strokeWidth="3" />
            <text x="140" y="58" textAnchor="middle" fontSize="11" fontWeight="700" fill="#cbd5e1">68 Triệu</text>
          </g>
          <g>
            <circle cx="250" cy="45" r="5" fill="#0f172a" stroke="#0ea5e9" strokeWidth="3" />
            <text x="250" y="28" textAnchor="middle" fontSize="11" fontWeight="700" fill="#cbd5e1">95 Triệu</text>
          </g>
          <g>
            <circle cx="360" cy="22" r="5" fill="#0f172a" stroke="#10b981" strokeWidth="3" />
            <text x="360" y="5" textAnchor="middle" fontSize="11" fontWeight="700" fill="#cbd5e1">112 Triệu</text>
          </g>
          <g>
            <circle cx="470" cy="8" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="3" />
            <text x="470" y="-8" textAnchor="middle" fontSize="12" fontWeight="800" fill="#10b981">{currentMonthVal}</text>
          </g>
        </svg>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: '0.775rem', fontWeight: 700, color: '#94a3b8', padding: '0 10px' }}>
          <span>Tháng 3</span>
          <span>Tháng 4</span>
          <span>Tháng 5</span>
          <span>Tháng 6</span>
          <span style={{ color: '#10b981', fontWeight: 800 }}>Tháng 7</span>
        </div>
      </div>
    </div>
  );
};
