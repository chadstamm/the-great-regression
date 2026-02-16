'use client';

import { motion } from 'framer-motion';
import { useMode } from '@/contexts/ModeContext';
import { FilterStatus } from '@/lib/types';

const FILTERS: { key: FilterStatus; label: Record<string, string> }[] = [
  { key: 'all', label: { portugal: 'Todos', merica: 'All', uk: 'All' } },
  { key: 'agreed', label: { portugal: 'Combinado', merica: 'Agreed', uk: 'Agreed' } },
  { key: 'done', label: { portugal: 'Feito', merica: 'Done', uk: 'Done' } },
];

export default function StatusFilter({
  active,
  onChange,
}: {
  active: FilterStatus;
  onChange: (f: FilterStatus) => void;
}) {
  const { mode } = useMode();

  return (
    <div className="flex gap-1 rounded-lg p-1" style={{
      background: mode === 'portugal' ? 'rgba(27, 75, 138, 0.08)' : 'rgba(255,255,255,0.05)',
    }}>
      {FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className="relative rounded-md px-4 py-1.5 text-sm font-medium transition-colors"
          style={{
            color:
              active === f.key
                ? mode === 'portugal'
                  ? '#fff'
                  : '#000'
                : mode === 'portugal'
                  ? '#1B4B8A'
                  : '#888',
          }}
        >
          {active === f.key && (
            <motion.div
              layoutId="filter-bg"
              className="absolute inset-0 rounded-md"
              style={{
                background: mode === 'portugal' ? '#1B4B8A' : '#FBBF24',
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{f.label[mode]}</span>
        </button>
      ))}
    </div>
  );
}
