import React, { useMemo } from 'react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/hover-card';
import { getPositionLabel, getPositionColor } from '../lib/playerUtils';
import type { Match, RawPlayerStats } from '@/types/api';

interface MatchStatsPopupProps {
  match: Match;
  children: React.ReactNode;
}

export const MatchStatsPopup = ({ match, children }: MatchStatsPopupProps) => {
  // Ordenar jogadores por rating (melhor desempenho primeiro)
  const sortedPlayers = useMemo(() => {
    if (!match.playerStats) return [];
    
    return Object.entries(match.playerStats)
      .map(([name, stats]) => ({ name, stats }))
      .sort((a, b) => {
        const ratingA = parseFloat(a.stats.rating) || 0;
        const ratingB = parseFloat(b.stats.rating) || 0;
        return ratingB - ratingA;
      })
      .slice(0, 8); // Top 8 jogadores
  }, [match.playerStats]);

  // Calcular estatísticas agregadas da partida
  const matchStats = useMemo(() => {
    if (!match.playerStats) return { totalGoals: 0, totalAssists: 0, avgRating: 0 };
    
    const stats = Object.values(match.playerStats);
    const totalGoals = stats.reduce((sum, s) => sum + (parseInt(s.goals) || 0), 0);
    const totalAssists = stats.reduce((sum, s) => sum + (parseInt(s.assists) || 0), 0);
    const avgRating = stats.length > 0 
      ? (stats.reduce((sum, s) => sum + (parseFloat(s.rating) || 0), 0) / stats.length).toFixed(2)
      : '0.00';

    return { totalGoals, totalAssists, avgRating };
  }, [match.playerStats]);

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>

      <HoverCardContent className="w-72 sm:w-80 bg-black/95 backdrop-blur-md border border-white/20 p-3 sm:p-4" align="center" sideOffset={10}>
        <div className="space-y-4">
          {/* Header */}
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white mb-2">Estatísticas da Partida</h3>
            <div className="flex gap-4 text-xs">
              <div className="flex flex-col">
                <span className="text-white/40">Gols</span>
                <span className="text-emerald-400 font-bold">{matchStats.totalGoals}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white/40">Assistências</span>
                <span className="text-blue-400 font-bold">{matchStats.totalAssists}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white/40">Nota Média</span>
                <span className="text-yellow-400 font-bold">{matchStats.avgRating}</span>
              </div>
            </div>
          </div>

          {/* Top Players */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Top Performers</p>
            {sortedPlayers.map(({ name, stats }, idx) => {
              const isMOM = stats.mom === '1';
              const rating = parseFloat(stats.rating) || 0;
              const goals = parseInt(stats.goals) || 0;
              const assists = parseInt(stats.assists) || 0;

              return (
                <div
                  key={name}
                  className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 rounded-lg text-xs transition-all gap-2 ${
                    isMOM
                      ? 'bg-yellow-500/20 border border-yellow-500/30'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 flex-shrink-0 w-4">{idx + 1}.</span>
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate text-sm">{name}</p>
                        <p className="text-white/40 text-[10px]">{getPositionLabel(stats.pos)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    {goals > 0 && <span className="text-red-400 font-bold text-xs">{goals}G</span>}
                    {assists > 0 && <span className="text-blue-400 font-bold text-xs">{assists}A</span>}
                    <span className={`font-bold w-8 sm:w-10 text-right text-xs ${
                      rating >= 8 ? 'text-emerald-400' :
                      rating >= 7 ? 'text-yellow-400' :
                      'text-white/60'
                    }`}>
                      {rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* MOM Badge */}
          {sortedPlayers.some(p => p.stats.mom === '1') && (
            <div className="pt-2 border-t border-white/10 text-center">
              <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest">
                ⭐ Man of the Match: {sortedPlayers.find(p => p.stats.mom === '1')?.name}
              </p>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
