import React from 'react';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, Zap } from 'lucide-react';
import type { ClubStats } from '@/types/api';

interface MatchDayBannerProps {
  stats: ClubStats;
}

export const MatchDayBanner = React.memo(({ stats }: MatchDayBannerProps) => {
  // Determinar o status do time
  const getStatus = () => {
    if (stats.currentStreak.type === 'W' && stats.currentStreak.count >= 3) {
      return {
        label: 'ON FIRE 🔥',
        message: `${stats.currentStreak.count} vitórias seguidas!`,
        color: 'from-red-600 to-orange-600',
        icon: Flame,
        intensity: 'high',
      };
    }
    if (stats.currentStreak.type === 'W' && stats.currentStreak.count >= 1) {
      return {
        label: 'EM FORMA ⚡',
        message: `${stats.currentStreak.count} vitória${stats.currentStreak.count > 1 ? 's' : ''} recente${stats.currentStreak.count > 1 ? 's' : ''}`,
        color: 'from-yellow-600 to-amber-600',
        icon: Zap,
        intensity: 'medium',
      };
    }
    if (stats.aproveitamento >= 70) {
      return {
        label: 'BUSCANDO TOPO 📈',
        message: `${stats.aproveitamento}% de aproveitamento`,
        color: 'from-green-600 to-emerald-600',
        icon: TrendingUp,
        intensity: 'medium',
      };
    }
    return null;
  };

  const status = getStatus();

  if (!status) return null;

  const Icon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative mb-8 overflow-hidden rounded-2xl"
    >
      {/* Animated Background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${status.color} opacity-10`} />
      
      {/* Animated Particles */}
      {status.intensity === 'high' && (
        <>
          <motion.div
            animate={{ x: [0, 100, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-2 left-0 w-2 h-2 bg-red-500 rounded-full blur-sm"
          />
          <motion.div
            animate={{ x: [100, 0, 100], opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            className="absolute bottom-2 right-0 w-2 h-2 bg-orange-500 rounded-full blur-sm"
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 px-6 py-4 sm:px-8 sm:py-6 border border-white/20 rounded-2xl backdrop-blur-md">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`p-2 rounded-lg bg-gradient-to-r ${status.color} opacity-20`}
            >
              <Icon className="text-white" size={24} />
            </motion.div>
            <div>
              <p className={`text-xs sm:text-sm font-black uppercase tracking-widest bg-gradient-to-r ${status.color} bg-clip-text text-transparent`}>
                {status.label}
              </p>
              <p className="text-white/70 text-xs sm:text-sm font-bold mt-1">
                {status.message}
              </p>
            </div>
          </div>

          {/* Decorative Element */}
          <div className="hidden sm:flex items-center gap-2 text-white/30">
            <div className="w-1 h-1 rounded-full bg-white/30" />
            <div className="w-1 h-1 rounded-full bg-white/30" />
            <div className="w-1 h-1 rounded-full bg-white/30" />
          </div>
        </div>
      </div>

      {/* Glow Effect */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        className={`absolute inset-0 bg-gradient-to-r ${status.color} opacity-0 blur-2xl -z-10`}
      />
    </motion.div>
  );
});

MatchDayBanner.displayName = 'MatchDayBanner';
