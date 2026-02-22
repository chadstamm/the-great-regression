'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Match {
  matchday: number;
  dateLisbon: string; // ISO date in Lisbon timezone
  timeLisbon: string; // 24h clock, Lisbon time
  homeTeam: string;
  awayTeam: string;
  venue: string;
  city: string;
  isPortugalMatch: boolean;
}

const GROUP_K_MATCHES: Match[] = [
  {
    matchday: 1,
    dateLisbon: '2026-06-17',
    timeLisbon: '18:00',
    homeTeam: 'Portugal',
    awayTeam: 'TBD (Playoff Winner)',
    venue: 'NRG Stadium',
    city: 'Houston, TX',
    isPortugalMatch: true,
  },
  {
    matchday: 2,
    dateLisbon: '2026-06-23',
    timeLisbon: '18:00',
    homeTeam: 'Portugal',
    awayTeam: 'Uzbekistan',
    venue: 'NRG Stadium',
    city: 'Houston, TX',
    isPortugalMatch: true,
  },
  {
    matchday: 3,
    dateLisbon: '2026-06-28',
    timeLisbon: '00:30',
    homeTeam: 'Colombia',
    awayTeam: 'Portugal',
    venue: 'Hard Rock Stadium',
    city: 'Miami Gardens, FL',
    isPortugalMatch: true,
  },
];

// Build a Date from Lisbon date + time (WEST = UTC+1 in June)
function lisbonToDate(dateLisbon: string, timeLisbon: string): Date {
  return new Date(dateLisbon + 'T' + timeLisbon + ':00+01:00');
}

function getNextMatch(): Match | null {
  const now = new Date();
  for (const match of GROUP_K_MATCHES) {
    if (lisbonToDate(match.dateLisbon, match.timeLisbon) > now) return match;
  }
  return null;
}

function getCountdown(match: Match) {
  const matchDate = lisbonToDate(match.dateLisbon, match.timeLisbon);
  const diff = matchDate.getTime() - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
  };
}

function formatMatchDate(dateLisbon: string): string {
  const date = new Date(dateLisbon + 'T12:00:00');
  return date.toLocaleDateString('pt-PT', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Lisbon',
  });
}

export default function WorldCupSchedule() {
  const [nextMatch, setNextMatch] = useState<Match | null>(null);
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number } | null>(null);

  useEffect(() => {
    const match = getNextMatch();
    setNextMatch(match);
    if (match) {
      setCountdown(getCountdown(match));
      const timer = setInterval(() => {
        setCountdown(getCountdown(match));
      }, 60000);
      return () => clearInterval(timer);
    }
  }, []);

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
        <p className="text-3xl">⚽🇵🇹</p>
        <h2
          className="mt-2 text-2xl font-bold sm:text-3xl"
          style={{ color: '#1B4B8A', fontFamily: 'var(--font-display)' }}
        >
          Copa do Mundo 2026
        </h2>
        <p
          className="mt-1 text-sm italic"
          style={{ color: '#C4953A', fontFamily: 'var(--font-display)' }}
        >
          Portugal — Grupo K
        </p>
        <p className="mt-2 text-xs" style={{ color: '#8B7355' }}>
          🇵🇹 Portugal · 🇨🇴 Colombia · 🇺🇿 Uzbekistan · TBD
        </p>
      </motion.div>

      {/* Next match countdown */}
      {nextMatch && countdown && (
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
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#8B7355' }}>
            Next Match
          </p>
          <p className="mt-1 text-sm font-bold" style={{ color: '#1B4B8A' }}>
            {nextMatch.homeTeam} vs {nextMatch.awayTeam}
          </p>
          <div className="mt-3 flex justify-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold tabular-nums" style={{ color: '#C4953A' }}>
                {countdown.days}
              </p>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: '#8B7355' }}>days</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold tabular-nums" style={{ color: '#C4953A' }}>
                {countdown.hours}
              </p>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: '#8B7355' }}>hours</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold tabular-nums" style={{ color: '#C4953A' }}>
                {countdown.minutes}
              </p>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: '#8B7355' }}>min</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Match schedule */}
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
          🏟️ Group Stage Matches
        </h3>
        <div className="flex flex-col gap-3">
          {GROUP_K_MATCHES.map((match, i) => (
            <div
              key={i}
              className="rounded-xl p-4"
              style={{
                background: match.isPortugalMatch
                  ? 'rgba(27, 75, 138, 0.06)'
                  : 'rgba(196, 149, 58, 0.04)',
                border: match.isPortugalMatch
                  ? '1px solid rgba(27, 75, 138, 0.15)'
                  : '1px solid rgba(196, 149, 58, 0.1)',
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: '#C4953A' }}
                >
                  Matchday {match.matchday}
                </span>
                <span
                  className="text-[10px]"
                  style={{ color: '#8B7355' }}
                >
                  {formatMatchDate(match.dateLisbon)}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: '#1B4B8A' }}>
                    {match.homeTeam}
                  </span>
                  <span className="text-xs" style={{ color: '#8B7355' }}>vs</span>
                  <span className="text-sm font-bold" style={{ color: '#1B4B8A' }}>
                    {match.awayTeam}
                  </span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px]" style={{ color: '#8B7355' }}>
                <span>📍 {match.venue}, {match.city}</span>
                <span className="font-semibold" style={{ color: '#C4953A' }}>
                  🕐 {match.timeLisbon}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Note about 4th team */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl p-4 text-center"
        style={{
          background: 'rgba(196, 149, 58, 0.06)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(196, 149, 58, 0.15)',
        }}
      >
        <p className="text-xs" style={{ color: '#8B7355' }}>
          ℹ️ The 4th team in Group K will be determined by the intercontinental playoff
          (DR Congo, Jamaica, or New Caledonia) in March 2026.
        </p>
      </motion.div>

      {/* Tournament info */}
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
          className="mb-3 text-sm font-semibold uppercase tracking-wider"
          style={{ color: '#1B4B8A', fontFamily: 'var(--font-display)' }}
        >
          ℹ️ Tournament Info
        </h3>
        <div className="flex flex-col gap-2 text-xs" style={{ color: '#6B5A3E' }}>
          <p>📅 <strong>Tournament:</strong> June 11 — July 19, 2026</p>
          <p>🌎 <strong>Hosts:</strong> USA, Mexico, Canada</p>
          <p>🏟️ <strong>Portugal base:</strong> Houston, TX (2 of 3 group matches)</p>
          <p>🕐 <strong>All times in Lisbon time</strong> (24h clock)</p>
          <p>🏆 <strong>Top 2 from Group K advance</strong> to Round of 32</p>
        </div>
      </motion.div>
    </div>
  );
}
