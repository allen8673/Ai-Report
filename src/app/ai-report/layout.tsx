import React from 'react';

import TurboLayout from '@/layout/turbo-layout';

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TurboLayout>
      {children}
    </TurboLayout>
  );
}
