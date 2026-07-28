import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/context/AppProviders';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';

export const metadata: Metadata = {
  title: 'Tiệm Lửa | Bật Lửa S.T. Dupont, Rowenta R10 & Dupont HongKong Luxury',
  description: 'Tiệm Lửa - Chuyên mua bán, chế tác và phân phối các dòng bật lửa cao cấp chính hãng S.T. Dupont, Rowenta R10, Dupont Hongkong đẳng cấp quý ông.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <AppProviders>
          <MainLayoutWrapper>
            {children}
          </MainLayoutWrapper>
        </AppProviders>
      </body>
    </html>
  );
}
