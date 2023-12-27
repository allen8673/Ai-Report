'use client'
import React from 'react';

import TurboLayout from '@/layout/turbo-layout';

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TurboLayout >
      {children}
    </TurboLayout>
  );
}
