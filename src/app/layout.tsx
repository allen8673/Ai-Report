import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { PrimeReactProvider } from 'primereact/api';
import React from 'react';

import TurboLayout from '@/layout/turbo-layout';

import 'primeflex/primeflex.css';                                   // css utility
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import '../style/turbo-theme.css';
import '../style/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Report',
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
        <PrimeReactProvider>
          <TurboLayout>
            {children}
          </TurboLayout>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
