import React, { memo } from 'react';
import { trpc } from '../lib/trpc';
import { getInitials, getPositionLabel, getPositionColor } from '../lib/playerUtils';
import { motion } from 'framer-motion';

const TopPlayerCard = memo(({ player, rank, category }: any) => {
  const positionLabel = getPositionLabel(player.position);

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      viewport={{ once: true }}
      className="group relative"
    >
      {/* Card Container */}
      <div className="relative bg-black border border-cyan-400/40 rounded-none p-5 text-center transition-all duration-300 overflow-hidden hover:border-cyan-400/80" style={{
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
          {/* Rank Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
            viewport={{ once: true }}
            className="text-4 font-900 mb-3 text-cyan-400 font-mono" style={{
              textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
            }}
          >
            #{rank}
          </motion.div>

          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className={`w-14 h-14 rounded-none mx-auto mb-3 flex items-center justify-center font-orbitron font-700 text-3 text-white bg-gradient-to-br ${getPositionColor(player.position)} border-2 border-cyan-400 group-hover:border-cyan-300 transition-all duration-300`} style={{
              boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
            }}
          >
            {getInitials(player.name)}
          </motion.div>

          {/* Player Name */}
          <h3 className="text-2.5 font-800 truncate text-white mb-1 group-hover:text-cyan-300 transition-colors duration-300 font-mono">
            {player.name}
          </h3>

          {/* Position */}
          <p className="text-2 text-gray-400 uppercase tracking-wide mb-3 font-mono">{positionLabel}</p>

          {/* Main Stat */}
          <div className="text-3.5 font-900 text-white font-mono" style={{
            textShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
          }}>
            {category === 'goals' && `${player.goals} GOLS`}
            {category === 'assists' && `${player.assists} ASSIST`}
            {category === 'rating' && `${player.averageRating}`}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

TopPlayerCard.displayName = 'TopPlayerCard';

export default memo(function TopPlayers() {
  const { data: topData } = trpc.club.topPlayers.useQuery();

  if (!topData) {
    return (
      <section className="relative py-20 px-5">
        <div className="max-w-270 mx-auto text-center text-gray-400">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-3.5 font-mono"
          >
            Carregando top jogadores...
          </motion.div>
        </div>
      </section>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <section className="relative py-20 px-5 overflow-hidden">
      {/* Fundo preto com grid pattern */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 opacity-3" style={{
        backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, 0.03) 25%, rgba(0, 255, 255, 0.03) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.03) 75%, rgba(0, 255, 255, 0.03) 76%, transparent 77%, transparent),
                         linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, 0.03) 25%, rgba(0, 255, 255, 0.03) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.03) 75%, rgba(0, 255, 255, 0.03) 76%, transparent 77%, transparent)`,
        backgroundSize: '50px 50px'
      }} />

      {/* Neon glow sutil */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/5 blur-3xl rounded-full opacity-30" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 blur-3xl rounded-full opacity-30" />

      <div className="max-w-270 mx-auto relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-5 md:text-8 font-900 tracking-widest mb-4 font-orbitron text-center text-white" style={{
            textShadow: '0 0 20px rgba(0, 255, 255, 0.4)',
            letterSpacing: '0.08em'
          }}>
            TOP JOGADORES
          </h2>
          <p className="text-center text-gray-400 text-3 md:text-3.5 font-mono">
            Destaques por categoria de desempenho
          </p>
        </motion.div>

        {/* Categories */}
        <div className="space-y-16">
          {[
            { title: 'TOP GOLS', players: topData.topByGoals, category: 'goals', icon: '⚽' },
            { title: 'TOP ASSISTÊNCIAS', players: topData.topByAssists, category: 'assists', icon: '🎯' },
            { title: 'TOP RATING', players: topData.topByRating, category: 'rating', icon: '👑' },
          ].map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Section Header */}
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-3.5 md:text-5 font-800 mb-8 font-orbitron text-white flex items-center gap-3 tracking-widest" style={{
                  textShadow: '0 0 15px rgba(0, 255, 255, 0.3)'
                }}
              >
                <span>{section.icon}</span>
                {section.title}
              </motion.h3>

              {/* Players Grid */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4"
              >
                {section.players.map((player: any, pidx: number) => (
                  <TopPlayerCard
                    key={pidx}
                    player={player}
                    rank={pidx + 1}
                    category={section.category}
                  />
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});
