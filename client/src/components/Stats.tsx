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
      {/* Fundo preto com grid pattern */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 opacity-3" style={{
        backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, 0.03) 25%, rgba(0, 255, 255, 0.03) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.03) 75%, rgba(0, 255, 255, 0.03) 76%, transparent 77%, transparent),
                         linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, 0.03) 25%, rgba(0, 255, 255, 0.03) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.03) 75%, rgba(0, 255, 255, 0.03) 76%, transparent 77%, transparent)`,
        backgroundSize: '50px 50px'
      }} />

      {/* Neon glow sutil */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 blur-3xl rounded-full opacity-30" />

      <div className="max-w-270 mx-auto relative z-10">
        <h2 className="text-5 md:text-8 font-900 tracking-widest mb-16 font-orbitron text-center text-white" style={{
          textShadow: '0 0 20px rgba(0, 255, 255, 0.4)',
          letterSpacing: '0.08em'
        }}>
          ESTATÍSTICAS DO TIME
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Partidas */}
          <div className="group relative overflow-hidden bg-black border border-cyan-400/40 p-6 cursor-pointer transition-all duration-300 hover:border-cyan-400/80" style={{
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.8)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.4)';
            e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.2)';
          }}>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="text-5 font-900 text-white mb-2">{totalMatches}</div>
              <div className="text-2.75 text-gray-400 font-mono uppercase tracking-widest">Partidas</div>
            </div>
          </div>

          {/* Vitórias */}
          <div className="group relative overflow-hidden bg-black border border-cyan-400/40 p-6 cursor-pointer transition-all duration-300 hover:border-cyan-400/80" style={{
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.8)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.4)';
            e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.2)';
          }}>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="text-5 font-900 text-white mb-2">{wins}</div>
              <div className="text-2.75 text-gray-400 font-mono uppercase tracking-widest">Vitórias</div>
            </div>
          </div>

          {/* Gols */}
          <div className="group relative overflow-hidden bg-black border border-cyan-400/40 p-6 cursor-pointer transition-all duration-300 hover:border-cyan-400/80" style={{
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.8)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.4)';
            e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.2)';
          }}>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="text-5 font-900 text-white mb-2">{totalGoals}</div>
              <div className="text-2.75 text-gray-400 font-mono uppercase tracking-widest">Gols</div>
            </div>
          </div>

          {/* Assistências */}
          <div className="group relative overflow-hidden bg-black border border-cyan-400/40 p-6 cursor-pointer transition-all duration-300 hover:border-cyan-400/80" style={{
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.8)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.4)';
            e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.2)';
          }}>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="text-5 font-900 text-white mb-2">{totalAssists}</div>
              <div className="text-2.75 text-gray-400 font-mono uppercase tracking-widest">Assistências</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
