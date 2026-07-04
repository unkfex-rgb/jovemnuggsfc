import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp } from 'lucide-react';
import type { ClubStats } from '@/types/api';

interface DivisionProgressBarProps {
  stats: ClubStats;
}

export const DivisionProgressBar = React.memo(({ stats }: DivisionProgressBarProps) => {
  // Calcular pontos (vitória = 3, empate = 1, derrota = 0)
  const totalPoints = useMemo(() => {
    return stats.wins * 3 + stats.draws * 1;
  }, [stats.wins, stats.draws]);

  // Simular pontos necessários para próxima divisão (baseado em partidas)
  const pointsPerDivision = 45; // Aproximadamente 15 vitórias
  const divisionsClimbed = Math.floor(totalPoints / pointsPerDivision);
  const progressToNextDivision = (totalPoints % pointsPerDivision) / pointsPerDivision;

  // Calcular nível de reputação (0-100)
  const reputationLevel = Math.min(100, (totalPoints / (pointsPerDivision * 3)) * 100);

  return (
    <div className="space-y-6">
      {/* Divisão Atual */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-amber-400" />
            <span className="text-sm font-bold text-white/60 uppercase tracking-widest">Divisão Atual</span>
          </div>
          <span className="text-2xl font-black text-white">{divisionsClimbed + 1}</span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressToNextDivision * 100}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50" />
        </div>

        <div className="flex justify-between text-xs text-white/40">
          <span>{Math.floor(totalPoints % pointsPerDivision)} pts</span>
          <span>{pointsPerDivision} pts</span>
        </div>
      </div>

      {/* Reputação */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-cyan-400" />
            <span className="text-sm font-bold text-white/60 uppercase tracking-widest">Reputação</span>
          </div>
          <span className="text-2xl font-black text-white">{Math.floor(reputationLevel)}%</span>
        </div>

        {/* Reputation Bar */}
        <div className="relative h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${reputationLevel}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50" />
        </div>
      </div>

      {/* Stats Rápidas */}
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
        <div className="text-center">
          <div className="text-xs text-white/40 font-bold uppercase tracking-widest mb-1">Total de Pontos</div>
          <div className="text-lg font-black text-white">{totalPoints}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-white/40 font-bold uppercase tracking-widest mb-1">Aproveitamento</div>
          <div className="text-lg font-black text-white">{stats.aproveitamento}%</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-white/40 font-bold uppercase tracking-widest mb-1">Sequência</div>
          <div className="text-lg font-black text-white">
            {stats.currentStreak.count}
            <span className="text-xs ml-1">
              {stats.currentStreak.type === 'W' ? '🔥' : stats.currentStreak.type === 'L' ? '❌' : '➖'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

DivisionProgressBar.displayName = 'DivisionProgressBar';
