import { auth } from '@settings/auth';
import { SessionProvider } from 'next-auth/react';
import React from 'react';

import TurboLayout from '@/layout/turbo-layout';

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <TurboLayout >
        {children}
      </TurboLayout>
    </SessionProvider>
  );
}
