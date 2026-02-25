'use client';

// NOTE: This component is no longer used — replaced by WelcomeModal.tsx
// Kept for reference only. Safe to delete.

import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import { useMode } from '@/contexts/ModeContext';

export default function UserSelector() {
  const { user } = useUser();
  const { mode } = useMode();

  // Only render the modal overlay when no user is selected
  if (user) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background:
          mode === 'portugal'
            ? 'rgba(27, 75, 138, 0.95)'
            : 'rgba(10, 10, 10, 0.97)',
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="mx-4 w-full max-w-sm rounded-2xl p-8 text-center"
        style={{
          background: mode === 'portugal' ? '#FFF8F0' : '#1a1a1a',
          border:
            mode === 'portugal'
              ? '2px solid #C4953A'
              : '2px solid #DC2626',
        }}
      >
        <h2
          className="mb-2 text-2xl font-bold"
          style={{
            color: mode === 'portugal' ? '#1B4B8A' : '#DC2626',
            fontFamily: mode === 'portugal' ? 'var(--font-display)' : 'var(--font-body)',
          }}
        >
          {mode === 'portugal' ? 'Quem es tu?' : "Who's ready to regress?"}
        </h2>
        <p
          className="mb-6 text-sm"
          style={{
            color: mode === 'portugal' ? '#6B5A3E' : '#888',
          }}
        >
          This selector has been replaced by the Welcome Modal.
        </p>
      </motion.div>
    </motion.div>
  );
}
