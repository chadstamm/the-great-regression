'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useMode } from '@/contexts/ModeContext';

export default function Header() {
  const { mode } = useMode();

  return (
    <header className="mb-6 pt-4">
      <AnimatePresence mode="wait">
        {mode === 'portugal' && (
          <motion.div
            key="portugal-header"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-md overflow-hidden rounded-xl"
              style={{
                boxShadow: '0 4px 24px rgba(27, 75, 138, 0.12)',
              }}
            >
              <Image
                src="/images/header-azulejo.jpg"
                alt="Cada Minuto Conta — Portugal Bucket List 2026"
                width={800}
                height={600}
                className="h-auto w-full"
                priority
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
