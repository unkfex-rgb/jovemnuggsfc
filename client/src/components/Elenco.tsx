import React, { memo, useState, useMemo } from 'react';
import { PlayerCard } from './PlayerCard';
import { getPositionCategory, getPositionLabel } from '../lib/playerUtils';
import { motion } from 'framer-motion';
import { SectionLabel } from './SectionLabel';
import { Reveal } from './Reveal';
import type { Player } from '@/types/api';

interface ElencoProps {
  players: Player[];
  loading?: boolean;
}

export default memo(function Elenco({ players, loading }: ElencoProps) {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  const positions = useMemo(() => {
    const uniquePositions = new Set(players.map((p) => getPositionCategory(p.position)));
    return Array.from(uniquePositions);
  }, [players]);

  const filteredPlayers = useMemo(() => {
    if (!selectedPosition) return players;
    return players.filter((p) => getPositionCategory(p.position) === selectedPosition);
  }, [players, selectedPosition]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <section id="elenco" className="relative py-28 px-6 max-w-7xl mx-auto">
      <Reveal>
        <SectionLabel>Elite Squad</SectionLabel>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">ELENCO</h2>
            <p className="text-white/40 mt-2 font-medium">
              {filteredPlayers.length} jogador{filteredPlayers.length !== 1 ? 'es' : ''} no elenco ativo
            </p>
          </div>

          {/* Position Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedPosition(null)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-lg border ${
                selectedPosition === null
                  ? 'bg-white text-black border-white'
                  : 'bg-white/5 text-white/40 border-white/10 hover:border-white/30'
              }`}
            >
              Todos
            </button>
            {positions.map((pos) => (
              <button
                key={pos}
                onClick={() => setSelectedPosition(pos)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-lg border ${
                  selectedPosition === pos
                    ? 'bg-white text-black border-white'
                    : 'bg-white/5 text-white/40 border-white/10 hover:border-white/30'
                }`}
              >
                {getPositionLabel(pos)}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          {filteredPlayers.map((player, idx) => (
            <PlayerCard key={player.name} player={player} />
          ))}
        </motion.div>
      )}

      {!loading && filteredPlayers.length === 0 && (
        <div className="text-center py-20 glass-dark rounded-3xl border border-dashed border-white/10">
          <p className="text-white/30 font-medium italic">Nenhum jogador encontrado nesta categoria.</p>
        </div>
      )}
    </section>
  );
});
