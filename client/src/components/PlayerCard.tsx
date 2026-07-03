import React, { memo, useState, useEffect } from 'react';
import { getInitials, getPositionLabel, getPositionColor, calculatePlayerScore } from '../lib/playerUtils';
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-black border-2 border-cyan-400 overflow-hidden shadow-2xl" style={{
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.5)'
          }}>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-gray-300 hover:text-cyan-400 border border-gray-400 hover:border-cyan-400 transition-all duration-200 text-3 font-bold"
            >
              ✕
            </button>

            {/* Header */}
            <div className="relative h-24 bg-black border-b border-cyan-400/30" style={{
              backgroundImage: `linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, 0.02) 25%, rgba(0, 255, 255, 0.02) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.02) 75%, rgba(0, 255, 255, 0.02) 76%, transparent 77%, transparent)`,
              backgroundSize: '50px 50px'
            }} />

            {/* Main Content */}
            <div className="relative px-8 py-6">
              {/* Player Info Header */}
              <div className="flex items-start gap-6 mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
                  className={`w-24 h-24 flex items-center justify-center font-orbitron font-900 text-5 text-white bg-gradient-to-br ${getPositionColor(player.position)} border-2 border-cyan-400 flex-shrink-0`} style={{
                    boxShadow: '0 0 15px rgba(0, 255, 255, 0.4)'
                  }}
                >
                  {getInitials(player.name)}
                </motion.div>

                <div className="flex-1 pt-2">
                  <h2 className="text-5 font-900 text-white mb-2 font-mono">{player.name}</h2>
                  <div className="flex gap-3 flex-wrap">
                    <div className="px-3 py-1 bg-black border border-cyan-400 rounded-none">
                      <span className="text-2.5 font-bold text-cyan-400 font-mono uppercase">{positionLabel}</span>
                    </div>
                    <div className="px-3 py-1 bg-black border border-cyan-400/50 rounded-none">
                      <span className="text-2.5 font-bold text-white font-mono">Score: {playerScore}</span>
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
                  className="bg-black border border-cyan-400/40 p-4 text-center hover:border-cyan-400/80 transition-all duration-300" style={{
                    boxShadow: '0 0 8px rgba(0, 255, 255, 0.2)'
                  }}
                >
                  <div className="text-2.5 text-gray-400 font-medium mb-1 font-mono uppercase">Partidas</div>
                  <div className="text-4 font-900 text-white">{player.matches}</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-black border border-cyan-400/40 p-4 text-center hover:border-cyan-400/80 transition-all duration-300" style={{
                    boxShadow: '0 0 8px rgba(0, 255, 255, 0.2)'
                  }}
                >
                  <div className="text-2.5 text-gray-400 font-medium mb-1 font-mono uppercase">Gols</div>
                  <div className="text-4 font-900 text-white">{player.goals}</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="bg-black border border-cyan-400/40 p-4 text-center hover:border-cyan-400/80 transition-all duration-300" style={{
                    boxShadow: '0 0 8px rgba(0, 255, 255, 0.2)'
                  }}
                >
                  <div className="text-2.5 text-gray-400 font-medium mb-1 font-mono uppercase">Assistências</div>
                  <div className="text-4 font-900 text-white">{player.assists}</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-black border border-cyan-400/40 p-4 text-center hover:border-cyan-400/80 transition-all duration-300" style={{
                    boxShadow: '0 0 8px rgba(0, 255, 255, 0.2)'
                  }}
                >
                  <div className="text-2.5 text-gray-400 font-medium mb-1 font-mono uppercase">Rating</div>
                  <div className="text-4 font-900 text-white">{player.averageRating}</div>
                </motion.div>
              </div>

              {/* Performance Bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="bg-black border border-cyan-400/30 p-4" style={{
                  boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)'
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2.75 font-bold text-gray-300 font-mono uppercase">Desempenho Geral</span>
                  <span className="text-3 font-900 text-cyan-400 font-mono">{Math.min(100, Math.round((playerScore / 100) * 100))}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-none overflow-hidden border border-cyan-400/20">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.round((playerScore / 100) * 100))}%` }}
                    transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-cyan-400"
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
        className="group relative w-full text-left focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-none transition-all duration-300"
      >
        {/* Card Container */}
        <div className="relative bg-black border border-cyan-400/40 group-hover:border-cyan-400/80 p-5 transition-all duration-300 overflow-hidden" style={{
          boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)'
        }} onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.8)';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
        }} onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.4)';
          e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.2)';
        }}>
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.1) 0%, transparent 50%)',
          }} />

          {/* Content */}
          <div className="relative z-10">
            {/* Position Badge */}
            <div className="mb-3 flex justify-between items-start">
              <span className="inline-block px-2.5 py-1 bg-black border border-cyan-400 text-2 font-bold text-cyan-400 uppercase tracking-wider font-mono">
                {positionLabel}
              </span>
              <span className="inline-block px-2.5 py-1 bg-black border border-cyan-400/50 text-2 font-bold text-white font-mono">
                {playerScore}
              </span>
            </div>

            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`w-16 h-16 rounded-none mx-auto mb-4 flex items-center justify-center font-orbitron font-900 text-5 text-white bg-gradient-to-br ${getPositionColor(player.position)} border-2 border-cyan-400 group-hover:border-cyan-300 transition-all duration-300`} style={{
                boxShadow: '0 0 10px rgba(0, 255, 255, 0.4)'
              }}
            >
              {getInitials(player.name)}
            </motion.div>

            {/* Player Name */}
            <h3 className="text-3 font-800 truncate text-white text-center mb-2 group-hover:text-cyan-300 transition-colors duration-300 font-mono">
              {player.name}
            </h3>

            {/* Stats Preview */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center">
                <div className="text-1.75 text-gray-400 font-mono">Partidas</div>
                <div className="text-3 font-900 text-white">{player.matches}</div>
              </div>
              <div className="text-center">
                <div className="text-1.75 text-gray-400 font-mono">Gols</div>
                <div className="text-3 font-900 text-white">{player.goals}</div>
              </div>
              <div className="text-center">
                <div className="text-1.75 text-gray-400 font-mono">Rating</div>
                <div className="text-3 font-900 text-white">{player.averageRating}</div>
              </div>
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="text-center text-2 text-cyan-400 font-bold group-hover:text-cyan-300 transition-colors duration-300 font-mono"
            >
              VER DETALHES →
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
