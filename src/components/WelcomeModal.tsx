'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import { USER_ICONS } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

export default function WelcomeModal() {
  const { showWelcome, createUser } = useUser();
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [takenIcons, setTakenIcons] = useState<Map<string, string>>(new Map());

  // Fetch icons already claimed by existing users
  useEffect(() => {
    if (!showWelcome) return;

    async function fetchTakenIcons() {
      if (!supabase) return;
      const { data } = await supabase.from('users').select('icon, name');
      if (data) {
        const taken = new Map(data.map((u: { icon: string; name: string }) => [u.icon, u.name]));
        setTakenIcons(taken);
        // If current selection is taken, pick the first available
        const firstAvailable = USER_ICONS.find((i) => !taken.has(i.id));
        setSelectedIcon(firstAvailable?.id || 'caravel');
      }
    }

    fetchTakenIcons();
  }, [showWelcome]);

  // Default to first available icon when takenIcons loads
  useEffect(() => {
    if (!selectedIcon) {
      const firstAvailable = USER_ICONS.find((i) => !takenIcons.has(i.id));
      setSelectedIcon(firstAvailable?.id || USER_ICONS[0].id);
    }
  }, [takenIcons, selectedIcon]);

  if (!showWelcome) return null;

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    await createUser(name.trim(), selectedIcon);
    setSubmitting(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: 'rgba(27, 75, 138, 0.95)' }}
      >
        {/* Azulejo pattern overlay */}
        <div
          className="azulejo-header-pattern pointer-events-none absolute inset-0"
          style={{ opacity: 0.08 }}
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 20 }}
          className="mx-4 w-full max-w-sm overflow-hidden rounded-2xl"
          style={{
            background: '#FFF8F0',
            border: '2px solid rgba(196, 149, 58, 0.4)',
          }}
        >
          {/* Header */}
          <div
            className="px-6 pb-4 pt-8 text-center"
            style={{
              background: 'linear-gradient(180deg, rgba(27,75,138,0.06) 0%, transparent 100%)',
            }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mb-1 text-2xl font-bold"
              style={{
                color: '#1B4B8A',
                fontFamily: 'var(--font-display)',
              }}
            >
              Bem-vindo!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-sm"
              style={{ color: '#6B5A3E' }}
            >
              Choose your name and icon to join the list
            </motion.p>
          </div>

          {/* Form */}
          <div className="px-6 pb-6">
            {/* Name input */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-5"
            >
              <label
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
                style={{ color: '#1B4B8A' }}
              >
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                autoFocus
                maxLength={20}
                className="w-full rounded-xl px-4 py-3 text-base outline-none transition-all"
                style={{
                  background: '#fff',
                  border: '2px solid rgba(27, 75, 138, 0.15)',
                  color: '#2D2A26',
                  fontFamily: 'var(--font-body)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1B4B8A';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(27, 75, 138, 0.15)';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && name.trim()) handleSubmit();
                }}
              />
            </motion.div>

            {/* Icon selector */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <label
                className="mb-2 block text-xs font-semibold uppercase tracking-wider"
                style={{ color: '#1B4B8A' }}
              >
                Pick Your Icon
              </label>
              <div className="grid grid-cols-4 gap-2">
                {USER_ICONS.map((icon) => {
                  const isTaken = takenIcons.has(icon.id);
                  const isSelected = selectedIcon === icon.id;

                  return (
                    <button
                      key={icon.id}
                      onClick={() => !isTaken && setSelectedIcon(icon.id)}
                      disabled={isTaken}
                      className="relative flex flex-col items-center gap-1 rounded-xl p-2.5 transition-all"
                      style={{
                        background: isTaken
                          ? 'rgba(0, 0, 0, 0.03)'
                          : isSelected
                            ? 'rgba(27, 75, 138, 0.1)'
                            : 'rgba(27, 75, 138, 0.02)',
                        border: `2px solid ${
                          isTaken
                            ? 'rgba(0, 0, 0, 0.06)'
                            : isSelected
                              ? '#1B4B8A'
                              : 'rgba(27, 75, 138, 0.08)'
                        }`,
                        transform: isSelected && !isTaken ? 'scale(1.05)' : 'scale(1)',
                        opacity: isTaken ? 0.35 : 1,
                        cursor: isTaken ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <div className="flex h-10 w-10 items-center justify-center">
                        <img
                          src={`/images/icons/${icon.file}`}
                          alt={icon.label}
                          className="h-9 w-9 object-contain"
                          style={isTaken ? { filter: 'grayscale(1)' } : undefined}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.textContent = fallbackEmoji(icon.id);
                              parent.style.fontSize = '24px';
                            }
                          }}
                        />
                      </div>
                      <span
                        className="text-[9px] font-medium leading-tight"
                        style={{
                          color: isTaken
                            ? '#aaa'
                            : isSelected
                              ? '#1B4B8A'
                              : '#8B7355',
                        }}
                      >
                        {isTaken ? takenIcons.get(icon.id) : icon.label}
                      </span>
                      {isSelected && !isTaken && (
                        <motion.div
                          layoutId="icon-ring"
                          className="absolute inset-0 rounded-xl"
                          style={{
                            border: '2px solid #1B4B8A',
                            boxShadow: '0 0 0 2px rgba(27,75,138,0.15)',
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Submit button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={!name.trim() || submitting}
              className="w-full rounded-xl py-3.5 text-base font-bold text-white transition-all disabled:opacity-40"
              style={{
                background: 'linear-gradient(135deg, #1B4B8A 0%, #2A6BC4 100%)',
                boxShadow: '0 4px 12px rgba(27, 75, 138, 0.3)',
                fontFamily: 'var(--font-display)',
              }}
            >
              {submitting ? 'Creating...' : "Let's Go"}
            </motion.button>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function fallbackEmoji(iconId: string): string {
  const map: Record<string, string> = {
    caravel: '\u26F5',
    armillary: '\uD83C\uDF10',
    tram: '\uD83D\uDE8B',
    sardine: '\uD83D\uDC1F',
    rooster: '\uD83D\uDC13',
    guitar: '\uD83C\uDFB8',
    heart: '\u2764\uFE0F',
    cross: '\u271D\uFE0F',
  };
  return map[iconId] || '\u2B50';
}
