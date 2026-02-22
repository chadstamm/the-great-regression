'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { BucketItem, Category, UserName } from '@/lib/types';
import { SEED_ITEMS } from '@/lib/constants';

function generateId() {
  return crypto.randomUUID();
}

function buildLocalItems(): BucketItem[] {
  return SEED_ITEMS.map((item) => ({
    id: generateId(),
    category: item.category,
    title: item.title,
    note: item.note,
    added_by: item.added_by,
    initials: item.initials,
    votes: [],
    is_done: false,
    created_at: new Date().toISOString(),
  }));
}

export function useBucketItems() {
  const [items, setItems] = useState<BucketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const isLocal = !supabase;

  const fetchItems = useCallback(async () => {
    if (!supabase) {
      setItems(buildLocalItems());
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('bucket_items')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching items:', error);
      return;
    }

    if (data && data.length === 0) {
      await seedItems();
      return;
    }

    setItems((data as BucketItem[]) || []);
    setLoading(false);
  }, []);

  const seedItems = async () => {
    const rows = SEED_ITEMS.map((item) => ({
      category: item.category,
      title: item.title,
      note: item.note,
      added_by: item.added_by,
      initials: item.initials,
      votes: [],
      is_done: false,
    }));

    const { data, error } = await supabase
      .from('bucket_items')
      .insert(rows)
      .select();

    if (error) {
      console.error('Error seeding items:', error);
      return;
    }

    setItems((data as BucketItem[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();

    if (!supabase) return;

    const channel = supabase
      .channel('bucket_items_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bucket_items' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setItems((prev) => [...prev, payload.new as BucketItem]);
          } else if (payload.eventType === 'UPDATE') {
            setItems((prev) =>
              prev.map((item) =>
                item.id === (payload.new as BucketItem).id
                  ? (payload.new as BucketItem)
                  : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setItems((prev) =>
              prev.filter((item) => item.id !== (payload.old as { id: string }).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchItems]);

  const addItem = async (
    category: Category,
    title: string,
    note: string | null,
    addedBy: UserName,
    initials: string = 'CS'
  ) => {
    if (isLocal) {
      setItems((prev) => [
        ...prev,
        {
          id: generateId(),
          category,
          title,
          note,
          added_by: addedBy,
          initials,
          votes: [],
          is_done: false,
          created_at: new Date().toISOString(),
        },
      ]);
      return;
    }
    const { error } = await supabase.from('bucket_items').insert({
      category,
      title,
      note,
      added_by: addedBy,
      initials,
      votes: [],
      is_done: false,
    });

    if (error) console.error('Error adding item:', error);
  };

  const toggleVote = async (item: BucketItem, userName: UserName) => {
    const hasVoted = item.votes.includes(userName);
    const newVotes = hasVoted
      ? item.votes.filter((v) => v !== userName)
      : [...item.votes, userName];

    if (isLocal) {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, votes: newVotes } : i))
      );
      return;
    }
    const { error } = await supabase
      .from('bucket_items')
      .update({ votes: newVotes })
      .eq('id', item.id);

    if (error) console.error('Error toggling vote:', error);
  };

  const toggleDone = async (item: BucketItem) => {
    if (isLocal) {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_done: !i.is_done } : i))
      );
      return;
    }
    const { error } = await supabase
      .from('bucket_items')
      .update({ is_done: !item.is_done })
      .eq('id', item.id);

    if (error) console.error('Error toggling done:', error);
  };

  const removeItem = async (id: string) => {
    if (isLocal) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    const { error } = await supabase
      .from('bucket_items')
      .delete()
      .eq('id', id);

    if (error) console.error('Error removing item:', error);
  };

  return { items, loading, addItem, toggleVote, toggleDone, removeItem };
}
