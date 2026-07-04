import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Target, Zap, Shield, TrendingUp } from 'lucide-react';
import { SectionLabel } from './SectionLabel';
import { Reveal } from './Reveal';
import type { Player, ClubStats, Match } from '@/types/api';

interface HallOfFameProps {
  players: Player[];
  stats: ClubStats;
  matches: Match[];
}

export const HallOfFame = React.memo(({ players, stats, matches }: HallOfFameProps) => {
  const records = useMemo(() => {
    if (players.length === 0 || matches.length === 0) return [];

    const topScorer = [...players].sort((a, b) => b.goals - a.goals)[0];
    const topAssist = [...players].sort((a, b) => b.assists - a.assists)[0];
    const mostMatches = [...players].sort((a, b) => b.matches - a.matches)[0];
    const bestRating = [...players].sort((a, b) => b.avgRating - a.avgRating)[0];
    const mostCleanSheets = [...players].sort((a, b) => b.cleanSheets - a.cleanSheets)[0];

    // Calcular maior goleada
    let biggestVictory = { diff: 0, match: null as Match | null };
    matches.forEach((m) => {
      if (m.result === 'W') {
        const diff = m.teamGoals - m.oppGoals;
        if (diff > biggestVictory.diff) {
          biggestVictory = { diff, match: m };
        }
      }
    });

    return [
      {
        id: 'top-scorer',
        title: 'Maior Goleador',
        value: topScorer?.goals || 0,
        player: topScorer?.name || '-',
        icon: Target,
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-400/50',
        textColor: 'text-red-400',
        gradientColor: 'from-red-400 to-red-600',
      },
      {
        id: 'top-assist',
        title: 'Maior Assistente',
        value: topAssist?.assists || 0,
        player: topAssist?.name || '-',
        icon: Zap,
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-400/50',
        textColor: 'text-yellow-400',
        gradientColor: 'from-yellow-400 to-yellow-600',
      },
      {
        id: 'most-matches',
        title: 'Mais Partidas',
        value: mostMatches?.matches || 0,
        player: mostMatches?.name || '-',
        icon: Flame,
        bgColor: 'bg-purple-500/20',
        borderColor: 'border-purple-400/50',
        textColor: 'text-purple-400',
        gradientColor: 'from-purple-400 to-purple-600',
      },
      {
        id: 'best-rating',
        title: 'Melhor Nota',
        value: bestRating?.avgRating.toFixed(2) || '0.00',
        player: bestRating?.name || '-',
        icon: Trophy,
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-400/50',
        textColor: 'text-blue-400',
        gradientColor: 'from-blue-400 to-blue-600',
      },
      {
        id: 'clean-sheets',
        title: 'Mais Clean Sheets',
        value: mostCleanSheets?.cleanSheets || 0,
        player: mostCleanSheets?.name || '-',
        icon: Shield,
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-400/50',
        textColor: 'text-green-400',
        gradientColor: 'from-green-400 to-green-600',
      },
      {
        id: 'biggest-victory',
        title: 'Maior Goleada',
        value: `${biggestVictory.match?.teamGoals || 0} - ${biggestVictory.match?.oppGoals || 0}`,
        player: biggestVictory.match?.opponent || '-',
        icon: TrendingUp,
        bgColor: 'bg-cyan-500/20',
        borderColor: 'border-cyan-400/50',
        textColor: 'text-cyan-400',
        gradientColor: 'from-cyan-400 to-cyan-600',
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

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.map((record, idx) => {
          const Icon = record.icon;
          return (
            <Reveal key={record.id} delay={idx * 50}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className={`relative overflow-hidden rounded-2xl border-2 ${record.borderColor} p-6 sm:p-8 ${record.bgColor} backdrop-blur-md transition-all`}
              >
                {/* Background Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${record.gradientColor} opacity-5 blur-3xl`} />

                {/* Content */}
                <div className="relative z-10 space-y-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${record.gradientColor} p-3 flex items-center justify-center shadow-lg`}>
                    <Icon size={28} className="text-white" />
                  </div>

                  {/* Title */}
                  <div>
                    <p className={`text-xs font-bold ${record.textColor} uppercase tracking-widest mb-2 opacity-80`}>
                      {record.title}
                    </p>
                    <p className={`text-5xl sm:text-6xl font-black ${record.textColor}`}>
                      {record.value}
                    </p>
                  </div>

                  {/* Player Name */}
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Jogador</p>
                    <p className="text-lg font-bold text-white truncate">{record.player}</p>
                  </div>

                  {/* Badge */}
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

      {/* Club Stats Summary */}
      <Reveal delay={300}>
        <div className="mt-16 relative overflow-hidden rounded-3xl p-8 sm:p-12 border-2 border-white/20 bg-white/5 backdrop-blur-md">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent opacity-50" />
          
          <div className="relative z-10">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-8">Estatísticas Gerais do Clube</h3>
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
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-3">Melhor Sequência</p>
                <p className="text-5xl font-black text-purple-400">{stats.bestStreak}x</p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
});

HallOfFame.displayName = 'HallOfFame';
