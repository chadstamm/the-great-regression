'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AzulejoPageBannerProps {
  title: string;
  subtitle?: string;
  emoji?: string;
  children?: ReactNode;
}

export default function AzulejoPageBanner({
  title,
  subtitle,
  emoji,
  children,
}: AzulejoPageBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-xl"
      style={{
        boxShadow: '0 4px 24px rgba(27, 75, 138, 0.15)',
      }}
    >
      {/* Blue gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(145deg, #163F73 0%, #1B4B8A 35%, #1F5599 65%, #1B4B8A 100%)',
        }}
      />

      {/* Azulejo tile pattern overlay — white on blue */}
      <div className="absolute inset-0 azulejo-header-pattern" />

      {/* Gold accent line at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{
          background: 'linear-gradient(90deg, transparent, #C4953A, transparent)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 px-6 py-8 text-center">
        {emoji && <p className="mb-1 text-3xl">{emoji}</p>}
        <h2
          className="text-2xl font-bold sm:text-3xl"
          style={{ color: '#ffffff', fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className="mt-1 text-sm italic"
            style={{ color: '#C4953A', fontFamily: 'var(--font-display)' }}
          >
            {subtitle}
          </p>
        )}
        {children && <div className="mt-3">{children}</div>}
      </div>
    </motion.div>
  );
}
