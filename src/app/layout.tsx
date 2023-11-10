import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { PrimeReactProvider } from 'primereact/api';
import React from 'react';

import TurboLayout from '@/layout/turbo-layout';

// primereact style
import 'primereact/resources/themes/saga-purple/theme.css';
// import 'primereact/resources/themes/lara-light-indigo/theme.css';   // theme
import 'primeflex/primeflex.css';                                   // css utility
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
// global style
import './globals.css';

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
        <PrimeReactProvider>
          <TurboLayout>
            {children}
          </TurboLayout>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
