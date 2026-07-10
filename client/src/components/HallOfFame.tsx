import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Shield, Target, Zap, TrendingUp, Activity, Users } from 'lucide-react';
import { Reveal } from './Reveal';
import { SectionLabel } from './SectionLabel';
import type { Player, Match, ClubStats } from '@/types/api';

interface HallOfFameProps {
  players: Player[];
  matches: Match[];
  stats: ClubStats;
}

export const HallOfFame = memo(({ players, matches, stats }: HallOfFameProps) => {
  const records = useMemo(() => {
    if (players.length === 0) return [];

    const topScorer = [...players].sort((a, b) => b.goals - a.goals)[0];
    const topAssister = [...players].sort((a, b) => b.assists - a.assists)[0];
    const mostMatches = [...players].sort((a, b) => b.matches - a.matches)[0];
    const bestRating = [...players].sort((a, b) => b.avgRating - a.avgRating)[0];
    
    // Novas métricas de análise avançada
    const mostEfficient = [...players]
      .filter(p => p.matches > 5)
      .sort((a, b) => (b.goals + b.assists) / b.matches - (a.goals + a.assists) / a.matches)[0];
    
    const cleanSheetKing = [...players]
      .filter(p => p.position.toLowerCase().includes('def') || p.position.toLowerCase().includes('gk'))
      .sort((a, b) => b.cleanSheets - a.cleanSheets)[0];

    return [
      {
        id: 'scorer',
        title: 'Maior Goleador',
        value: topScorer.goals,
        player: topScorer.name,
        icon: Target,
        borderColor: 'border-orange-500/50',
        bgColor: 'bg-orange-500/10',
        textColor: 'text-orange-500',
        gradientColor: 'from-orange-500 to-red-600',
      },
      {
        id: 'assister',
        title: 'Maior Assistente',
        value: topAssister.assists,
        player: topAssister.name,
        icon: Zap,
        borderColor: 'border-purple-500/50',
        bgColor: 'bg-purple-500/10',
        textColor: 'text-purple-500',
        gradientColor: 'from-purple-500 to-indigo-600',
      },
      {
        id: 'matches',
        title: 'Mais Partidas',
        value: mostMatches.matches,
        player: mostMatches.name,
        icon: Users,
        borderColor: 'border-blue-500/50',
        bgColor: 'bg-blue-500/10',
        textColor: 'text-blue-500',
        gradientColor: 'from-blue-500 to-cyan-600',
      },
      {
        id: 'rating',
        title: 'Melhor Nota',
        value: bestRating.avgRating.toFixed(2),
        player: bestRating.name,
        icon: Star,
        borderColor: 'border-yellow-500/50',
        bgColor: 'bg-yellow-500/10',
        textColor: 'text-yellow-500',
        gradientColor: 'from-yellow-500 to-orange-600',
      },
      {
        id: 'efficiency',
        title: 'Mais Eficiente',
        value: mostEfficient ? ((mostEfficient.goals + mostEfficient.assists) / mostEfficient.matches).toFixed(2) : '0.00',
        player: mostEfficient?.name || 'N/A',
        icon: Activity,
        borderColor: 'border-green-500/50',
        bgColor: 'bg-green-500/10',
        textColor: 'text-green-500',
        gradientColor: 'from-green-500 to-emerald-600',
      },
      {
        id: 'muralha',
        title: 'Maior Muralha',
        value: cleanSheetKing ? cleanSheetKing.cleanSheets : 0,
        player: cleanSheetKing?.name || 'N/A',
        icon: Shield,
        borderColor: 'border-cyan-400/50',
        bgColor: 'bg-cyan-400/10',
        textColor: 'text-cyan-400',
        gradientColor: 'from-cyan-400 to-blue-600',
      },
    ];
  }, [players, matches]);

  if (records.length === 0) return null;

  return (
    <section className="relative py-16 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      <Reveal>
        <SectionLabel>Legado do clube</SectionLabel>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-8 sm:mb-16 tracking-tighter">HALL DA FAMA</h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.map((record, idx) => {
          const Icon = record.icon;
          return (
            <Reveal key={record.id} delay={idx * 50}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className={`relative overflow-hidden rounded-2xl border-2 ${record.borderColor} p-6 sm:p-8 ${record.bgColor} backdrop-blur-md transition-all`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${record.gradientColor} opacity-5 blur-3xl`} />
                <div className="relative z-10 space-y-4">
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${record.gradientColor} p-3 flex items-center justify-center shadow-lg`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${record.textColor} uppercase tracking-widest mb-2 opacity-80`}>
                      {record.title}
                    </p>
                    <p className={`text-5xl sm:text-6xl font-black ${record.textColor}`}>
                      {record.value}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Jogador</p>
                    <p className="text-lg font-bold text-white truncate">{record.player}</p>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${record.gradientColor} border-2 ${record.borderColor}`}>
                    <Trophy size={14} className="text-white" />
                    <span className="text-xs font-black text-white uppercase">Recorde</span>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={300}>
        <div className="mt-16 relative overflow-hidden rounded-3xl p-8 sm:p-12 border-2 border-white/20 bg-white/5 backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent opacity-50" />
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Análise de Desempenho do Time</h3>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                <TrendingUp size={16} className="text-green-400" />
                <span className="text-sm font-bold text-white/80">Dados em Tempo Real</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-3">Total de Partidas</p>
                <p className="text-5xl font-black text-white">{stats.total}</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-3">Aproveitamento</p>
                <p className="text-5xl font-black text-green-400">{stats.aproveitamento}%</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-3">Saldo de Gols</p>
                <p className={`text-5xl font-black ${stats.saldo >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                  {stats.saldo > 0 ? '+' : ''}{stats.saldo}
                </p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-3">Gols por Jogo</p>
                <p className="text-5xl font-black text-purple-400">{stats.mediaGols}</p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
});

HallOfFame.displayName = 'HallOfFame';
