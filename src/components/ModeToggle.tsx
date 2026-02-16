'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMode } from '@/contexts/ModeContext';

export default function ModeToggle() {
  const { mode, setMode } = useMode();

  const toggle = () => {
    setMode(mode === 'portugal' ? 'merica' : 'portugal');
  };

  // In Portugal mode: show "'Merica Mode" button (switch TO merica)
  // In Merica mode: show "Back to Portugal" button (switch TO portugal)
  const isPortugal = mode === 'portugal';

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggle}
        className="relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all active:scale-95"
        style={{
          background: isPortugal ? '#DC2626' : '#1B4B8A',
          color: '#fff',
          boxShadow: isPortugal
            ? '0 2px 16px rgba(220, 38, 38, 0.35)'
            : '0 2px 16px rgba(27, 75, 138, 0.35)',
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
            {isPortugal ? (
              <>🇺🇸 &apos;Merica Mode</>
            ) : (
              <>🇵🇹 Portugal Mode</>
            )}
          </motion.span>
        </AnimatePresence>
      </button>

      {/* UK pill - grayed out teaser */}
      <div className="group relative">
        <button
          disabled
          className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium opacity-25 cursor-not-allowed"
          style={{
            background: isPortugal ? '#1a1a2e' : '#333',
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
