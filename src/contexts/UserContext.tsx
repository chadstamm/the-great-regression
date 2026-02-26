'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/lib/types';

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  createUser: (name: string, icon: string) => Promise<void>;
  dismissWelcome: () => void;
  showWelcome: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'tgr-user-id';

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [mounted, setMounted] = useState(false);

  // On mount: check localStorage for existing user ID, validate against Supabase
  useEffect(() => {
    async function loadUser() {
      try {
        const savedId = localStorage.getItem(STORAGE_KEY);

        if (savedId && supabase) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', savedId)
            .single();

          if (data && !error) {
            setUser(data as UserProfile);
            setLoading(false);
            setMounted(true);
            return;
          }
          // Invalid ID — clear it
          localStorage.removeItem(STORAGE_KEY);
        }

        if (savedId && !supabase) {
          // Offline mode: reconstruct from localStorage
          const savedName = localStorage.getItem('tgr-user-name');
          const savedIcon = localStorage.getItem('tgr-user-icon');
          if (savedName) {
            setUser({
              id: savedId,
              name: savedName,
              icon: savedIcon || 'caravel',
              created_at: new Date().toISOString(),
            });
            setLoading(false);
            setMounted(true);
            return;
          }
        }

        // No user found — show welcome modal
        setShowWelcome(true);
      } catch (e) {
        console.error('[UserContext] error loading user:', e);
      }
      setLoading(false);
      setMounted(true);
    }

    loadUser();
  }, []);

  const createUser = useCallback(async (name: string, icon: string) => {
    if (supabase) {
      const { data, error } = await supabase
        .from('users')
        .insert({ name, icon })
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        return;
      }

      const profile = data as UserProfile;
      localStorage.setItem(STORAGE_KEY, profile.id);
      localStorage.setItem('tgr-user-name', profile.name);
      localStorage.setItem('tgr-user-icon', profile.icon);
      setUser(profile);
    } else {
      // Local-only mode
      const profile: UserProfile = {
        id: crypto.randomUUID(),
        name,
        icon,
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, profile.id);
      localStorage.setItem('tgr-user-name', profile.name);
      localStorage.setItem('tgr-user-icon', profile.icon);
      setUser(profile);
    }

    setShowWelcome(false);
  }, []);

  const dismissWelcome = useCallback(() => {
    setShowWelcome(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('tgr-user-name');
    localStorage.removeItem('tgr-user-icon');
    setUser(null);
    setShowWelcome(true);
  }, []);

  // Don't render anything until we've checked localStorage
  if (!mounted) {
    return null;
  }

  return (
    <UserContext.Provider
      value={{ user, loading, createUser, dismissWelcome, showWelcome, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
