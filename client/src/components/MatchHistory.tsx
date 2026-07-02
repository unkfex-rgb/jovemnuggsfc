import React, { memo } from 'react';
import { trpc } from '@/lib/trpc';

export default memo(function MatchHistory() {
  const { data: matches = [] } = trpc.club.matchHistory.useQuery();

  return (
    <section id="historico" className="relative py-20 px-5 overflow-hidden">
      {/* Watermark do escudo */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <img 
          src="/escudo-linha-transparente.png" 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Fundo com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent pointer-events-none" />

      <div className="max-w-270 mx-auto relative z-10">
        <h2 className="text-5 md:text-8 font-900 tracking-wider mb-16 font-orbitron text-center">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Histórico Oficial
          </span>
        </h2>

        <div className="space-y-4">
          {Array.isArray(matches) && matches.slice(0, 15).map((match: any, idx: number) => (
            <div key={idx} className="group relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-10 blur-xl transition-all duration-300" />
              <div className="relative bg-black border border-white/10 rounded-lg overflow-hidden hover:border-white/30 transition-all duration-300 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-white font-mono font-bold">Jovem Nuggs FC</div>
                    <div className="text-xs text-gray-500 font-mono">{new Date(match.match_date || match.date).toLocaleDateString('pt-BR')}</div>
                  </div>
                  <div className="text-center px-4">
                    <div className="text-2xl font-900 text-cyan-400 font-mono">{match.match_data?.clubs?.["8044401"]?.goals || 0} - {Object.values(match.match_data?.clubs || {}).filter((c: any) => c.clubName !== 'Jovem Nuggs FC').reduce((sum: number, c: any) => sum + parseInt(c.goals || 0), 0)}</div>
                    <div className="text-xs text-gray-400 font-mono mt-1">
                      {parseInt(match.match_data?.clubs?.["8044401"]?.goals || 0) > Object.values(match.match_data?.clubs || {}).filter((c: any) => c.clubName !== 'Jovem Nuggs FC').reduce((sum: number, c: any) => sum + parseInt(c.goals || 0), 0) ? '✓ VITÓRIA' : parseInt(match.match_data?.clubs?.["8044401"]?.goals || 0) < Object.values(match.match_data?.clubs || {}).filter((c: any) => c.clubName !== 'Jovem Nuggs FC').reduce((sum: number, c: any) => sum + parseInt(c.goals || 0), 0) ? '✗ DERROTA' : '= EMPATE'}
                    </div>
                  </div>
                  <div className="flex-1 text-right">
                    <div className="text-white font-mono font-bold">{Object.values(match.match_data?.clubs || {}).filter((c: any) => c.clubName !== 'Jovem Nuggs FC').map((c: any) => c.clubName).join(' vs ')}</div>
                    <div className="text-xs text-gray-500 font-mono">{match.competition || 'Amistoso'}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
