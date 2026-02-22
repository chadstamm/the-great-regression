'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogEntry {
  id: string;
  duration: number; // minutes
  date: string; // ISO string
  note: string;
}

const STORAGE_KEY = 'quiosque-logs';
const STOPWATCH_KEY = 'quiosque-stopwatch-start';
const STOPWATCH_NOTE_KEY = 'quiosque-stopwatch-note';

function loadLogs(): LogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLogs(logs: LogEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function getLisbonTime(): string {
  return new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' });
}

export default function QuiosqueCounter() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [sessionNote, setSessionNote] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [manualHours, setManualHours] = useState('');
  const [manualMinutes, setManualMinutes] = useState('');
  const [manualNote, setManualNote] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load logs and check for active stopwatch
  useEffect(() => {
    setLogs(loadLogs());
    const savedStart = localStorage.getItem(STOPWATCH_KEY);
    if (savedStart) {
      setIsRunning(true);
      const startTime = parseInt(savedStart);
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }
    const savedNote = localStorage.getItem(STOPWATCH_NOTE_KEY);
    if (savedNote) setSessionNote(savedNote);
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

  const handleStart = useCallback(() => {
    localStorage.setItem(STOPWATCH_KEY, String(Date.now()));
    setIsRunning(true);
    setElapsed(0);
  }, []);

  const handleStop = useCallback(() => {
    const savedStart = localStorage.getItem(STOPWATCH_KEY);
    if (savedStart) {
      const minutes = Math.max(1, Math.round((Date.now() - parseInt(savedStart)) / 60000));
      const entry: LogEntry = {
        id: Date.now().toString(),
        duration: minutes,
        date: new Date().toISOString(),
        note: sessionNote.trim() || 'Live session',
      };
      const updated = [entry, ...logs];
      setLogs(updated);
      saveLogs(updated);
    }
    localStorage.removeItem(STOPWATCH_KEY);
    localStorage.removeItem(STOPWATCH_NOTE_KEY);
    setIsRunning(false);
    setElapsed(0);
    setSessionNote('');
  }, [logs, sessionNote]);

  const handleSessionNoteChange = (value: string) => {
    setSessionNote(value);
    localStorage.setItem(STOPWATCH_NOTE_KEY, value);
  };

  const handleManualAdd = useCallback(() => {
    const h = parseInt(manualHours) || 0;
    const m = parseInt(manualMinutes) || 0;
    const total = h * 60 + m;
    if (total <= 0) return;

    const entry: LogEntry = {
      id: Date.now().toString(),
      duration: total,
      date: new Date().toISOString(),
      note: manualNote || 'Manual entry',
    };
    const updated = [entry, ...logs];
    setLogs(updated);
    saveLogs(updated);
    setManualHours('');
    setManualMinutes('');
    setManualNote('');
    setShowManual(false);
  }, [manualHours, manualMinutes, manualNote, logs]);

  const handleDelete = useCallback((id: string) => {
    setLogs((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      saveLogs(updated);
      return updated;
    });
  }, []);

  return (
    <div className="flex flex-col gap-5">
      {/* Total counter */}
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
        <p
          className="text-xs font-medium uppercase tracking-[0.2em]"
          style={{ color: '#8B7355', fontFamily: 'var(--font-display)' }}
        >
          Total Quiosque Time
        </p>

        {/* Large split display: hours and minutes clearly separated */}
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
                    <p className="text-[10px]" style={{ color: '#a89070' }}>
                      {new Date(log.date).toLocaleDateString('pt-PT', { timeZone: 'Europe/Lisbon' })}
                    </p>
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
