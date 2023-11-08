import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';

import './globals.css';
import TurboLayout from '@/layout/turbo-layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Frontend Starter',
  description: 'the Frontend startkit',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TurboLayout>
          {children}
        </TurboLayout>
      </body>
    </html>
  );
}
