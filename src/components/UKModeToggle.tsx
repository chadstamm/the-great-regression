'use client';

export default function UKModeToggle() {
  return (
    <div className="group relative">
      <button
        disabled
        className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium opacity-30 cursor-not-allowed"
        style={{
          background: '#1a1a2e',
          color: '#888',
          border: '1px solid #333',
        }}
        aria-label="UK Mode — coming soon"
      >
        🇬🇧 UK Mode
      </button>
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-neutral-800 px-2 py-1 text-xs text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
        Coming soon
      </span>
    </div>
  );
}
