'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowUpDown } from 'lucide-react';
import Image from 'next/image';
import { useUser } from '@/contexts/UserContext';
import { useChecklistSync } from '@/hooks/useChecklistSync';

type SortMode = 'name' | 'neighborhood';

interface Miradouro {
  id: string;
  name: string;
  neighborhood: string;
  description: string;
}

const MIRADOUROS: Miradouro[] = [
  // Alfama
  {
    id: 'miradouro-santa-luzia',
    name: 'Miradouro de Santa Luzia',
    neighborhood: 'Alfama',
    description:
      'A tile-adorned terrace draped in bougainvillea offering sweeping views over Alfama\u2019s rooftops, the Tagus River, and the dome of the National Pantheon.',
  },
  {
    id: 'miradouro-portas-do-sol',
    name: 'Miradouro das Portas do Sol',
    neighborhood: 'Alfama',
    description:
      'A broad sun-drenched plaza adjacent to Santa Luzia providing a panoramic vantage point over Alfama\u2019s labyrinthine streets down to the river.',
  },
  {
    id: 'miradouro-castelo-sao-jorge',
    name: 'Miradouro do Castelo de S\u00e3o Jorge',
    neighborhood: 'Alfama',
    description:
      'The highest viewpoint in central Lisbon, set within the medieval castle walls, with a commanding 360-degree panorama spanning the entire city.',
  },
  {
    id: 'miradouro-largo-rodrigues-freitas',
    name: 'Miradouro do Largo Rodrigues de Freitas',
    neighborhood: 'Alfama',
    description:
      'A small, often-overlooked terrace near the castle offering an intimate rooftop perspective over lower Alfama without the usual crowds.',
  },
  // Gra\u00e7a
  {
    id: 'miradouro-graca',
    name: 'Miradouro da Gra\u00e7a',
    neighborhood: 'Gra\u00e7a',
    description:
      'A spacious pine-shaded esplanade beside the Gra\u00e7a convent with a direct frontal view of the castle and the city sprawling toward the river.',
  },
  {
    id: 'miradouro-senhora-do-monte',
    name: 'Miradouro da Senhora do Monte',
    neighborhood: 'Gra\u00e7a',
    description:
      'The highest viewpoint in Lisbon\u2019s historic center, offering an unobstructed panorama stretching from the castle to the Ponte 25 de Abril bridge.',
  },
  {
    id: 'miradouro-jardim-cerca-graca',
    name: 'Miradouro do Jardim da Cerca da Gra\u00e7a',
    neighborhood: 'Gra\u00e7a',
    description:
      'A terraced hillside garden reclaimed from abandoned land, providing a peaceful green escape with views over Mouraria and downtown Lisbon.',
  },
  // Bairro Alto
  {
    id: 'miradouro-sao-pedro-alcantara',
    name: 'Miradouro de S\u00e3o Pedro de Alc\u00e2ntara',
    neighborhood: 'Bairro Alto',
    description:
      'An elegant two-level garden at the top of the Elevador da Gl\u00f3ria with a classic east-facing view across the Baixa to the castle hill.',
  },
  {
    id: 'miradouro-santa-catarina',
    name: 'Miradouro de Santa Catarina (Adamastor)',
    neighborhood: 'Bairro Alto',
    description:
      'A bohemian gathering spot crowned by a statue of the mythical giant Adamastor, looking out over the Tagus and the 25 de Abril Bridge.',
  },
  // Pr\u00edncipe Real
  {
    id: 'miradouro-principe-real',
    name: 'Miradouro do Jardim do Pr\u00edncipe Real',
    neighborhood: 'Pr\u00edncipe Real',
    description:
      'A leafy square anchored by a giant century-old cedar tree with partial views toward the river and the Baixa.',
  },
  // Mouraria
  {
    id: 'miradouro-chao-loureiro',
    name: 'Miradouro do Ch\u00e3o do Loureiro',
    neighborhood: 'Mouraria',
    description:
      'A rooftop terrace atop a municipal parking garage, quietly offering one of the most direct views of the castle walls and the Mouraria quarter.',
  },
  // Baixa
  {
    id: 'miradouro-elevador-santa-justa',
    name: 'Miradouro do Elevador de Santa Justa',
    neighborhood: 'Baixa',
    description:
      'The top platform of Lisbon\u2019s iconic neo-Gothic iron elevator, providing a bird\u2019s-eye view down into the Baixa streets and across to the castle.',
  },
  {
    id: 'miradouro-arco-rua-augusta',
    name: 'Miradouro do Arco da Rua Augusta',
    neighborhood: 'Baixa',
    description:
      'The viewing platform atop the triumphal arch on Pra\u00e7a do Com\u00e9rcio, giving a unique perspective straight down Rua Augusta.',
  },
  // Estrela
  {
    id: 'miradouro-jardim-estrela',
    name: 'Miradouro do Jardim da Estrela',
    neighborhood: 'Estrela',
    description:
      'A verdant Victorian-era garden opposite the Bas\u00edlica da Estrela with a bandstand, duck pond, and gentle views across the western city.',
  },
  {
    id: 'miradouro-basilica-estrela',
    name: 'Miradouro da C\u00fapula da Bas\u00edlica da Estrela',
    neighborhood: 'Estrela',
    description:
      'The rooftop terrace of the 18th-century basilica offering a rarely visited 360-degree panorama over western Lisbon and Cristo Rei.',
  },
  // Bel\u00e9m
  {
    id: 'miradouro-torre-belem',
    name: 'Miradouro da Torre de Bel\u00e9m',
    neighborhood: 'Bel\u00e9m',
    description:
      'The upper terrace of the iconic 16th-century Manueline watchtower with views across the mouth of the Tagus.',
  },
  {
    id: 'miradouro-padrao-descobrimentos',
    name: 'Miradouro do Padr\u00e3o dos Descobrimentos',
    neighborhood: 'Bel\u00e9m',
    description:
      'The rooftop of the Monument to the Discoveries, with a downward view of the compass-rose mosaic and the Jer\u00f3nimos Monastery.',
  },
  // Monsanto
  {
    id: 'miradouro-parque-monsanto',
    name: 'Miradouro do Parque Florestal de Monsanto',
    neighborhood: 'Monsanto',
    description:
      'A forested hilltop lookout within Lisbon\u2019s largest green lung with an expansive vista of the entire city and the river.',
  },
  {
    id: 'miradouro-alto-serafina',
    name: 'Miradouro do Alto da Serafina',
    neighborhood: 'Monsanto',
    description:
      'A panoramic terrace on the western edge of Monsanto park, looking out over the Bel\u00e9m waterfront and the 25 de Abril Bridge.',
  },
  // Penha de Fran\u00e7a
  {
    id: 'miradouro-penha-franca',
    name: 'Miradouro da Penha de Fran\u00e7a',
    neighborhood: 'Penha de Fran\u00e7a',
    description:
      'A quiet residential-neighborhood miradouro next to the church, favored by locals for its eastward view over Alfama and the docks.',
  },
  {
    id: 'miradouro-monte-agudo',
    name: 'Miradouro do Monte Agudo',
    neighborhood: 'Penha de Fran\u00e7a',
    description:
      'A tiny hilltop park well off the tourist trail with a surprisingly open northward perspective over the Vale de Chelas.',
  },
  // Anjos
  {
    id: 'miradouro-jardim-torel',
    name: 'Miradouro do Jardim do Torel',
    neighborhood: 'Anjos',
    description:
      'A hidden hillside garden with a small pool and lush vegetation, providing a tranquil westward panorama over Avenida da Liberdade.',
  },
  // Parque das Na\u00e7\u00f5es
  {
    id: 'miradouro-torre-vasco-gama',
    name: 'Miradouro da Torre Vasco da Gama',
    neighborhood: 'Parque das Na\u00e7\u00f5es',
    description:
      'Panoramic views from near the top of Lisbon\u2019s tallest structure over the Expo district, the Vasco da Gama Bridge, and the Tagus estuary.',
  },
];

function sortMiradouros(list: Miradouro[], mode: SortMode): Miradouro[] {
  return [...list].sort((a, b) => {
    if (mode === 'name') return a.name.localeCompare(b.name);
    return a.neighborhood.localeCompare(b.neighborhood) || a.name.localeCompare(b.name);
  });
}

export default function Miradouros() {
  const { user } = useUser();
  const { isChecked, getCheckedBy, toggleChecked, checkedCount } = useChecklistSync('miradouros', user?.name);
  const [sortMode, setSortMode] = useState<SortMode>('neighborhood');

  const visitedCount = checkedCount;
  const sorted = sortMiradouros(MIRADOUROS, sortMode);

  // Group by neighborhood when in neighborhood sort mode
  let currentNeighborhood = '';

  return (
    <div className="flex flex-col gap-5">
      {/* Header Image */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex justify-center"
      >
        <div
          className="relative w-full max-w-md overflow-hidden rounded-xl"
          style={{ boxShadow: '0 4px 24px rgba(27, 75, 138, 0.12)' }}
        >
          <Image
            src="/images/header-miradouros.jpg"
            alt="Miradouro de Santa Luzia — Lisbon viewpoints"
            width={800}
            height={450}
            className="h-auto w-full"
            priority
          />
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl px-5 py-3 text-center"
        style={{
          background: 'rgba(255, 248, 240, 0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(196, 149, 58, 0.25)',
        }}
      >
        <p className="text-xs" style={{ color: '#8B7355' }}>
          {visitedCount} of {MIRADOUROS.length} visited
        </p>
      </motion.div>

      {/* Miradouros checklist */}
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
            Miradouros de Lisboa
          </h3>
          <div className="flex gap-1 rounded-lg p-0.5" style={{ background: 'rgba(27, 75, 138, 0.08)' }}>
            <button
              onClick={() => setSortMode('name')}
              className="relative flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors"
              style={{
                color: sortMode === 'name' ? '#fff' : '#1B4B8A',
                background: sortMode === 'name' ? '#1B4B8A' : 'transparent',
              }}
            >
              <ArrowUpDown size={10} />
              Name
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
          {sorted.map((miradouro) => {
            const checked = isChecked(miradouro.id);
            const checkedBy = getCheckedBy(miradouro.id);
            let showNeighborhoodHeader = false;
            if (sortMode === 'neighborhood' && miradouro.neighborhood !== currentNeighborhood) {
              currentNeighborhood = miradouro.neighborhood;
              showNeighborhoodHeader = true;
            }
            return (
              <div key={miradouro.id}>
                {showNeighborhoodHeader && (
                  <p
                    className="mb-1 mt-3 text-[11px] font-bold uppercase tracking-widest first:mt-0"
                    style={{ color: '#C4953A' }}
                  >
                    {miradouro.neighborhood}
                  </p>
                )}
                <button
                  onClick={() => toggleChecked(miradouro.id)}
                  className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-all"
                  style={{
                    background: checked
                      ? 'rgba(27, 75, 138, 0.08)'
                      : 'rgba(196, 149, 58, 0.04)',
                    border: checked
                      ? '1px solid rgba(27, 75, 138, 0.25)'
                      : '1px solid rgba(196, 149, 58, 0.1)',
                    opacity: checked ? 0.7 : 1,
                  }}
                >
                  {/* Checkbox */}
                  <div
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors"
                    style={{
                      borderColor: checked ? '#1B4B8A' : 'rgba(27, 75, 138, 0.3)',
                      background: checked ? '#1B4B8A' : 'transparent',
                    }}
                  >
                    {checked && <Check size={12} color="#fff" strokeWidth={3} />}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-sm font-semibold ${checked ? 'line-through' : ''}`}
                        style={{ color: '#1B4B8A' }}
                      >
                        {miradouro.name}
                      </p>
                    </div>
                    {sortMode === 'name' && (
                      <p className="mt-0.5 text-[10px] font-medium" style={{ color: '#C4953A' }}>
                        {miradouro.neighborhood}
                      </p>
                    )}
                    <p className="mt-1 text-xs leading-relaxed" style={{ color: '#6B5A3E' }}>
                      {miradouro.description}
                    </p>
                    {checkedBy.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {checkedBy.map((name) => (
                          <span
                            key={name}
                            className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold"
                            style={{
                              background: 'rgba(27, 75, 138, 0.08)',
                              color: '#1B4B8A',
                            }}
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
