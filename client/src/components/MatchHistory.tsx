import React, { memo } from 'react';
import { trpc } from '@/lib/trpc';

export default memo(function MatchHistory() {
  const { data: matches = [] } = trpc.club.matchHistory.useQuery();

  const getScoreColor = (ourGoals: number, theirGoals: number) => {
    if (ourGoals > theirGoals) return 'text-white';
    if (ourGoals < theirGoals) return 'text-white';
    return 'text-white';
  };

  const getResultLabel = (ourGoals: number, theirGoals: number) => {
    if (ourGoals > theirGoals) return '✓ VITÓRIA';
    if (ourGoals < theirGoals) return '✗ DERROTA';
    return '= EMPATE';
  };

  const getResultColor = (ourGoals: number, theirGoals: number) => {
    if (ourGoals > theirGoals) return 'text-white';
    if (ourGoals < theirGoals) return 'text-white';
    return 'text-white';
  };

  return (
    <section id="historico" className="relative py-20 px-5 overflow-hidden">
      {/* Fundo preto com grid pattern */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 opacity-3" style={{
        backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, 0.03) 25%, rgba(0, 255, 255, 0.03) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.03) 75%, rgba(0, 255, 255, 0.03) 76%, transparent 77%, transparent),
                         linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, 0.03) 25%, rgba(0, 255, 255, 0.03) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.03) 75%, rgba(0, 255, 255, 0.03) 76%, transparent 77%, transparent)`,
        backgroundSize: '50px 50px'
      }} />

      {/* Neon glow sutil */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/5 blur-3xl rounded-full opacity-30" />

      <div className="max-w-270 mx-auto relative z-10">
        <h2 className="text-5 md:text-8 font-900 tracking-widest mb-16 font-orbitron text-center text-white" style={{
          textShadow: '0 0 20px rgba(0, 255, 255, 0.4)',
          letterSpacing: '0.08em'
        }}>
          HISTÓRICO OFICIAL
        </h2>

        <div className="space-y-3">
          {Array.isArray(matches) && matches.slice(0, 15).map((match: any, idx: number) => {
            const ourGoals = parseInt(match.match_data?.clubs?.["8044401"]?.goals || 0);
            const theirGoals = Object.values(match.match_data?.clubs || {}).filter((c: any) => c.clubName !== 'Jovem Nuggs FC').reduce((sum: number, c: any) => sum + parseInt(c.goals || 0), 0);
            
            return (
              <div key={idx} className="group relative overflow-hidden bg-black border border-cyan-400/30 p-4 cursor-pointer transition-all duration-300 hover:border-cyan-400/70" style={{
                boxShadow: '0 0 8px rgba(0, 255, 255, 0.1)'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.7)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.4)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.3)';
                e.currentTarget.style.boxShadow = '0 0 8px rgba(0, 255, 255, 0.1)';
              }}>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center justify-between">
                  {/* Time da casa */}
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-mono font-bold text-sm truncate">Jovem Nuggs FC</div>
                    <div className="text-xs text-gray-500 font-mono">{new Date(match.match_date || match.date).toLocaleDateString('pt-BR')}</div>
                  </div>

                  {/* Placar */}
                  <div className="text-center px-6">
                    <div className={`text-2xl font-900 font-mono ${getScoreColor(ourGoals, theirGoals)}`} style={{
                      textShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
                    }}>
                      {ourGoals} - {theirGoals}
                    </div>
                    <div className={`text-xs font-mono mt-1 ${getResultColor(ourGoals, theirGoals)}`} style={{
                      textShadow: '0 0 5px rgba(0, 255, 255, 0.2)'
                    }}>
                      {getResultLabel(ourGoals, theirGoals)}
                    </div>
                  </div>

                  {/* Time visitante */}
                  <div className="flex-1 min-w-0 text-right">
                    <div className="text-white font-mono font-bold text-sm truncate">{Object.values(match.match_data?.clubs || {}).filter((c: any) => c.clubName !== 'Jovem Nuggs FC').map((c: any) => c.clubName).join(' vs ')}</div>
                    <div className="text-xs text-gray-500 font-mono">{match.competition || 'Amistoso'}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {matches.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 font-mono">Nenhuma partida registrada ainda.</div>
          </div>
        )}
      </div>
    </section>
  );
});
