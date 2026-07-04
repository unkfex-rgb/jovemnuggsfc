import React, { createContext } from 'react';
import type { Match } from '@/types/api';

export const MatchContext = createContext<Match[] | null>(null);

interface MatchContextProviderProps {
  children: React.ReactNode;
  matches: Match[];
}

export function MatchContextProvider({ children, matches }: MatchContextProviderProps) {
  return (
    <MatchContext.Provider value={matches}>
      {children}
    </MatchContext.Provider>
  );
}
