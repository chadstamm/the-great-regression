'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SNARK_BANNERS, DEPARTURE_DATE } from '@/lib/constants';

function getDaysLeft(): number {
  const now = new Date();
  const diff = DEPARTURE_DATE.getTime() - now.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export default function AmericaSnark() {
  const [index, setIndex] = useState(0);
  const daysLeft = getDaysLeft();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SNARK_BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const banner = SNARK_BANNERS[index].replace('X', String(daysLeft));

  return (
    <div
      className="overflow-hidden rounded-lg px-4 py-3 text-center"
      style={{
        background: 'linear-gradient(90deg, #DC2626 0%, #991B1B 100%)',
        border: '1px solid #FBBF24',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-sm font-bold sm:text-base"
          style={{ color: '#FBBF24' }}
        >
          {banner}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
