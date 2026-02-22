'use client';

import { motion } from 'framer-motion';

interface SaintDay {
  saint: string;
  feastDay: string;
  eveNight: string;
  description: string;
}

const SAINT_DAYS: SaintDay[] = [
  {
    saint: 'Santo António',
    feastDay: '13 de Junho, 2026',
    eveNight: '12 de Junho, 2026',
    description:
      'Lisbon\'s patron saint — the biggest night of the year. Marchas Populares parade on Avenida da Liberdade, grilled sardines everywhere, and arraiais in every neighborhood.',
  },
  {
    saint: 'São João',
    feastDay: '24 de Junho, 2026',
    eveNight: '23 de Junho, 2026',
    description:
      'Porto\'s main celebration, but Lisbon has smaller festivities too. Plastic hammers, bonfires, and midnight revelry.',
  },
  {
    saint: 'São Pedro',
    feastDay: '29 de Junho, 2026',
    eveNight: '28 de Junho, 2026',
    description:
      'The final Santos Populares celebration. Smaller arraiais and the last sardines of the season.',
  },
];

const KEY_NEIGHBORHOODS = [
  { name: 'Alfama', vibe: 'The heart of it all — dense, winding streets, the most traditional atmosphere' },
  { name: 'Mouraria', vibe: 'Multicultural, birthplace of fado, diverse food from around the world' },
  { name: 'Graça', vibe: 'Great viewpoints, excellent food, Vila Berta arraial' },
  { name: 'Bica', vibe: 'Steep narrow streets near Elevador da Bica, intimate local feel' },
  { name: 'Madragoa', vibe: 'Authentic, residential, traditional food stalls by local families' },
  { name: 'Castelo', vibe: 'Colorful garlands near the castle walls, stunning views' },
  { name: 'Bairro Alto', vibe: 'Nightlife hub meets arraial energy, younger crowd' },
  { name: 'Campo de Ourique', vibe: 'Family-friendly, slightly off the tourist circuit' },
  { name: 'Príncipe Real', vibe: 'The "hipster arraial" — fado/folk fusion, trendy crowd' },
  { name: 'Penha de França', vibe: 'Very local neighborhood flavor, off the tourist radar' },
];

const TRADITIONS = [
  { icon: '🐟', name: 'Sardinhas Assadas', desc: 'Grilled sardines on bread — the iconic festival food' },
  { icon: '🌿', name: 'Manjerico', desc: 'Small basil plant with a love poem — traditional gift' },
  { icon: '💃', name: 'Marchas Populares', desc: 'Choreographed neighborhood parade on Avenida da Liberdade' },
  { icon: '💒', name: 'Casamentos', desc: 'Mass weddings sponsored by the city on June 12' },
  { icon: '🎵', name: 'Pimba Music', desc: 'Up-tempo singalong Portuguese pop at every arraial' },
  { icon: '🥣', name: 'Caldo Verde', desc: 'Traditional kale soup, a festival staple' },
];

export default function SantosPopulares() {
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
      </motion.div>

      {/* Coming Soon notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl p-5 text-center"
        style={{
          background: 'rgba(27, 75, 138, 0.08)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(27, 75, 138, 0.2)',
        }}
      >
        <p className="text-sm font-medium" style={{ color: '#1B4B8A' }}>
          📋 Full 2026 arraial schedule — <strong>Coming Soon</strong>
        </p>
        <p className="mt-1 text-xs" style={{ color: '#8B7355' }}>
          EGEAC typically publishes the full neighborhood-by-neighborhood program in April/May 2026.
          Check back closer to June, or visit{' '}
          <span style={{ color: '#1B4B8A', fontWeight: 600 }}>egeac.pt</span> for the official schedule.
        </p>
      </motion.div>

      {/* Saint Days */}
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
          🎆 Key Dates
        </h3>
        <div className="flex flex-col gap-4">
          {SAINT_DAYS.map((day, i) => (
            <div
              key={day.saint}
              className="rounded-xl p-4"
              style={{
                background: i === 0 ? 'rgba(196, 149, 58, 0.12)' : 'rgba(196, 149, 58, 0.05)',
                border: i === 0 ? '1px solid rgba(196, 149, 58, 0.3)' : '1px solid rgba(196, 149, 58, 0.1)',
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold" style={{ color: '#1B4B8A' }}>
                    {day.saint}
                  </h4>
                  <p className="text-xs font-medium" style={{ color: '#C4953A' }}>
                    Feast: {day.feastDay}
                  </p>
                  <p className="text-[10px]" style={{ color: '#8B7355' }}>
                    Main party night: {day.eveNight}
                  </p>
                </div>
                {i === 0 && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                    style={{ background: '#C4953A', color: '#fff' }}
                  >
                    Peak
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs leading-relaxed" style={{ color: '#6B5A3E' }}>
                {day.description}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Neighborhoods */}
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
          className="mb-4 text-sm font-semibold uppercase tracking-wider"
          style={{ color: '#1B4B8A', fontFamily: 'var(--font-display)' }}
        >
          📍 Arraial Neighborhoods
        </h3>
        <div className="flex flex-col gap-2">
          {KEY_NEIGHBORHOODS.map((n) => (
            <div
              key={n.name}
              className="flex items-start gap-3 rounded-lg px-3 py-2.5"
              style={{
                background: 'rgba(196, 149, 58, 0.06)',
                border: '1px solid rgba(196, 149, 58, 0.1)',
              }}
            >
              <span className="mt-0.5 text-sm">🏘️</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#1B4B8A' }}>
                  {n.name}
                </p>
                <p className="text-xs" style={{ color: '#8B7355' }}>
                  {n.vibe}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Traditions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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
          🇵🇹 Traditions
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
    </div>
  );
}
