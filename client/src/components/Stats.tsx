import React, { memo } from 'react';
import { trpc } from '@/lib/trpc';

export default memo(function Stats() {
  const { data: stats } = trpc.club.stats.useQuery();
  
  const totalMatches = stats?.totalMatches || 0;
  const wins = stats?.wins || 0;
  const totalGoals = stats?.totalGoals || 0;
  const totalAssists = Object.values(stats?.players || {}).reduce((sum: number, p: any) => sum + (p.assists || 0), 0);
  
  return (
    <section id="stats" className="relative py-20 px-5 overflow-hidden">
      {/* Watermark do escudo */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <img 
          src="/escudo-linha-transparente.png" 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Fundo com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />

      <div className="max-w-270 mx-auto relative z-10">
        <h2 className="text-5 md:text-8 font-900 tracking-wider mb-16 font-orbitron text-center">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Estatísticas do Time
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group relative overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-cyan-500 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300" />
            <div className="relative bg-black border border-white/10 rounded-lg overflow-hidden hover:border-white/30 transition-all duration-300 p-6">
              <div className="text-5 font-900 text-cyan-400 mb-2">{totalMatches}</div>
              <div className="text-2.75 text-gray-400 font-mono">Partidas</div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-cyan-500 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300" />
            <div className="relative bg-black border border-white/10 rounded-lg overflow-hidden hover:border-white/30 transition-all duration-300 p-6">
              <div className="text-5 font-900 text-green-400 mb-2">{wins}</div>
              <div className="text-2.75 text-gray-400 font-mono">Vitórias</div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-cyan-500 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300" />
            <div className="relative bg-black border border-white/10 rounded-lg overflow-hidden hover:border-white/30 transition-all duration-300 p-6">
              <div className="text-5 font-900 text-purple-400 mb-2">{totalGoals}</div>
              <div className="text-2.75 text-gray-400 font-mono">Gols</div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-cyan-500 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300" />
            <div className="relative bg-black border border-white/10 rounded-lg overflow-hidden hover:border-white/30 transition-all duration-300 p-6">
              <div className="text-5 font-900 text-yellow-400 mb-2">{totalAssists}</div>
              <div className="text-2.75 text-gray-400 font-mono">Assistências</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
