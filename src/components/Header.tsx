'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useMode } from '@/contexts/ModeContext';
import ModeToggle from './ModeToggle';
import UserSelector from './UserSelector';

export default function Header() {
  const { mode } = useMode();

  return (
    <header className="mb-6">
      {/* Top bar */}
      <div className="mb-4 flex items-center justify-between">
        <UserSelector />
        <ModeToggle />
      </div>

      {/* Portugal hero */}
      <AnimatePresence mode="wait">
        {mode === 'portugal' && (
          <motion.div
            key="portugal-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Hero image */}
            <div className="relative mb-5 overflow-hidden rounded-2xl">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src="/images/lisbon-hero.jpg"
                  alt="Lisbon at golden hour"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 512px"
                  priority
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(0deg, rgba(255,248,240,0.95) 0%, rgba(255,248,240,0.4) 30%, transparent 60%)',
                  }}
                />
              </div>
              {/* Title overlaid on hero */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h1
                  className="text-3xl font-bold sm:text-4xl"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: '#1B4B8A',
                  }}
                >
                  Cada Minuto Conta
                </h1>
                <p
                  className="mt-0.5 text-sm"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    color: '#C4953A',
                  }}
                >
                  Every minute counts
                </p>
              </div>
            </div>

            {/* Small azulejo accent strip */}
            <div className="relative mb-2 overflow-hidden rounded-xl" style={{ height: 48 }}>
              <Image
                src="/images/azulejo.jpg"
                alt="Azulejo tiles"
                fill
                className="object-cover"
                sizes="512px"
                style={{ opacity: 0.3 }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <p
                  className="text-xs font-medium tracking-[0.15em] uppercase"
                  style={{ color: '#1B4B8A', fontFamily: 'var(--font-display)' }}
                >
                  A lista de desejos antes de partir
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
