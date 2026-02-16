'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMode } from '@/contexts/ModeContext';
import { AppMode } from '@/lib/types';

const MODE_CONFIG: Record<AppMode, { flag: string; label: string; bg: string }> = {
  portugal: { flag: '🇵🇹', label: 'Portugal', bg: '#1B4B8A' },
  merica: { flag: '🇺🇸', label: "'Merica", bg: '#DC2626' },
  uk: { flag: '🇬🇧', label: 'UK', bg: '#1a1a2e' },
};

const MODE_ORDER: AppMode[] = ['portugal', 'merica', 'uk'];

export default function ModeToggle() {
  const { mode, setMode } = useMode();
  const config = MODE_CONFIG[mode];

  const cycleMode = () => {
    const currentIndex = MODE_ORDER.indexOf(mode);
    const nextIndex = (currentIndex + 1) % MODE_ORDER.length;
    const next = MODE_ORDER[nextIndex];
    // Skip UK for now
    if (next === 'uk') {
      setMode('portugal');
    } else {
      setMode(next);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Main cycle button */}
      <button
        onClick={cycleMode}
        className="relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all"
        style={{
          background: config.bg,
          color: '#fff',
          boxShadow: `0 2px 12px ${config.bg}44`,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={mode}
            initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5"
          >
            <span className="text-base">{config.flag}</span>
            {config.label}
          </motion.span>
        </AnimatePresence>
      </button>

      {/* UK pill - grayed out teaser */}
      <div className="group relative">
        <button
          disabled
          className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium opacity-25 cursor-not-allowed"
          style={{
            background: mode === 'portugal' ? '#1B4B8A' : mode === 'merica' ? '#333' : '#1a1a2e',
            color: '#fff',
          }}
        >
          🇬🇧
        </button>
        <span className="absolute -bottom-7 right-0 whitespace-nowrap rounded bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
          Coming soon
        </span>
      </div>
    </div>
  );
}
