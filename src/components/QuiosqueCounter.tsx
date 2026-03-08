'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabase';
import { useQuiosqueLogs } from '@/hooks/useQuiosqueLogs';

const STOPWATCH_KEY = 'quiosque-stopwatch-start';
const STOPWATCH_NOTE_KEY = 'quiosque-stopwatch-note';
const STOPWATCH_PEOPLE_KEY = 'quiosque-stopwatch-people';

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function getLisbonTime(): string {
  return new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' });
}

function PeopleCheckboxes({
  selected,
  onChange,
  knownPeople,
}: {
  selected: string[];
  onChange: (people: string[]) => void;
  knownPeople: string[];
}) {
  const toggle = (name: string) => {
    if (selected.includes(name)) {
      onChange(selected.filter((n) => n !== name));
    } else {
      onChange([...selected, name]);
    }
  };

  return (
    <div>
      <label
        className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider"
        style={{ color: '#8B7355' }}
      >
        Who&apos;s here?
      </label>
      <div className="flex flex-wrap gap-2">
        {knownPeople.map((name) => {
          const isSelected = selected.includes(name);
          return (
            <button
              key={name}
              type="button"
              onClick={() => toggle(name)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all"
              style={{
                background: isSelected
                  ? 'rgba(27, 75, 138, 0.12)'
                  : 'rgba(196, 149, 58, 0.06)',
                border: isSelected
                  ? '1px solid rgba(27, 75, 138, 0.3)'
                  : '1px solid rgba(196, 149, 58, 0.15)',
                color: isSelected ? '#1B4B8A' : '#8B7355',
              }}
            >
              <div
                className="flex h-4 w-4 items-center justify-center rounded border transition-colors"
                style={{
                  borderColor: isSelected ? '#1B4B8A' : 'rgba(27, 75, 138, 0.3)',
                  background: isSelected ? '#1B4B8A' : 'transparent',
                }}
              >
                {isSelected && <Check size={10} color="#fff" strokeWidth={3} />}
              </div>
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function QuiosqueCounter() {
  const { user } = useUser();
  const { logs, addLog, removeLog } = useQuiosqueLogs();
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [sessionNote, setSessionNote] = useState('');
  const [sessionPeople, setSessionPeople] = useState<string[]>([]);
  const [showManual, setShowManual] = useState(false);
  const [manualHours, setManualHours] = useState('');
  const [manualMinutes, setManualMinutes] = useState('');
  const [manualNote, setManualNote] = useState('');
  const [manualPeople, setManualPeople] = useState<string[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch all signed-up users from Supabase
  useEffect(() => {
    async function fetchUsers() {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('users')
        .select('name')
        .order('created_at', { ascending: true });
      if (data && !error) {
        setAllUsers(data.map((u: { name: string }) => u.name));
      }
    }
    fetchUsers();
  }, []);

  // Check for active stopwatch on mount
  useEffect(() => {
    const savedStart = localStorage.getItem(STOPWATCH_KEY);
    if (savedStart) {
      setIsRunning(true);
      const startTime = parseInt(savedStart);
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }
    const savedNote = localStorage.getItem(STOPWATCH_NOTE_KEY);
    if (savedNote) setSessionNote(savedNote);
    const savedPeople = localStorage.getItem(STOPWATCH_PEOPLE_KEY);
    if (savedPeople) {
      try {
        setSessionPeople(JSON.parse(savedPeople));
      } catch { /* use default */ }
    }
  }, []);

  // Stopwatch ticker
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const savedStart = localStorage.getItem(STOPWATCH_KEY);
        if (savedStart) {
          setElapsed(Math.floor((Date.now() - parseInt(savedStart)) / 1000));
        }
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const totalMinutes = logs.reduce((sum, l) => sum + l.duration, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = Math.round(totalMinutes % 60);

  // Build list of known people from all signed-up users + log history
  const knownPeople = Array.from(
    new Set([
      ...allUsers,
      ...(user?.name ? [user.name] : []),
      ...logs.flatMap((l) => l.people),
    ])
  );

  // Per-person scoreboard
  const personStats = knownPeople.map((name) => {
    const personLogs = logs.filter((l) => l.people.includes(name));
    const mins = personLogs.reduce((sum, l) => sum + l.duration, 0);
    return {
      name,
      totalMinutes: mins,
      hours: Math.floor(mins / 60),
      minutes: Math.round(mins % 60),
      visits: personLogs.length,
    };
  });

  const handleStart = useCallback(() => {
    localStorage.setItem(STOPWATCH_KEY, String(Date.now()));
    localStorage.setItem(STOPWATCH_PEOPLE_KEY, JSON.stringify(sessionPeople));
    setIsRunning(true);
    setElapsed(0);
  }, [sessionPeople]);

  const handleStop = useCallback(async () => {
    const savedStart = localStorage.getItem(STOPWATCH_KEY);
    if (savedStart) {
      const minutes = Math.max(1, Math.round((Date.now() - parseInt(savedStart)) / 60000));
      await addLog(
        minutes,
        new Date().toISOString(),
        sessionNote.trim() || 'Live session',
        sessionPeople.length > 0 ? sessionPeople : []
      );
    }
    localStorage.removeItem(STOPWATCH_KEY);
    localStorage.removeItem(STOPWATCH_NOTE_KEY);
    localStorage.removeItem(STOPWATCH_PEOPLE_KEY);
    setIsRunning(false);
    setElapsed(0);
    setSessionNote('');
    setSessionPeople([]);
  }, [addLog, sessionNote, sessionPeople]);

  const handleSessionNoteChange = (value: string) => {
    setSessionNote(value);
    localStorage.setItem(STOPWATCH_NOTE_KEY, value);
  };

  const handleSessionPeopleChange = (people: string[]) => {
    setSessionPeople(people);
    localStorage.setItem(STOPWATCH_PEOPLE_KEY, JSON.stringify(people));
  };

  const handleManualAdd = useCallback(async () => {
    const h = parseInt(manualHours) || 0;
    const m = parseInt(manualMinutes) || 0;
    const total = h * 60 + m;
    if (total <= 0) return;

    await addLog(
      total,
      new Date().toISOString(),
      manualNote || 'Manual entry',
      manualPeople.length > 0 ? manualPeople : []
    );
    setManualHours('');
    setManualMinutes('');
    setManualNote('');
    setManualPeople([]);
    setShowManual(false);
  }, [manualHours, manualMinutes, manualNote, manualPeople, addLog]);

  const handleDelete = useCallback(async (id: string) => {
    await removeLog(id);
  }, [removeLog]);

  return (
    <div className="flex flex-col gap-5">
      {/* Azulejo Header Image */}
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
            src="/images/header-quiosque-v2.jpg"
            alt="Quiosque Counter — Tempo no Quiosque 2026"
            width={800}
            height={450}
            className="h-auto w-full"
            priority
          />
        </div>
      </motion.div>

      {/* Total counter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl p-6 text-center"
        style={{
          background: 'rgba(255, 248, 240, 0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(196, 149, 58, 0.25)',
        }}
      >
        <p
          className="text-xs font-medium uppercase tracking-[0.2em]"
          style={{ color: '#8B7355', fontFamily: 'var(--font-display)' }}
        >
          Total Quiosque Time
        </p>

        <div className="mt-3 flex items-baseline justify-center gap-1">
          <span
            className="text-5xl font-black tabular-nums sm:text-6xl"
            style={{ color: '#1B4B8A', fontFamily: 'var(--font-display)' }}
          >
            {totalHours}
          </span>
          <span
            className="text-lg font-bold uppercase sm:text-xl"
            style={{ color: 'rgba(27, 75, 138, 0.5)', fontFamily: 'var(--font-display)' }}
          >
            hr
          </span>
          <span
            className="ml-2 text-5xl font-black tabular-nums sm:text-6xl"
            style={{ color: '#C4953A', fontFamily: 'var(--font-display)' }}
          >
            {remainingMinutes}
          </span>
          <span
            className="text-lg font-bold uppercase sm:text-xl"
            style={{ color: 'rgba(196, 149, 58, 0.5)', fontFamily: 'var(--font-display)' }}
          >
            min
          </span>
        </div>

        <p className="mt-2 text-xs" style={{ color: '#8B7355' }}>
          {logs.length} {logs.length === 1 ? 'visit' : 'visits'} logged
        </p>
        <p className="mt-2 text-[10px]" style={{ color: '#a89070' }}>
          Lisbon: {getLisbonTime()}
        </p>
      </motion.div>

      {/* Per-person scoreboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="rounded-2xl p-5"
        style={{
          background: 'rgba(255, 248, 240, 0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(196, 149, 58, 0.2)',
        }}
      >
        <h3
          className="mb-3 text-center text-sm font-semibold uppercase tracking-wider"
          style={{ color: '#1B4B8A', fontFamily: 'var(--font-display)' }}
        >
          Scoreboard
        </h3>
        <div className="flex gap-3">
          {personStats.map((person, i) => {
            const isLeader =
              personStats.length > 1 &&
              person.totalMinutes > 0 &&
              person.totalMinutes >= Math.max(...personStats.map((p) => p.totalMinutes));
            return (
              <div
                key={person.name}
                className="flex-1 rounded-xl p-4 text-center"
                style={{
                  background: isLeader
                    ? 'rgba(27, 75, 138, 0.08)'
                    : 'rgba(196, 149, 58, 0.06)',
                  border: isLeader
                    ? '1px solid rgba(27, 75, 138, 0.2)'
                    : '1px solid rgba(196, 149, 58, 0.1)',
                }}
              >
                <p
                  className="text-sm font-bold"
                  style={{ color: '#1B4B8A', fontFamily: 'var(--font-display)' }}
                >
                  {person.name}
                </p>
                {isLeader && (
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#C4953A' }}>
                    Leader
                  </p>
                )}
                <div className="mt-2 flex items-baseline justify-center gap-0.5">
                  <span
                    className="text-2xl font-black tabular-nums"
                    style={{ color: '#1B4B8A', fontFamily: 'var(--font-display)' }}
                  >
                    {person.hours}
                  </span>
                  <span
                    className="text-[10px] font-bold uppercase"
                    style={{ color: 'rgba(27, 75, 138, 0.5)' }}
                  >
                    hr
                  </span>
                  <span
                    className="ml-1 text-2xl font-black tabular-nums"
                    style={{ color: '#C4953A', fontFamily: 'var(--font-display)' }}
                  >
                    {person.minutes}
                  </span>
                  <span
                    className="text-[10px] font-bold uppercase"
                    style={{ color: 'rgba(196, 149, 58, 0.5)' }}
                  >
                    min
                  </span>
                </div>
                <p className="mt-1 text-[10px]" style={{ color: '#8B7355' }}>
                  {person.visits} {person.visits === 1 ? 'visit' : 'visits'}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Stopwatch */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-5"
        style={{
          background: 'rgba(255, 248, 240, 0.6)',
          backdropFilter: 'blur(12px)',
          border: isRunning
            ? '1px solid rgba(196, 149, 58, 0.5)'
            : '1px solid rgba(196, 149, 58, 0.2)',
          boxShadow: isRunning ? '0 0 20px rgba(196, 149, 58, 0.1)' : 'none',
        }}
      >
        <h3
          className="mb-3 text-center text-sm font-semibold"
          style={{ color: '#1B4B8A', fontFamily: 'var(--font-display)' }}
        >
          Live Session
        </h3>

        {/* Timer display */}
        <div className="mb-3 text-center">
          <motion.span
            key={elapsed}
            className="text-3xl font-bold tabular-nums"
            style={{ color: isRunning ? '#C4953A' : '#8B7355' }}
          >
            {formatTime(elapsed)}
          </motion.span>
        </div>

        {/* People checkboxes */}
        <div className="mb-3">
          <PeopleCheckboxes selected={sessionPeople} onChange={handleSessionPeopleChange} knownPeople={knownPeople} />
        </div>

        {/* Session note input */}
        <div className="mb-4">
          <input
            type="text"
            value={sessionNote}
            onChange={(e) => handleSessionNoteChange(e.target.value)}
            placeholder="Where are you? Add notes or location here."
            className="w-full rounded-lg px-3 py-2 text-sm"
            style={{
              background: 'rgba(255, 248, 240, 0.8)',
              border: '1px solid rgba(196, 149, 58, 0.3)',
              color: '#2D2A26',
            }}
          />
        </div>

        {/* Start / Stop buttons */}
        <div className="flex justify-center gap-3">
          {!isRunning ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="rounded-xl px-6 py-2.5 text-sm font-bold text-white"
              style={{ background: '#1B4B8A' }}
            >
              Start Session
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleStop}
              className="rounded-xl px-6 py-2.5 text-sm font-bold text-white"
              style={{ background: '#C4953A' }}
            >
              Stop &amp; Log
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Manual entry */}
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
        <button
          onClick={() => setShowManual(!showManual)}
          className="flex w-full items-center justify-between text-sm font-semibold"
          style={{ color: '#1B4B8A', fontFamily: 'var(--font-display)' }}
        >
          <span>Add Past Visit</span>
          <motion.span
            animate={{ rotate: showManual ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▾
          </motion.span>
        </button>

        <AnimatePresence>
          {showManual && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 flex flex-col gap-3">
                {/* People checkboxes for manual entry */}
                <PeopleCheckboxes selected={manualPeople} onChange={setManualPeople} knownPeople={knownPeople} />

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider" style={{ color: '#8B7355' }}>
                      Hours
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="24"
                      value={manualHours}
                      onChange={(e) => setManualHours(e.target.value)}
                      placeholder="0"
                      className="w-full rounded-lg px-3 py-2 text-sm"
                      style={{
                        background: 'rgba(255, 248, 240, 0.8)',
                        border: '1px solid rgba(196, 149, 58, 0.3)',
                        color: '#2D2A26',
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider" style={{ color: '#8B7355' }}>
                      Minutes
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={manualMinutes}
                      onChange={(e) => setManualMinutes(e.target.value)}
                      placeholder="0"
                      className="w-full rounded-lg px-3 py-2 text-sm"
                      style={{
                        background: 'rgba(255, 248, 240, 0.8)',
                        border: '1px solid rgba(196, 149, 58, 0.3)',
                        color: '#2D2A26',
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider" style={{ color: '#8B7355' }}>
                    Note (optional)
                  </label>
                  <input
                    type="text"
                    value={manualNote}
                    onChange={(e) => setManualNote(e.target.value)}
                    placeholder="e.g., Quiosque de São Pedro"
                    className="w-full rounded-lg px-3 py-2 text-sm"
                    style={{
                      background: 'rgba(255, 248, 240, 0.8)',
                      border: '1px solid rgba(196, 149, 58, 0.3)',
                      color: '#2D2A26',
                    }}
                  />
                </div>
                <button
                  onClick={handleManualAdd}
                  className="rounded-xl px-4 py-2 text-sm font-bold text-white"
                  style={{ background: '#1B4B8A' }}
                >
                  Add Entry
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Visit log / archive */}
      {logs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-5"
          style={{
            background: 'rgba(255, 248, 240, 0.6)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(196, 149, 58, 0.2)',
          }}
        >
          <h3
            className="mb-3 text-sm font-semibold"
            style={{ color: '#1B4B8A', fontFamily: 'var(--font-display)' }}
          >
            Visit Archive
          </h3>
          <div className="flex flex-col gap-2">
            {logs.map((log) => {
              const logHours = Math.floor(log.duration / 60);
              const logMins = Math.round(log.duration % 60);
              return (
                <div
                  key={log.id}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5"
                  style={{
                    background: 'rgba(196, 149, 58, 0.08)',
                    border: '1px solid rgba(196, 149, 58, 0.1)',
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-baseline gap-1">
                      {logHours > 0 && (
                        <>
                          <span className="text-base font-bold" style={{ color: '#1B4B8A' }}>
                            {logHours}
                          </span>
                          <span className="text-[10px] font-semibold uppercase" style={{ color: 'rgba(27, 75, 138, 0.5)' }}>
                            hr
                          </span>
                        </>
                      )}
                      <span className={`text-base font-bold ${logHours > 0 ? 'ml-1' : ''}`} style={{ color: '#C4953A' }}>
                        {logMins}
                      </span>
                      <span className="text-[10px] font-semibold uppercase" style={{ color: 'rgba(196, 149, 58, 0.5)' }}>
                        min
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs" style={{ color: '#8B7355' }}>
                      {log.note}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1">
                      {log.people.map((name) => (
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
                      <span className="text-[10px]" style={{ color: '#a89070' }}>
                        · {new Date(log.date).toLocaleDateString('pt-PT', { timeZone: 'Europe/Lisbon' })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(log.id)}
                    className="ml-2 text-xs opacity-40 hover:opacity-100 transition-opacity"
                    style={{ color: '#DC2626' }}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
