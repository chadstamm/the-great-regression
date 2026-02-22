'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowUpDown } from 'lucide-react';

type SortMode = 'date' | 'neighborhood';

interface Festival {
  id: string;
  name: string;
  neighborhood: string;
  location: string;
  dates: string;
  startDay: number;
  description: string;
}

const CONFIRMED_FESTIVALS: Festival[] = [
  {
    id: 'santo-antonio-eve',
    name: 'Noite de Santo António',
    neighborhood: 'Citywide',
    location: 'Avenida da Liberdade & citywide',
    dates: '12 June (evening)',
    startDay: 12,
    description: 'Marchas Populares parade, sardines everywhere, arraiais in every bairro. Lisbon\'s biggest party.',
  },
  {
    id: 'santo-antonio-feast',
    name: 'Dia de Santo António',
    neighborhood: 'Alfama',
    location: 'Alfama, Igreja de Santo António',
    dates: '13 June',
    startDay: 13,
    description: 'Lisbon\'s patron saint feast day. Mass weddings at the Sé cathedral, public holiday in Lisbon.',
  },
  {
    id: 'alfama',
    name: 'Arraial de Alfama',
    neighborhood: 'Alfama',
    location: 'Alfama — Largo de São Miguel, Rua de São Miguel',
    dates: '1–29 June',
    startDay: 1,
    description: 'The heart of Santos Populares. Dense, winding streets, most traditional atmosphere.',
  },
  {
    id: 'mouraria',
    name: 'Arraial da Mouraria',
    neighborhood: 'Mouraria',
    location: 'Mouraria — Largo da Severa, Rua do Capelão',
    dates: '1–29 June',
    startDay: 1,
    description: 'Multicultural, birthplace of fado. Diverse food from around the world alongside traditional Portuguese.',
  },
  {
    id: 'graca',
    name: 'Arraial da Graça',
    neighborhood: 'Graça',
    location: 'Graça — Vila Berta, Largo da Graça',
    dates: '1–29 June',
    startDay: 1,
    description: 'Great viewpoints, excellent food. Vila Berta arraial is intimate and beautifully decorated.',
  },
  {
    id: 'bica',
    name: 'Arraial da Bica',
    neighborhood: 'Bica',
    location: 'Bica — Rua da Bica de Duarte Belo',
    dates: '12–13 June',
    startDay: 12,
    description: 'Steep narrow streets near Elevador da Bica. Intimate, very local feel.',
  },
  {
    id: 'madragoa',
    name: 'Arraial da Madragoa',
    neighborhood: 'Madragoa',
    location: 'Madragoa — Rua das Madres',
    dates: '1–29 June',
    startDay: 1,
    description: 'Authentic, residential. Traditional food stalls run by local families. Old Lisbon at its best.',
  },
  {
    id: 'castelo',
    name: 'Arraial do Castelo',
    neighborhood: 'Castelo',
    location: 'Castelo — near São Jorge Castle walls',
    dates: '12–13 June',
    startDay: 12,
    description: 'Colorful garlands near the castle, stunning views over the city while you eat sardines.',
  },
  {
    id: 'bairro-alto',
    name: 'Arraial do Bairro Alto',
    neighborhood: 'Bairro Alto',
    location: 'Bairro Alto — Rua da Atalaia, Travessa da Cara',
    dates: '1–29 June',
    startDay: 1,
    description: 'Nightlife hub meets arraial energy. Younger crowd, bars spill into the streets.',
  },
  {
    id: 'campo-ourique',
    name: 'Arraial de Campo de Ourique',
    neighborhood: 'Campo de Ourique',
    location: 'Campo de Ourique — Rua Coelho da Rocha',
    dates: '12–13 June',
    startDay: 12,
    description: 'Family-friendly, slightly off the tourist circuit. Great for kids.',
  },
  {
    id: 'principe-real',
    name: 'Arraial do Príncipe Real',
    neighborhood: 'Príncipe Real',
    location: 'Príncipe Real — Jardim do Príncipe Real',
    dates: '12–13 June',
    startDay: 12,
    description: 'The trendy arraial — fado/folk fusion, creative cocktails, hipster crowd.',
  },
  {
    id: 'penha-franca',
    name: 'Arraial da Penha de França',
    neighborhood: 'Penha de França',
    location: 'Penha de França — Largo da Penha de França',
    dates: '12–13 June',
    startDay: 12,
    description: 'Very local neighborhood flavor, completely off the tourist radar.',
  },
  {
    id: 'sao-joao',
    name: 'São João',
    neighborhood: 'Citywide',
    location: 'Citywide (main event is in Porto)',
    dates: '23–24 June',
    startDay: 23,
    description: 'Porto\'s main celebration. Lisbon has smaller festivities — plastic hammers, bonfires, midnight revelry.',
  },
  {
    id: 'sao-pedro',
    name: 'São Pedro',
    neighborhood: 'Citywide',
    location: 'Citywide',
    dates: '28–29 June',
    startDay: 28,
    description: 'The final Santos Populares celebration. Smaller arraiais and the last sardines of the season.',
  },
];

const TRADITIONS = [
  { icon: '🐟', name: 'Sardinhas Assadas', desc: 'Grilled sardines on bread — the iconic festival food' },
  { icon: '🌿', name: 'Manjerico', desc: 'Small basil plant with a love poem — traditional gift' },
  { icon: '💃', name: 'Marchas Populares', desc: 'Choreographed neighborhood parade on Avenida da Liberdade' },
  { icon: '💒', name: 'Casamentos', desc: 'Mass weddings sponsored by the city on June 12' },
  { icon: '🎵', name: 'Pimba Music', desc: 'Up-tempo singalong Portuguese pop at every arraial' },
  { icon: '🥣', name: 'Caldo Verde', desc: 'Traditional kale soup, a festival staple' },
];

const STORAGE_KEY = 'santos-populares-checked';

function loadChecked(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function sortFestivals(festivals: Festival[], mode: SortMode): Festival[] {
  return [...festivals].sort((a, b) => {
    if (mode === 'date') return a.startDay - b.startDay;
    return a.neighborhood.localeCompare(b.neighborhood);
  });
}

export default function SantosPopulares() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [sortMode, setSortMode] = useState<SortMode>('date');

  useEffect(() => {
    setChecked(loadChecked());
  }, []);

  const toggleChecked = useCallback((id: string) => {
    setChecked((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const attendedCount = CONFIRMED_FESTIVALS.filter((f) => checked[f.id]).length;
  const sortedFestivals = sortFestivals(CONFIRMED_FESTIVALS, sortMode);

  return (
    <div className="flex flex-col gap-5">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 text-center"
        style={{
          background: 'rgba(255, 248, 240, 0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(196, 149, 58, 0.25)',
        }}
      >
        <p className="text-3xl">🐟🌿🎉</p>
        <h2
          className="mt-2 text-2xl font-bold sm:text-3xl"
          style={{ color: '#1B4B8A', fontFamily: 'var(--font-display)' }}
        >
          Santos Populares 2026
        </h2>
        <p
          className="mt-1 text-sm italic"
          style={{ color: '#C4953A', fontFamily: 'var(--font-display)' }}
        >
          Festas de Lisboa — Junho 2026
        </p>
        <p className="mt-3 text-xs" style={{ color: '#8B7355' }}>
          {attendedCount} of {CONFIRMED_FESTIVALS.length} attended
        </p>
      </motion.div>

      {/* Confirmed festivals checklist */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl p-5"
        style={{
          background: 'rgba(255, 248, 240, 0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(196, 149, 58, 0.2)',
        }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: '#1B4B8A', fontFamily: 'var(--font-display)' }}
          >
            Confirmed Festivals
          </h3>
          <div className="flex gap-1 rounded-lg p-0.5" style={{ background: 'rgba(27, 75, 138, 0.08)' }}>
            <button
              onClick={() => setSortMode('date')}
              className="relative flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors"
              style={{
                color: sortMode === 'date' ? '#fff' : '#1B4B8A',
                background: sortMode === 'date' ? '#1B4B8A' : 'transparent',
              }}
            >
              <ArrowUpDown size={10} />
              Date
            </button>
            <button
              onClick={() => setSortMode('neighborhood')}
              className="relative flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors"
              style={{
                color: sortMode === 'neighborhood' ? '#fff' : '#1B4B8A',
                background: sortMode === 'neighborhood' ? '#1B4B8A' : 'transparent',
              }}
            >
              <ArrowUpDown size={10} />
              Bairro
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {sortedFestivals.map((festival) => {
            const isChecked = !!checked[festival.id];
            return (
              <button
                key={festival.id}
                onClick={() => toggleChecked(festival.id)}
                className="flex items-start gap-3 rounded-xl px-3 py-3 text-left transition-all"
                style={{
                  background: isChecked
                    ? 'rgba(27, 75, 138, 0.08)'
                    : 'rgba(196, 149, 58, 0.04)',
                  border: isChecked
                    ? '1px solid rgba(27, 75, 138, 0.25)'
                    : '1px solid rgba(196, 149, 58, 0.1)',
                  opacity: isChecked ? 0.7 : 1,
                }}
              >
                {/* Checkbox */}
                <div
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors"
                  style={{
                    borderColor: isChecked ? '#1B4B8A' : 'rgba(27, 75, 138, 0.3)',
                    background: isChecked ? '#1B4B8A' : 'transparent',
                  }}
                >
                  {isChecked && <Check size={12} color="#fff" strokeWidth={3} />}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-sm font-semibold ${isChecked ? 'line-through' : ''}`}
                      style={{ color: '#1B4B8A' }}
                    >
                      {festival.name}
                    </p>
                    {sortMode === 'neighborhood' && (
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                        style={{
                          background: 'rgba(27, 75, 138, 0.08)',
                          color: '#1B4B8A',
                        }}
                      >
                        {festival.neighborhood}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs font-bold" style={{ color: '#C4953A' }}>
                    {festival.dates}
                  </p>
                  <p className="text-[11px]" style={{ color: '#8B7355' }}>
                    📍 {festival.location}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: '#6B5A3E' }}>
                    {festival.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Traditions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-5"
        style={{
          background: 'rgba(255, 248, 240, 0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(196, 149, 58, 0.2)',
        }}
      >
        <h3
          className="mb-4 text-sm font-semibold uppercase tracking-wider"
          style={{ color: '#1B4B8A', fontFamily: 'var(--font-display)' }}
        >
          Traditions
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {TRADITIONS.map((t) => (
            <div
              key={t.name}
              className="rounded-lg p-3 text-center"
              style={{
                background: 'rgba(196, 149, 58, 0.06)',
                border: '1px solid rgba(196, 149, 58, 0.1)',
              }}
            >
              <p className="text-xl">{t.icon}</p>
              <p className="mt-1 text-xs font-semibold" style={{ color: '#1B4B8A' }}>
                {t.name}
              </p>
              <p className="mt-0.5 text-[10px] leading-tight" style={{ color: '#8B7355' }}>
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Pimba Music Player */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl p-5"
        style={{
          background: 'rgba(255, 248, 240, 0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(196, 149, 58, 0.2)',
        }}
      >
        <h3
          className="mb-1 text-sm font-semibold uppercase tracking-wider"
          style={{ color: '#1B4B8A', fontFamily: 'var(--font-display)' }}
        >
          🎵 Pimba Soundtrack
        </h3>
        <p className="mb-3 text-[11px]" style={{ color: '#8B7355' }}>
          No arraial is complete without pimba blasting from every direction
        </p>
        <div className="overflow-hidden rounded-xl">
          <iframe
            src="https://open.spotify.com/embed/playlist/6opM0Y8o0gCP86EdJfCLb3?utm_source=generator"
            width="100%"
            height="352"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-xl"
          />
        </div>
      </motion.div>
    </div>
  );
}
