'use client';

import { motion } from 'framer-motion';
import { useMode } from '@/contexts/ModeContext';

export type PortugalTab = 'lista' | 'quiosque' | 'festas' | 'copa';

interface TopNavProps {
  activeTab: PortugalTab;
  onTabChange: (tab: PortugalTab) => void;
}

const PORTUGAL_TABS: { id: PortugalTab; icon: string; label: string }[] = [
  { id: 'lista', icon: '🏠', label: 'LISTA' },
  { id: 'quiosque', icon: '☕', label: 'QUIOSQUE' },
  { id: 'festas', icon: '🎉', label: 'FESTAS' },
  { id: 'copa', icon: '⚽', label: 'COPA' },
];

export default function TopNav({ activeTab, onTabChange }: TopNavProps) {
  const { mode, setMode } = useMode();
  const isPortugal = mode === 'portugal';

  const switchMode = () => setMode(isPortugal ? 'merica' : 'portugal');

  return (
    <nav className="sticky top-0 z-40 w-full">
      {/* Blue tab bar at the very top */}
      <div
        style={{
          background: isPortugal ? '#1B4B8A' : '#0A0A0A',
          borderBottom: isPortugal
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(220, 38, 38, 0.3)',
        }}
      >
        <div className="mx-auto max-w-lg px-2">
          <div className="flex items-center gap-0">
            {isPortugal ? (
              PORTUGAL_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className="relative flex flex-1 items-center justify-center gap-1 py-3 text-sm font-black tracking-wide transition-colors sm:text-base"
                  style={{
                    color:
                      activeTab === tab.id
                        ? '#fff'
                        : 'rgba(255, 255, 255, 0.45)',
                  }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-3 right-3 h-[3px] rounded-full"
                      style={{ background: '#C4953A' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))
            ) : (
              <div className="flex-1 py-3" />
            )}
          </div>
        </div>
      </div>

      {/* Mode switch row underneath */}
      <div
        style={{
          background: isPortugal
            ? 'rgba(255, 248, 240, 0.72)'
            : 'rgba(10, 10, 10, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: isPortugal
            ? '1px solid rgba(196, 149, 58, 0.15)'
            : '1px solid rgba(220, 38, 38, 0.2)',
        }}
      >
        <div className="mx-auto flex max-w-lg items-center justify-center px-3 py-2">
          <button
            onClick={switchMode}
            className="flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all"
            style={
              isPortugal
                ? {
                    background: 'rgba(27, 75, 138, 0.08)',
                    color: 'rgba(45, 42, 38, 0.55)',
                    border: '1px solid rgba(27, 75, 138, 0.15)',
                  }
                : {
                    background: 'rgba(220, 38, 38, 0.12)',
                    color: '#FBBF24',
                    border: '1px solid rgba(220, 38, 38, 0.4)',
                    boxShadow: '0 0 12px rgba(220, 38, 38, 0.15)',
                  }
            }
          >
            {/* Toggle track */}
            <div
              className="relative h-5 w-9 rounded-full"
              style={{
                background: isPortugal
                  ? 'rgba(27, 75, 138, 0.2)'
                  : 'rgba(220, 38, 38, 0.5)',
              }}
            >
              <motion.div
                className="absolute top-0.5 h-4 w-4 rounded-full"
                animate={{ left: isPortugal ? 2 : 18 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{
                  background: isPortugal ? '#1B4B8A' : '#FBBF24',
                }}
              />
            </div>
            <span>
              {isPortugal
                ? "Switch to 'Merica Mode"
                : 'Move Back Home to Portugal Mode'}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
