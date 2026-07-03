import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SectionLabel } from './SectionLabel';
import { Reveal } from './Reveal';
import { getInitials } from '../lib/playerUtils';
import type { Player } from '@/types/api';

interface CampoTaticoProps {
  players: Player[];
  loading?: boolean;
}

export default memo(function CampoTatico({ players, loading }: CampoTaticoProps) {
  const formation = useMemo(() => {
    if (players.length === 0) return null;

    // Filter by position and take the best rated
    const getBest = (pos: string, count: number) => 
      players.filter(p => p.position.toLowerCase().includes(pos.toLowerCase()))
             .sort((a, b) => b.avgRating - a.avgRating)
             .slice(0, count);

    const gk = getBest('gk', 1)[0] || getBest('goalkeeper', 1)[0];
    const defs = getBest('def', 4);
    const mids = getBest('mid', 3);
    const fwds = getBest('att', 3) || getBest('forward', 3);

    return { gk, defs, mids, fwds };
  }, [players]);

  if (!formation && !loading) return null;

  return (
    <section id="formacao" className="relative py-28 px-6 max-w-7xl mx-auto overflow-hidden">
      <Reveal>
        <SectionLabel>Estratégia</SectionLabel>
        <h2 className="text-4xl md:text-6xl font-bold mb-16 tracking-tighter">CAMPO TÁTICO</h2>
      </Reveal>

      <div className="relative aspect-[4/5] md:aspect-[16/9] w-full max-w-5xl mx-auto glass-dark rounded-[3rem] border border-white/10 overflow-hidden p-8 md:p-12">
        {/* Soccer Field Lines */}
        <div className="absolute inset-8 md:inset-12 border-2 border-white/10 rounded-xl pointer-events-none">
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/10 -translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/10 rounded-full" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 border-2 border-t-0 border-white/10" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 border-2 border-b-0 border-white/10" />
        </div>

        {/* Players Layout (Simplified 4-3-3) */}
        <div className="relative h-full flex flex-col justify-between py-4">
          {/* Forwards */}
          <div className="flex justify-around items-center">
            {formation?.fwds.map((p, i) => (
              <PlayerSpot key={p.name} player={p} delay={0.1 * i} />
            ))}
          </div>

          {/* Midfielders */}
          <div className="flex justify-around items-center">
            {formation?.mids.map((p, i) => (
              <PlayerSpot key={p.name} player={p} delay={0.3 + 0.1 * i} />
            ))}
          </div>

          {/* Defenders */}
          <div className="flex justify-around items-center">
            {formation?.defs.map((p, i) => (
              <PlayerSpot key={p.name} player={p} delay={0.6 + 0.1 * i} />
            ))}
          </div>

          {/* Goalkeeper */}
          <div className="flex justify-center items-center">
            {formation?.gk && <PlayerSpot player={formation.gk} delay={0.9} />}
          </div>
        </div>
      </div>
    </section>
  );
});

function PlayerSpot({ player, delay }: { player: Player; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      viewport={{ once: true }}
      className="relative group cursor-pointer"
    >
      <motion.div 
        whileHover={{ y: -5 }}
        className="flex flex-col items-center"
      >
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full glass border border-white/20 flex items-center justify-center mb-2 group-hover:border-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">
          <span className="text-sm md:text-lg font-black text-white">{getInitials(player.name)}</span>
        </div>
        <div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 group-hover:border-white/30 transition-all">
          <p className="text-[10px] md:text-xs font-bold text-white whitespace-nowrap">{player.name}</p>
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-black shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
          {player.avgRating.toFixed(1)}
        </div>
      </motion.div>
    </motion.div>
  );
}
