import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Zap, Shield, TrendingUp } from 'lucide-react';
import { getPositionLabel, getPositionColor } from '@/lib/playerUtils';
import type { Player } from '@/types/api';

interface PlayerProfileModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PlayerProfileModal = React.memo(({ player, isOpen, onClose }: PlayerProfileModalProps) => {
  if (!player) return null;

  const stats = [
    { label: 'Partidas', value: player.matches, icon: TrendingUp, color: 'text-blue-400' },
    { label: 'Gols', value: player.goals, icon: Target, color: 'text-red-400' },
    { label: 'Assistências', value: player.assists, icon: Zap, color: 'text-yellow-400' },
    { label: 'Passes', value: player.passes, icon: Shield, color: 'text-green-400' },
  ];

  const performance = [
    { label: 'Nota Média', value: player.avgRating.toFixed(2), color: 'from-purple-500 to-pink-500' },
    { label: 'Shots', value: player.shots, color: 'from-orange-500 to-red-500' },
    { label: 'Clean Sheets', value: player.cleanSheets, color: 'from-blue-500 to-cyan-500' },
    { label: 'Posição', value: getPositionLabel(player.position), color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-2xl glass-dark rounded-3xl border border-white/20 overflow-hidden max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className={`relative p-8 bg-gradient-to-r ${getPositionColor(player.position)} opacity-20`}>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>

                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-b from-white/20 to-transparent flex items-center justify-center border-2 border-white/20">
                    <span className="text-4xl font-black text-white/80">
                      {player.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-3xl font-black text-white mb-2">{player.name}</h2>
                    <p className="text-white/60 font-bold uppercase tracking-widest text-sm">
                      {getPositionLabel(player.position)}
                    </p>
                    <div className="mt-3 flex gap-3">
                      <div className="px-3 py-1 rounded-lg bg-white/10 border border-white/20">
                        <span className="text-xs font-bold text-white/70">Nota: {player.avgRating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                {/* Stats Grid */}
                <div>
                  <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">Estatísticas Principais</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => {
                      const Icon = stat.icon;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="glass-dark p-4 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Icon size={16} className={stat.color} />
                            <span className="text-xs font-bold text-white/50 uppercase">{stat.label}</span>
                          </div>
                          <p className="text-2xl font-black text-white">{stat.value}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Performance Breakdown */}
                <div>
                  <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">Performance Detalhada</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {performance.map((perf, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative overflow-hidden rounded-xl border border-white/10"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r ${perf.color} opacity-5`} />
                        <div className="relative p-4">
                          <p className="text-xs font-bold text-white/50 uppercase mb-2">{perf.label}</p>
                          <p className={`text-2xl font-black bg-gradient-to-r ${perf.color} bg-clip-text text-transparent`}>
                            {perf.value}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Contribution */}
                <div>
                  <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">Contribuição Total</h3>
                  <div className="glass-dark p-6 rounded-xl border border-white/10">
                    <div className="flex items-end justify-around">
                      <div className="text-center">
                        <p className="text-xs text-white/50 font-bold mb-2">Gols + Assists</p>
                        <p className="text-4xl font-black text-white">{player.goals + player.assists}</p>
                      </div>
                      <div className="w-1 h-16 bg-gradient-to-t from-white/20 to-transparent rounded" />
                      <div className="text-center">
                        <p className="text-xs text-white/50 font-bold mb-2">Média por Jogo</p>
                        <p className="text-4xl font-black text-white">
                          {((player.goals + player.assists) / Math.max(player.matches, 1)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

PlayerProfileModal.displayName = 'PlayerProfileModal';
