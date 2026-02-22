'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { useMode } from '@/contexts/ModeContext';
import { Category } from '@/lib/types';

export default function AddItemForm({
  category,
  onAdd,
}: {
  category: Category;
  onAdd: (title: string, note: string | null) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const { mode } = useMode();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), note.trim() || null);
    setTitle('');
    setNote('');
    setIsOpen(false);
  };

  return (
    <div>
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed py-3 text-sm font-medium transition-colors"
            style={{
              borderColor:
                mode === 'portugal'
                  ? 'rgba(27, 75, 138, 0.2)'
                  : 'rgba(220, 38, 38, 0.3)',
              color:
                mode === 'portugal'
                  ? 'rgba(27, 75, 138, 0.5)'
                  : 'rgba(220, 38, 38, 0.6)',
            }}
          >
            <Plus size={16} />
            {mode === 'portugal' ? 'Add item' : 'Add to the list'}
          </motion.button>
        ) : (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-xl p-4"
            style={{
              background:
                mode === 'portugal'
                  ? 'rgba(27, 75, 138, 0.05)'
                  : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${
                mode === 'portugal'
                  ? 'rgba(27, 75, 138, 0.15)'
                  : 'rgba(220, 38, 38, 0.2)'
              }`,
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <span
                className="text-sm font-medium"
                style={{
                  color: mode === 'portugal' ? '#1B4B8A' : '#DC2626',
                }}
              >
                New item
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded p-1 transition-colors hover:bg-black/5"
              >
                <X
                  size={14}
                  style={{
                    color: mode === 'portugal' ? '#8B7355' : '#666',
                  }}
                />
              </button>
            </div>
            <input
              type="text"
              placeholder={
                mode === 'portugal' ? 'What do you want to do?' : 'What do you want to do?'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              className="mb-2 w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors"
              style={{
                background:
                  mode === 'portugal' ? '#fff' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${
                  mode === 'portugal'
                    ? 'rgba(27, 75, 138, 0.2)'
                    : 'rgba(255,255,255,0.1)'
                }`,
                color: mode === 'portugal' ? '#2D2A26' : '#eee',
              }}
            />
            <input
              type="text"
              placeholder={
                'Note (optional)'
              }
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mb-3 w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors"
              style={{
                background:
                  mode === 'portugal' ? '#fff' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${
                  mode === 'portugal'
                    ? 'rgba(27, 75, 138, 0.2)'
                    : 'rgba(255,255,255,0.1)'
                }`,
                color: mode === 'portugal' ? '#2D2A26' : '#eee',
              }}
            />
            <button
              type="submit"
              disabled={!title.trim()}
              className="w-full rounded-lg py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
              style={{
                background: mode === 'portugal' ? '#1B4B8A' : '#DC2626',
              }}
            >
              {mode === 'portugal' ? 'Add' : 'Add it'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
