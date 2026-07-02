import React, { useState, memo, useEffect } from 'react';
import { getInitials, getPositionColor, getPositionLabel, calculatePlayerScore } from '../lib/playerUtils';
import { motion, AnimatePresence } from 'framer-motion';

export const PlayerCardExpanded = memo(({ player, onClose }: any) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const positionLabel = getPositionLabel(player.position);
  const playerScore = calculatePlayerScore(player);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-black border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/20">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 text-3 font-bold"
            >
              ✕
            </button>

            {/* Header with gradient background */}
            <div className="relative h-32 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border-b border-cyan-500/20">
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)',
              }} />
            </div>

            {/* Main Content */}
            <div className="relative px-8 py-6">
              {/* Player Info Header */}
              <div className="flex items-start gap-6 mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
                  className={`w-24 h-24 rounded-xl flex items-center justify-center font-orbitron font-900 text-6 text-white bg-gradient-to-br ${getPositionColor(player.position)} shadow-lg shadow-cyan-500/50 flex-shrink-0 border-2 border-cyan-400/50`}
                >
                  {getInitials(player.name)}
                </motion.div>

                <div className="flex-1 pt-2">
                  <h2 className="text-5 font-900 text-white mb-2">{player.name}</h2>
                  <div className="flex gap-3 flex-wrap">
                    <div className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-lg">
                      <span className="text-2.5 font-bold text-cyan-300">{positionLabel}</span>
                    </div>
                    <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-lg">
                      <span className="text-2.5 font-bold text-purple-300">Score: {playerScore}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 text-center hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className="text-2.5 text-gray-400 font-medium mb-1">Partidas</div>
                  <div className="text-4 font-900 text-cyan-400">{player.matches}</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 text-center hover:border-red-500/30 transition-all duration-300"
                >
                  <div className="text-2.5 text-gray-400 font-medium mb-1">Gols</div>
                  <div className="text-4 font-900 text-red-400">{player.goals}</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 text-center hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="text-2.5 text-gray-400 font-medium mb-1">Assistências</div>
                  <div className="text-4 font-900 text-blue-400">{player.assists}</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 text-center hover:border-yellow-500/30 transition-all duration-300"
                >
                  <div className="text-2.5 text-gray-400 font-medium mb-1">Rating</div>
                  <div className="text-4 font-900 text-yellow-400">{player.averageRating}</div>
                </motion.div>
              </div>

              {/* Performance Bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2.75 font-bold text-gray-300">Desempenho Geral</span>
                  <span className="text-3 font-900 text-cyan-400">{Math.min(100, Math.round((playerScore / 100) * 100))}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.round((playerScore / 100) * 100))}%` }}
                    transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

PlayerCardExpanded.displayName = 'PlayerCardExpanded';

export const PlayerCard = memo(({ player }: any) => {
  const [showDetails, setShowDetails] = useState(false);
  const positionLabel = getPositionLabel(player.position);
  const playerScore = calculatePlayerScore(player);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowDetails(true)}
        className="group relative w-full text-left focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black rounded-xl transition-all duration-300"
      >
        {/* Animated background glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-50 blur-lg transition-all duration-500 group-hover:blur group-active:blur-none" />

        {/* Card Container */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-black border border-white/10 group-hover:border-cyan-500/50 rounded-xl p-5 transition-all duration-300 overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)',
          }} />

          {/* Content */}
          <div className="relative z-10">
            {/* Position Badge */}
            <div className="mb-3 flex justify-between items-start">
              <span className="inline-block px-2.5 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-lg text-2 font-bold text-cyan-300 uppercase tracking-wider">
                {positionLabel}
              </span>
              <span className="inline-block px-2.5 py-1 bg-purple-500/20 border border-purple-500/50 rounded-lg text-2 font-bold text-purple-300">
                {playerScore}
              </span>
            </div>

            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center font-orbitron font-900 text-5 text-white bg-gradient-to-br ${getPositionColor(player.position)} shadow-lg shadow-cyan-500/30 border-2 border-cyan-400/30 group-hover:border-cyan-400/70 transition-all duration-300`}
            >
              {getInitials(player.name)}
            </motion.div>

            {/* Player Name */}
            <h3 className="text-3 font-800 truncate text-white text-center mb-2 group-hover:text-cyan-300 transition-colors duration-300">
              {player.name}
            </h3>

            {/* Stats Preview */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center">
                <div className="text-1.75 text-gray-400">Partidas</div>
                <div className="text-3 font-900 text-cyan-400">{player.matches}</div>
              </div>
              <div className="text-center">
                <div className="text-1.75 text-gray-400">Gols</div>
                <div className="text-3 font-900 text-red-400">{player.goals}</div>
              </div>
              <div className="text-center">
                <div className="text-1.75 text-gray-400">Rating</div>
                <div className="text-3 font-900 text-yellow-400">{player.averageRating}</div>
              </div>
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="text-center text-2 text-cyan-400 font-bold group-hover:text-cyan-300 transition-colors duration-300"
            >
              Ver Detalhes →
            </motion.div>
          </div>
        </div>
      </motion.button>

      {/* Expanded Card Modal */}
      <AnimatePresence>
        {showDetails && (
          <PlayerCardExpanded player={player} onClose={() => setShowDetails(false)} />
        )}
      </AnimatePresence>
    </>
  );
});

PlayerCard.displayName = 'PlayerCard';
