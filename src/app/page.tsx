'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMode } from '@/contexts/ModeContext';
import Providers from '@/components/Providers';
import Header from '@/components/Header';
import BucketList from '@/components/BucketList';
import MericaExperience from '@/components/MericaExperience';
import TopNav, { PortugalTab } from '@/components/TopNav';
import QuiosqueCounter from '@/components/QuiosqueCounter';
import SantosPopulares from '@/components/SantosPopulares';
import WorldCupSchedule from '@/components/WorldCupSchedule';

function TabContent({ tab }: { tab: PortugalTab }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25 }}
      >
        {tab === 'lista' && (
          <>
            <Header />
            <BucketList />
          </>
        )}
        {tab === 'quiosque' && <QuiosqueCounter />}
        {tab === 'festas' && <SantosPopulares />}
        {tab === 'copa' && <WorldCupSchedule />}
      </motion.div>
    </AnimatePresence>
  );
}

function AppContent() {
  const { mode } = useMode();
  const [activeTab, setActiveTab] = useState<PortugalTab>('lista');

  const isMerica = mode === 'merica';

  return (
    <div className="mode-transition relative min-h-dvh">
      {/* Portugal: Full-screen Lisbon background */}
      {!isMerica && (
        <>
          <div
            className="fixed inset-0 z-0"
            style={{
              backgroundImage: 'url(/images/lisbon-hero.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
            }}
          />
          {/* Warm gradient overlay for readability */}
          <div
            className="fixed inset-0 z-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,248,240,0.82) 0%, rgba(255,248,240,0.75) 40%, rgba(255,248,240,0.88) 100%)',
            }}
          />
          {/* Azulejo tile overlay */}
          <div className="azulejo-bg" />
        </>
      )}

      {/* Merica: Dark background */}
      {isMerica && (
        <div
          className="fixed inset-0 z-0"
          style={{ background: '#0A0A0A' }}
        />
      )}

      {/* Sticky top nav */}
      <div className="relative z-30">
        <TopNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Main content */}
      <div
        className="relative z-10 mx-auto max-w-lg px-4 py-4 sm:px-6"
        style={{ color: isMerica ? '#eee' : '#2D2A26' }}
      >
        {isMerica ? (
          <MericaExperience />
        ) : (
          <TabContent tab={activeTab} />
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
