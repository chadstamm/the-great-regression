'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface QuiosqueLog {
  id: string;
  duration: number; // minutes
  date: string; // ISO string
  note: string | null;
  people: string[];
  created_at: string;
}

export function useQuiosqueLogs() {
  const [logs, setLogs] = useState<QuiosqueLog[]>([]);
  const [loading, setLoading] = useState(true);
  const isLocal = !supabase;

  const fetchLogs = useCallback(async () => {
    if (!supabase) {
      // Fallback to localStorage
      try {
        const raw = localStorage.getItem('quiosque-logs');
        const parsed = raw ? JSON.parse(raw) : [];
        setLogs(
          parsed.map((entry: QuiosqueLog & { people?: string[] }) => ({
            ...entry,
            people: entry.people ?? [],
          }))
        );
      } catch {
        setLogs([]);
      }
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('quiosque_logs')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching quiosque logs:', error);
      setLoading(false);
      return;
    }

    setLogs((data as QuiosqueLog[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLogs();

    if (!supabase) return;

    const channel = supabase
      .channel('quiosque_logs_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'quiosque_logs' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLogs((prev) => [payload.new as QuiosqueLog, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setLogs((prev) =>
              prev.map((log) =>
                log.id === (payload.new as QuiosqueLog).id
                  ? (payload.new as QuiosqueLog)
                  : log
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setLogs((prev) =>
              prev.filter((log) => log.id !== (payload.old as { id: string }).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLogs]);

  const addLog = async (
    duration: number,
    date: string,
    note: string | null,
    people: string[]
  ) => {
    if (isLocal) {
      const entry: QuiosqueLog = {
        id: crypto.randomUUID(),
        duration,
        date,
        note,
        people,
        created_at: new Date().toISOString(),
      };
      setLogs((prev) => [entry, ...prev]);
      return;
    }

    const { error } = await supabase.from('quiosque_logs').insert({
      duration,
      date,
      note,
      people,
    });

    if (error) console.error('Error adding quiosque log:', error);
  };

  const removeLog = async (id: string) => {
    if (isLocal) {
      setLogs((prev) => prev.filter((l) => l.id !== id));
      return;
    }

    const { error } = await supabase
      .from('quiosque_logs')
      .delete()
      .eq('id', id);

    if (error) console.error('Error removing quiosque log:', error);
  };

  return { logs, loading, addLog, removeLog };
}
