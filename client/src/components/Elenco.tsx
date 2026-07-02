import React, { useMemo, memo } from 'react';
import { trpc } from '../lib/trpc';
import { PlayerCard } from './PlayerCard';

export default memo(function Elenco() {
  const { data: stats } = trpc.club.stats.useQuery();

  const players = useMemo(() => {
    if (!stats?.players) return [];
    return Object.values(stats.players).sort((a: any, b: any) => b.matches - a.matches);
  }, [stats]);

  return (
    <section className="relative py-20 px-5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />
      <div className="max-w-270 mx-auto relative z-10">
        <h2 className="text-5 md:text-8 font-900 tracking-wider mb-16 font-orbitron text-center">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Elenco Completo
          </span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {players.map((player: any, idx: number) => (
            <PlayerCard key={idx} player={player} />
          ))}
        </div>
      </div>
    </section>
  );
});
