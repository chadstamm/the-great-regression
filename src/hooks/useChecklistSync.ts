'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface ChecklistEntry {
  id: string;
  checklist_type: string;
  item_id: string;
  checked_by: string;
  created_at: string;
}

export function useChecklistSync(checklistType: string, userName: string | undefined) {
  const [checkedItems, setCheckedItems] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const isLocal = !supabase;

  const localStorageKey = `${checklistType}-checked-v2`;

  const fetchChecked = useCallback(async () => {
    if (!supabase) {
      // Fallback to localStorage
      try {
        const raw = localStorage.getItem(localStorageKey);
        setCheckedItems(raw ? JSON.parse(raw) : {});
      } catch {
        setCheckedItems({});
      }
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('checklist_progress')
      .select('*')
      .eq('checklist_type', checklistType);

    if (error) {
      console.error(`Error fetching ${checklistType} progress:`, error);
      setLoading(false);
      return;
    }

    // Group by item_id -> array of user names
    const grouped: Record<string, string[]> = {};
    (data as ChecklistEntry[]).forEach((entry) => {
      if (!grouped[entry.item_id]) grouped[entry.item_id] = [];
      grouped[entry.item_id].push(entry.checked_by);
    });
    setCheckedItems(grouped);
    setLoading(false);
  }, [checklistType, localStorageKey]);

  useEffect(() => {
    fetchChecked();

    if (!supabase) return;

    const channel = supabase
      .channel(`checklist_${checklistType}_realtime`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'checklist_progress',
          filter: `checklist_type=eq.${checklistType}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const entry = payload.new as ChecklistEntry;
            setCheckedItems((prev) => ({
              ...prev,
              [entry.item_id]: [...(prev[entry.item_id] || []), entry.checked_by],
            }));
          } else if (payload.eventType === 'DELETE') {
            const entry = payload.old as ChecklistEntry;
            setCheckedItems((prev) => ({
              ...prev,
              [entry.item_id]: (prev[entry.item_id] || []).filter(
                (name) => name !== entry.checked_by
              ),
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchChecked, checklistType]);

  const isChecked = useCallback(
    (itemId: string): boolean => {
      const checkers = checkedItems[itemId] || [];
      return checkers.length > 0;
    },
    [checkedItems]
  );

  const isCheckedByUser = useCallback(
    (itemId: string): boolean => {
      if (!userName) return false;
      const checkers = checkedItems[itemId] || [];
      return checkers.includes(userName);
    },
    [checkedItems, userName]
  );

  const getCheckedBy = useCallback(
    (itemId: string): string[] => {
      return checkedItems[itemId] || [];
    },
    [checkedItems]
  );

  const toggleChecked = useCallback(
    async (itemId: string) => {
      if (!userName) return;

      if (isLocal) {
        setCheckedItems((prev) => {
          const checkers = prev[itemId] || [];
          const hasUser = checkers.includes(userName);
          const updated = {
            ...prev,
            [itemId]: hasUser
              ? checkers.filter((n) => n !== userName)
              : [...checkers, userName],
          };
          localStorage.setItem(localStorageKey, JSON.stringify(updated));
          return updated;
        });
        return;
      }

      const currentlyChecked = (checkedItems[itemId] || []).includes(userName);

      if (currentlyChecked) {
        // Uncheck: delete the row
        const { error } = await supabase
          .from('checklist_progress')
          .delete()
          .eq('checklist_type', checklistType)
          .eq('item_id', itemId)
          .eq('checked_by', userName);

        if (error) console.error('Error unchecking item:', error);
      } else {
        // Check: insert a row
        const { error } = await supabase
          .from('checklist_progress')
          .insert({
            checklist_type: checklistType,
            item_id: itemId,
            checked_by: userName,
          });

        if (error) console.error('Error checking item:', error);
      }
    },
    [userName, isLocal, checkedItems, checklistType, localStorageKey]
  );

  const checkedCount = Object.values(checkedItems).filter((v) => v.length > 0).length;

  return { isChecked, isCheckedByUser, getCheckedBy, toggleChecked, checkedCount, loading };
}
