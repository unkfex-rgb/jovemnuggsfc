import React, { useMemo, memo, useState } from 'react';
import { trpc } from '../lib/trpc';
import { PlayerCard } from './PlayerCard';
import { getPositionCategory, getPositionLabel } from '../lib/playerUtils';
import { motion } from 'framer-motion';

export default memo(function Elenco() {
  const { data: stats } = trpc.club.stats.useQuery();
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  const players = useMemo(() => {
    if (!stats?.players) return [];
    return Object.values(stats.players).sort((a: any, b: any) => b.matches - a.matches);
  }, [stats]);

  const positions = useMemo(() => {
    const uniquePositions = new Set(players.map((p: any) => getPositionCategory(p.position)));
    return Array.from(uniquePositions);
  }, [players]);

  const filteredPlayers = useMemo(() => {
    if (!selectedPosition) return players;
    return players.filter((p: any) => getPositionCategory(p.position) === selectedPosition);
  }, [players, selectedPosition]);

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
    },
  };

  return (
    <section className="relative py-20 px-5 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-20 pointer-events-none" />

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
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Elenco Completo
            </span>
          </h2>
          <p className="text-center text-gray-400 text-3 md:text-3.5">
            {filteredPlayers.length} jogador{filteredPlayers.length !== 1 ? 'es' : ''} no elenco
          </p>
        </motion.div>

        {/* Position Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-wrap gap-3 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedPosition(null)}
            className={`px-6 py-2.5 rounded-lg font-bold text-2.5 transition-all duration-300 ${
              selectedPosition === null
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                : 'bg-white/5 border border-white/10 text-gray-300 hover:border-cyan-500/50'
            }`}
          >
            Todos
          </motion.button>

          {positions.map((pos) => (
            <motion.button
              key={pos}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedPosition(pos)}
              className={`px-6 py-2.5 rounded-lg font-bold text-2.5 transition-all duration-300 ${
                selectedPosition === pos
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:border-cyan-500/50'
              }`}
            >
              {getPositionLabel(pos)}
            </motion.button>
          ))}
        </motion.div>

        {/* Players Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {filteredPlayers.map((player: any, idx: number) => (
            <motion.div key={idx} variants={itemVariants as any}>
              <PlayerCard player={player} />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredPlayers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-3.5">Nenhum jogador encontrado nesta posição.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
});
