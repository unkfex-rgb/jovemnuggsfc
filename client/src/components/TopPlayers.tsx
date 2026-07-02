import React, { memo } from 'react';
import { trpc } from '../lib/trpc';
import { getInitials, getPositionColor, getPositionLabel } from '../lib/playerUtils';
import { motion } from 'framer-motion';

const TopPlayerCard = memo(({ player, rank, category }: any) => {
  const colorMap = {
    goals: 'from-red-500 to-pink-400',
    assists: 'from-blue-500 to-cyan-400',
    rating: 'from-yellow-500 to-orange-400',
  };

  const color = colorMap[category as keyof typeof colorMap];
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
      {/* Animated glow background */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${color} rounded-xl opacity-0 group-hover:opacity-60 blur-lg transition-all duration-500`} />

      {/* Card Container */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-black border border-white/10 group-hover:border-white/30 rounded-xl p-5 text-center transition-all duration-300 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
        }} />

        {/* Content */}
        <div className="relative z-10">
          {/* Rank Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
            viewport={{ once: true }}
            className={`text-5 font-900 mb-3 bg-gradient-to-r ${color} bg-clip-text text-transparent`}
          >
            #{rank}
          </motion.div>

          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className={`w-14 h-14 rounded-lg mx-auto mb-3 flex items-center justify-center font-orbitron font-700 text-4 text-white bg-gradient-to-br ${getPositionColor(player.position)} shadow-lg shadow-cyan-500/20 border-2 border-white/20 group-hover:border-white/50 transition-all duration-300`}
          >
            {getInitials(player.name)}
          </motion.div>

          {/* Player Name */}
          <h3 className="text-3 font-800 truncate text-white mb-1 group-hover:text-cyan-300 transition-colors duration-300">
            {player.name}
          </h3>

          {/* Position */}
          <p className="text-2.5 text-gray-400 uppercase tracking-wide mb-3">{positionLabel}</p>

          {/* Main Stat */}
          <div className={`text-4 font-900 bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
            {category === 'goals' && `${player.goals} Gols`}
            {category === 'assists' && `${player.assists} Assist`}
            {category === 'rating' && `${player.averageRating} ⭐`}
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
            className="text-3.5"
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
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-yellow-500/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="max-w-270 mx-auto relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-5 md:text-8 font-900 tracking-wider mb-4 font-orbitron text-center">
            <span className="bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Top Jogadores
            </span>
          </h2>
          <p className="text-center text-gray-400 text-3 md:text-3.5">
            Destaques por categoria de desempenho
          </p>
        </motion.div>

        {/* Categories */}
        <div className="space-y-16">
          {[
            { title: 'Top Gols 🔴', players: topData.topByGoals, category: 'goals', color: 'from-red-500 to-pink-400', icon: '⚽' },
            { title: 'Top Assistências 🔵', players: topData.topByAssists, category: 'assists', color: 'from-blue-500 to-cyan-400', icon: '🎯' },
            { title: 'Top Rating ⭐', players: topData.topByRating, category: 'rating', color: 'from-yellow-500 to-orange-400', icon: '👑' },
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
                className={`text-3.5 md:text-5 font-800 mb-8 font-orbitron bg-gradient-to-r ${section.color} bg-clip-text text-transparent flex items-center gap-3`}
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
