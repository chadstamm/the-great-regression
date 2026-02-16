'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Heart, Star } from 'lucide-react';
import { useMode } from '@/contexts/ModeContext';
import { useUser } from '@/contexts/UserContext';
import { BucketItem as BucketItemType } from '@/lib/types';

export default function BucketItem({
  item,
  onToggleVote,
  onToggleDone,
  onRemove,
}: {
  item: BucketItemType;
  onToggleVote: () => void;
  onToggleDone: () => void;
  onRemove: () => void;
}) {
  const { mode } = useMode();
  const { user } = useUser();
  const [showConfirm, setShowConfirm] = useState(false);

  const hasVoted = user ? item.votes.includes(user) : false;
  const isAgreed = item.votes.length >= 2;
  const isDone = item.is_done;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: isDone ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="group relative rounded-xl px-4 py-3 transition-all"
      style={{
        background:
          mode === 'portugal'
            ? isDone
              ? 'rgba(27, 75, 138, 0.03)'
              : 'rgba(255, 255, 255, 0.7)'
            : isDone
              ? 'rgba(255, 255, 255, 0.02)'
              : 'rgba(255, 255, 255, 0.04)',
        border: `1px solid ${
          mode === 'portugal'
            ? isDone
              ? 'rgba(27, 75, 138, 0.08)'
              : 'rgba(27, 75, 138, 0.1)'
            : isDone
              ? 'rgba(255,255,255,0.03)'
              : 'rgba(255,255,255,0.06)'
        }`,
      }}
    >
      <div className="flex items-start gap-3">
        {/* Done toggle */}
        <button
          onClick={onToggleDone}
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors"
          style={{
            borderColor:
              mode === 'portugal'
                ? isDone
                  ? '#1B4B8A'
                  : 'rgba(27, 75, 138, 0.3)'
                : isDone
                  ? '#DC2626'
                  : 'rgba(255,255,255,0.2)',
            background: isDone
              ? mode === 'portugal'
                ? '#1B4B8A'
                : '#DC2626'
              : 'transparent',
          }}
        >
          {isDone && <Check size={12} color="#fff" strokeWidth={3} />}
        </button>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${isDone ? 'line-through' : ''}`}
              style={{
                color:
                  mode === 'portugal'
                    ? isDone
                      ? '#8B7355'
                      : '#2D2A26'
                    : isDone
                      ? '#555'
                      : '#eee',
              }}
            >
              {item.title}
            </span>

            {/* Agreed badge */}
            <AnimatePresence>
              {isAgreed && !isDone && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    background:
                      mode === 'portugal'
                        ? 'rgba(196, 149, 58, 0.15)'
                        : 'rgba(220, 38, 38, 0.15)',
                    color: mode === 'portugal' ? '#C4953A' : '#FBBF24',
                  }}
                >
                  <Star size={10} />
                  {mode === 'portugal'
                    ? 'Combinado!'
                    : 'Bipartisan Agreement Reached'}
                </motion.span>
              )}
              {isDone && (
                <motion.span
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: -6 }}
                  className="inline-flex shrink-0 items-center gap-1 rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-wider"
                  style={{
                    background:
                      mode === 'portugal'
                        ? 'rgba(27, 75, 138, 0.1)'
                        : 'rgba(220, 38, 38, 0.2)',
                    color: mode === 'portugal' ? '#1B4B8A' : '#DC2626',
                    border: `1px solid ${
                      mode === 'portugal'
                        ? 'rgba(27, 75, 138, 0.2)'
                        : 'rgba(220, 38, 38, 0.3)'
                    }`,
                  }}
                >
                  {mode === 'portugal' ? 'Feito!' : 'MISSION ACCOMPLISHED'}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {item.note && (
            <p
              className="mt-0.5 text-xs"
              style={{
                color: mode === 'portugal' ? '#8B7355' : '#666',
              }}
            >
              {item.note}
            </p>
          )}

          <div className="mt-1.5 flex items-center gap-3">
            <span
              className="text-[11px]"
              style={{
                color: mode === 'portugal' ? '#A89070' : '#555',
              }}
            >
              {item.added_by}
            </span>

            {/* Vote count */}
            {item.votes.length > 0 && (
              <span
                className="text-[11px]"
                style={{
                  color: mode === 'portugal' ? '#C4953A' : '#FBBF24',
                }}
              >
                {item.votes.join(', ')} voted
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1.5">
          {/* Vote button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={onToggleVote}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
            style={{
              background: hasVoted
                ? mode === 'portugal'
                  ? 'rgba(196, 149, 58, 0.15)'
                  : 'rgba(251, 191, 36, 0.15)'
                : 'transparent',
            }}
            title={hasVoted ? 'Remove vote' : 'Vote'}
          >
            <Heart
              size={16}
              fill={hasVoted ? (mode === 'portugal' ? '#C4953A' : '#FBBF24') : 'none'}
              color={
                hasVoted
                  ? mode === 'portugal'
                    ? '#C4953A'
                    : '#FBBF24'
                  : mode === 'portugal'
                    ? 'rgba(27, 75, 138, 0.3)'
                    : 'rgba(255,255,255,0.2)'
              }
            />
          </motion.button>

          {/* Remove button */}
          <AnimatePresence>
            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="flex h-8 w-8 items-center justify-center rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
                title={mode === 'portugal' ? 'Remover' : 'Deport from the list'}
              >
                <X
                  size={14}
                  color={mode === 'portugal' ? '#8B7355' : '#666'}
                />
              </button>
            ) : (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={() => {
                  onRemove();
                  setShowConfirm(false);
                }}
                className="rounded-lg px-2 py-1 text-[11px] font-bold text-white"
                style={{
                  background: mode === 'portugal' ? '#B91C1C' : '#DC2626',
                }}
              >
                {mode === 'portugal' ? 'Remover?' : 'Deport?'}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
