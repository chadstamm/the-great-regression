'use client';

import { ReactNode } from 'react';
import { ModeProvider } from '@/contexts/ModeContext';
import { UserProvider } from '@/contexts/UserContext';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ModeProvider>
      <UserProvider>{children}</UserProvider>
    </ModeProvider>
  );
}
