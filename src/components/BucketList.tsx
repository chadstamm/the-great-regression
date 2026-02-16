'use client';

import { useState } from 'react';
import { useMode } from '@/contexts/ModeContext';
import { useUser } from '@/contexts/UserContext';
import { useBucketItems } from '@/hooks/useBucketItems';
import { CATEGORIES } from '@/lib/constants';
import { FilterStatus } from '@/lib/types';
import StatusFilter from './StatusFilter';
import CategorySection from './CategorySection';

export default function BucketList() {
  const { mode } = useMode();
  const { user } = useUser();
  const { items, loading, addItem, toggleVote, toggleDone, removeItem } =
    useBucketItems();
  const [filter, setFilter] = useState<FilterStatus>('all');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
          style={{
            borderColor:
              mode === 'portugal'
                ? '#1B4B8A transparent #1B4B8A #1B4B8A'
                : '#DC2626 transparent #DC2626 #DC2626',
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-center">
        <StatusFilter active={filter} onChange={setFilter} />
      </div>

      {CATEGORIES.map((category) => {
        const categoryItems = items.filter((i) => i.category === category);
        return (
          <CategorySection
            key={category}
            category={category}
            items={categoryItems}
            filter={filter}
            onAdd={(title, note) => {
              if (user) addItem(category, title, note, user);
            }}
            onToggleVote={(item) => {
              if (user) toggleVote(item, user);
            }}
            onToggleDone={(item) => toggleDone(item)}
            onRemove={(id) => removeItem(id)}
          />
        );
      })}
    </div>
  );
}
