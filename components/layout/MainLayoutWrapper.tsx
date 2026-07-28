'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <div className="admin-layout-root" style={{ minHeight: '100vh', background: '#0f172a' }}>{children}</div>;
  }

  return (
    <>
      <Header />
      <main style={{ minHeight: '80vh' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
