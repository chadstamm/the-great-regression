'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMode } from '@/contexts/ModeContext';
import { useUser } from '@/contexts/UserContext';
import { BucketItem as BucketItemType, Category, FilterStatus } from '@/lib/types';
import { CATEGORY_LABELS, MERICA_SUBTITLES } from '@/lib/constants';
import BucketItem from './BucketItem';
import AddItemForm from './AddItemForm';

export default function CategorySection({
  category,
  items,
  filter,
  onAdd,
  onToggleVote,
  onToggleDone,
  onRemove,
}: {
  category: Category;
  items: BucketItemType[];
  filter: FilterStatus;
  onAdd: (title: string, note: string | null) => void;
  onToggleVote: (item: BucketItemType) => void;
  onToggleDone: (item: BucketItemType) => void;
  onRemove: (id: string) => void;
}) {
  const { mode } = useMode();
  const { user } = useUser();

  const filteredItems = items.filter((item) => {
    if (filter === 'agreed') return item.votes.length >= 2 && !item.is_done;
    if (filter === 'done') return item.is_done;
    return true;
  });

  const label = CATEGORY_LABELS[category][mode];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <div className="mb-3">
        <h2
          className="text-lg font-bold"
          style={{
            color: mode === 'portugal' ? '#1B4B8A' : '#eee',
            fontFamily:
              mode === 'portugal' ? 'var(--font-display)' : 'var(--font-body)',
          }}
        >
          {label}
        </h2>
        {mode === 'merica' && (
          <p className="text-xs italic" style={{ color: '#DC2626' }}>
            {MERICA_SUBTITLES[category]}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {filteredItems.map((item) => (
            <BucketItem
              key={item.id}
              item={item}
              onToggleVote={() => onToggleVote(item)}
              onToggleDone={() => onToggleDone(item)}
              onRemove={() => onRemove(item.id)}
            />
          ))}
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <p
            className="py-4 text-center text-sm italic"
            style={{ color: mode === 'portugal' ? '#A89070' : '#555' }}
          >
            {mode === 'portugal'
              ? 'Nada aqui ainda...'
              : 'Nothing here yet... sad.'}
          </p>
        )}

        {user && <AddItemForm category={category} onAdd={onAdd} />}
      </div>
    </motion.section>
  );
}
