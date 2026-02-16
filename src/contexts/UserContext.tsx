'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserName } from '@/lib/types';

interface UserContextType {
  user: UserName | null;
  setUser: (name: UserName) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserName | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('app-user') as UserName | null;
    if (saved) {
      setUserState(saved);
    }
    setMounted(true);
  }, []);

  const setUser = (name: UserName) => {
    setUserState(name);
    localStorage.setItem('app-user', name);
  };

  if (!mounted) {
    return null;
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
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
