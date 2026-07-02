import React, { memo } from 'react';
import { trpc } from '../lib/trpc';

export default memo(function Stats() {
  const { data: stats } = trpc.club.stats.useQuery();

  if (!stats) {
    return (
      <section className="relative py-20 px-5">
        <div className="max-w-270 mx-auto text-center text-gray-400">
          Carregando...
        </div>
      </section>
    );
  }

  const statItems = [
    { label: 'Partidas', value: stats.totalMatches, color: 'from-blue-500 to-cyan-400' },
    { label: 'Vitorias', value: stats.wins, color: 'from-green-500 to-emerald-400' },
    { label: 'Gols', value: stats.totalGoals, color: 'from-red-500 to-pink-400' },
    { label: 'Sofridos', value: stats.totalConceded, color: 'from-orange-500 to-yellow-400' },
  ];

  return (
    <section id="stats" className="relative py-20 px-5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-transparent to-blue-500/5 pointer-events-none" />
      <div className="max-w-270 mx-auto relative z-10">
        <h2 className="text-5 md:text-8 font-900 tracking-wider mb-16 font-orbitron text-center">
          <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Estatisticas
          </span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {statItems.map((item, idx) => (
            <div key={idx} className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-lg opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300`} />
              <div className="relative bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm hover:border-white/30 transition-all duration-300">
                <div className={`text-4 md:text-6 font-900 mb-2 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                  {item.value}
                </div>
                <div className="text-2.5 md:text-3 text-gray-400 font-600">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
