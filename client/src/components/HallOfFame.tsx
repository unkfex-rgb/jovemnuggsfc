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
        color: 'from-red-500 to-orange-500',
      },
      {
        id: 'top-assist',
        title: 'Maior Assistente',
        value: topAssist?.assists || 0,
        player: topAssist?.name || '-',
        icon: Zap,
        color: 'from-yellow-500 to-amber-500',
      },
      {
        id: 'most-matches',
        title: 'Mais Partidas',
        value: mostMatches?.matches || 0,
        player: mostMatches?.name || '-',
        icon: Flame,
        color: 'from-purple-500 to-pink-500',
      },
      {
        id: 'best-rating',
        title: 'Melhor Nota',
        value: bestRating?.avgRating.toFixed(2) || '0.00',
        player: bestRating?.name || '-',
        icon: Trophy,
        color: 'from-blue-500 to-cyan-500',
      },
      {
        id: 'clean-sheets',
        title: 'Mais Clean Sheets',
        value: mostCleanSheets?.cleanSheets || 0,
        player: mostCleanSheets?.name || '-',
        icon: Shield,
        color: 'from-green-500 to-emerald-500',
      },
      {
        id: 'biggest-victory',
        title: 'Maior Goleada',
        value: `${biggestVictory.match?.teamGoals || 0} - ${biggestVictory.match?.oppGoals || 0}`,
        player: biggestVictory.match?.opponent || '-',
        icon: TrendingUp,
        color: 'from-indigo-500 to-purple-500',
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
                whileHover={{ y: -8 }}
                className={`relative overflow-hidden rounded-2xl border border-white/10 p-6 sm:p-8 bg-gradient-to-br ${record.color} opacity-10 hover:opacity-20 transition-opacity`}
              >
                {/* Background Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${record.color} opacity-5 blur-2xl`} />

                {/* Content */}
                <div className="relative z-10 space-y-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${record.color} p-2.5 flex items-center justify-center`}>
                    <Icon size={24} className="text-white" />
                  </div>

                  {/* Title */}
                  <div>
                    <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">{record.title}</p>
                    <p className={`text-4xl sm:text-5xl font-black bg-gradient-to-r ${record.color} bg-clip-text text-transparent`}>
                      {record.value}
                    </p>
                  </div>

                  {/* Player Name */}
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Jogador</p>
                    <p className="text-lg font-bold text-white truncate">{record.player}</p>
                  </div>

                  {/* Badge */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${record.color} opacity-20 border border-white/20`}>
                    <Trophy size={12} className="text-white" />
                    <span className="text-xs font-bold text-white uppercase">Recorde</span>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          );
        })}
      </div>

      {/* Club Stats Summary */}
      <Reveal delay={300}>
        <div className="mt-16 glass-dark rounded-3xl p-8 sm:p-12 border border-white/10">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-8">Estatísticas Gerais do Clube</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Total de Partidas</p>
              <p className="text-4xl font-black text-white">{stats.total}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Aproveitamento</p>
              <p className="text-4xl font-black text-white">{stats.aproveitamento}%</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Saldo de Gols</p>
              <p className={`text-4xl font-black ${stats.saldo >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.saldo > 0 ? '+' : ''}{stats.saldo}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Melhor Sequência</p>
              <p className="text-4xl font-black text-white">{stats.bestStreak}x</p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
});

HallOfFame.displayName = 'HallOfFame';
