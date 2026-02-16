'use client';

import { useMode } from '@/contexts/ModeContext';
import Providers from '@/components/Providers';
import Header from '@/components/Header';
import BucketList from '@/components/BucketList';
import MericaExperience from '@/components/MericaExperience';
import ModeToggle from '@/components/ModeToggle';
import UserSelector from '@/components/UserSelector';

function AppContent() {
  const { mode } = useMode();

  const bg =
    mode === 'portugal'
      ? '#FFF8F0'
      : mode === 'merica'
        ? '#0A0A0A'
        : '#FFF8F0';
  const fg =
    mode === 'portugal'
      ? '#2D2A26'
      : mode === 'merica'
        ? '#eee'
        : '#2D2A26';

  return (
    <div
      className="mode-transition min-h-dvh"
      style={{ background: bg, color: fg }}
    >
      {mode === 'portugal' && <div className="azulejo-bg" />}
      <div className="relative z-10 mx-auto max-w-lg px-4 py-6 sm:px-6">
        {mode === 'merica' ? (
          <>
            {/* Merica has its own header layout */}
            <div className="mb-6 flex items-center justify-between">
              <UserSelector />
              <ModeToggle />
            </div>
            <MericaExperience />
          </>
        ) : (
          <>
            <Header />
            <BucketList />
          </>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Providers>
      <AppContent />
    </Providers>
  );
}
