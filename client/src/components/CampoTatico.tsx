import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SectionLabel } from './SectionLabel';
import { Reveal } from './Reveal';
import { getInitials, calculatePlayerScore } from '../lib/playerUtils';
import type { Player } from '@/types/api';

interface CampoTaticoProps {
  players: Player[];
  loading?: boolean;
}

export default memo(function CampoTatico({ players, loading }: CampoTaticoProps) {
  const formation = useMemo(() => {
    if (players.length === 0) return null;

    // Sort players by their custom score to get the "best" for each position
    const sortedPlayers = [...players].sort((a, b) => calculatePlayerScore(b) - calculatePlayerScore(a));

    const getBestByPos = (posKeywords: string[], count: number, excludeIds: Set<string>) => {
      const found = sortedPlayers
        .filter(p => !excludeIds.has(p.name) && posKeywords.some(k => p.position.toLowerCase().includes(k)))
        .slice(0, count);
      
      found.forEach(p => excludeIds.add(p.name));
      return found;
    };

    const usedNames = new Set<string>();
    
    const gk = getBestByPos(['goalkeeper', 'gk', 'goleiro'], 1, usedNames)[0];
    const defs = getBestByPos(['defender', 'def', 'back', 'lat', 'zag'], 4, usedNames);
    const mids = getBestByPos(['midfielder', 'mid', 'meio', 'vol'], 3, usedNames);
    const fwds = getBestByPos(['forward', 'att', 'striker', 'ata', 'ponta'], 3, usedNames);

    // Fill gaps if not enough players in specific positions
    if (usedNames.size < 11) {
      const remaining = sortedPlayers.filter(p => !usedNames.has(p.name)).slice(0, 11 - usedNames.size);
      // This is a simple fallback, in a real scenario we'd be more tactical
      remaining.forEach(p => {
        if (defs.length < 4) defs.push(p);
        else if (mids.length < 3) mids.push(p);
        else if (fwds.length < 3) fwds.push(p);
      });
    }

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
          
          {/* Penalty Areas */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 border-2 border-t-0 border-white/10" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 border-2 border-b-0 border-white/10" />
          
          {/* Small Boxes */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-12 border-2 border-t-0 border-white/10" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-12 border-2 border-b-0 border-white/10" />
        </div>

        {/* Players Layout (4-3-3) */}
        <div className="relative h-full flex flex-col justify-between py-4">
          {/* Forwards (3) */}
          <div className="flex justify-around items-center px-4">
            {formation?.fwds.map((p, i) => (
              <PlayerSpot key={p.name} player={p} delay={0.1 * i} />
            ))}
          </div>

          {/* Midfielders (3) */}
          <div className="flex justify-center gap-12 md:gap-24 items-center">
            {formation?.mids.map((p, i) => (
              <PlayerSpot key={p.name} player={p} delay={0.3 + 0.1 * i} />
            ))}
          </div>

          {/* Defenders (4) */}
          <div className="flex justify-around items-center">
            {formation?.defs.map((p, i) => (
              <PlayerSpot key={p.name} player={p} delay={0.6 + 0.1 * i} />
            ))}
          </div>

          {/* Goalkeeper (1) */}
          <div className="flex justify-center items-center">
            {formation?.gk && <PlayerSpot player={formation.gk} delay={0.9} />}
          </div>
        </div>
      </div>
      
      <p className="text-center text-white/20 text-xs mt-8 uppercase font-bold tracking-widest">
        Escalação baseada no desempenho técnico dos últimos jogos
      </p>
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
        <div className="w-10 h-10 md:w-14 md:h-14 rounded-full glass border border-white/20 flex items-center justify-center mb-2 group-hover:border-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all relative">
          <span className="text-[10px] md:text-sm font-black text-white">{getInitials(player.name)}</span>
          {/* Rating Badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-white text-black flex items-center justify-center text-[8px] md:text-[10px] font-black shadow-xl">
            {player.avgRating.toFixed(1)}
          </div>
        </div>
        <div className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/5 group-hover:border-white/20 transition-all">
          <p className="text-[8px] md:text-[10px] font-bold text-white/90 whitespace-nowrap">{player.name}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
