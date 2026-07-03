import React, { memo, useState, useMemo } from 'react';
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
      {/* Fundo preto com grid pattern */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 opacity-3" style={{
        backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, 0.03) 25%, rgba(0, 255, 255, 0.03) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.03) 75%, rgba(0, 255, 255, 0.03) 76%, transparent 77%, transparent),
                         linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, 0.03) 25%, rgba(0, 255, 255, 0.03) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.03) 75%, rgba(0, 255, 255, 0.03) 76%, transparent 77%, transparent)`,
        backgroundSize: '50px 50px'
      }} />

      {/* Neon glow sutil */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-3xl rounded-full opacity-30" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 blur-3xl rounded-full opacity-30" />

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
            ELENCO COMPLETO
          </h2>
          <p className="text-center text-gray-400 text-3 md:text-3.5 font-mono">
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
            className={`px-6 py-2.5 font-bold text-2.5 transition-all duration-300 border font-mono uppercase tracking-widest ${
              selectedPosition === null
                ? 'bg-black border-cyan-400 text-cyan-400'
                : 'bg-black border-cyan-400/30 text-gray-400 hover:border-cyan-400/60'
            }`}
            style={selectedPosition === null ? {
              boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)'
            } : {
              boxShadow: '0 0 8px rgba(0, 255, 255, 0.2)'
            }}
          >
            Todos
          </motion.button>

          {positions.map((pos) => (
            <motion.button
              key={pos}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedPosition(pos)}
              className={`px-6 py-2.5 font-bold text-2.5 transition-all duration-300 border font-mono uppercase tracking-widest ${
                selectedPosition === pos
                  ? 'bg-black border-cyan-400 text-cyan-400'
                  : 'bg-black border-cyan-400/30 text-gray-400 hover:border-cyan-400/60'
              }`}
              style={selectedPosition === pos ? {
                boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)'
              } : {
                boxShadow: '0 0 8px rgba(0, 255, 255, 0.2)'
              }}
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

        {filteredPlayers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 font-mono">Nenhum jogador encontrado.</div>
          </div>
        )}
      </div>
    </section>
  );
});
