import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { PrimeReactProvider } from 'primereact/api';
import React from 'react';

import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/saga-purple/theme.css';
// import 'primereact/resources/themes/lara-dark-purple/theme.css';
import '../style/turbo-theme.css';
import '../style/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Report',
  description: 'the Frontend startkit',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={inter.className}>
        <PrimeReactProvider>
          {children}
        </PrimeReactProvider>
      </body>
    </html>
  );
}
