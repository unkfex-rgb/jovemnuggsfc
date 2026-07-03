import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SectionLabel } from './SectionLabel';
import { Reveal } from './Reveal';
import { getInitials, calculatePlayerScore } from '../lib/playerUtils';
import { Star, Target, Zap, Shield } from 'lucide-react';
import type { Player } from '@/types/api';

interface CampoTaticoProps {
  players: Player[];
  loading?: boolean;
}

export default memo(function CampoTatico({ players, loading }: CampoTaticoProps) {
  const formation = useMemo(() => {
    if (players.length === 0) return null;

    const sortedPlayers = [...players].sort((a, b) => calculatePlayerScore(b) - calculatePlayerScore(a));
    
    // Leaders for stars
    const topScorer = [...players].sort((a, b) => b.goals - a.goals)[0]?.name;
    const topAssister = [...players].sort((a, b) => b.assists - a.assists)[0]?.name;
    const topDefender = [...players]
      .filter(p => p.position.toLowerCase().includes('gk') || p.position.toLowerCase().includes('def'))
      .sort((a, b) => (b.cleanSheets || 0) - (a.cleanSheets || 0))[0]?.name;

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

    if (usedNames.size < 11) {
      const remaining = sortedPlayers.filter(p => !usedNames.has(p.name)).slice(0, 11 - usedNames.size);
      remaining.forEach(p => {
        if (defs.length < 4) defs.push(p);
        else if (mids.length < 3) mids.push(p);
        else if (fwds.length < 3) fwds.push(p);
      });
    }

    return { gk, defs, mids, fwds, leaders: { topScorer, topAssister, topDefender } };
  }, [players]);

  if (!formation && !loading) return null;

  return (
    <section id="formacao" className="relative py-28 px-6 max-w-7xl mx-auto overflow-hidden">
      <Reveal>
        <SectionLabel>Estratégia</SectionLabel>
        <h2 className="text-4xl md:text-6xl font-bold mb-16 tracking-tighter">CAMPO TÁTICO</h2>
      </Reveal>

      {/* Aumentado o aspect ratio para dar mais verticalidade (de 16/9 para 16/12 ou similar) */}
      <div className="relative aspect-[3/4] md:aspect-[4/5] lg:aspect-[16/14] w-full max-w-5xl mx-auto glass-dark rounded-[3rem] border border-white/10 overflow-hidden p-8 md:p-16">
        {/* Soccer Field Lines */}
        <div className="absolute inset-8 md:inset-16 border-2 border-white/10 rounded-xl pointer-events-none">
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/10 -translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white/10 rounded-full" />
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 border-2 border-t-0 border-white/10" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-40 border-2 border-b-0 border-white/10" />
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-16 border-2 border-t-0 border-white/10" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-16 border-2 border-b-0 border-white/10" />
        </div>

        {/* Players Layout (4-3-3) with more vertical spacing */}
        <div className="relative h-full flex flex-col justify-between py-8">
          {/* Forwards (3) */}
          <div className="flex justify-around items-center px-4">
            {formation?.fwds.map((p, i) => (
              <PlayerSpot 
                key={p.name} 
                player={p} 
                delay={0.1 * i} 
                isTopScorer={p.name === formation.leaders.topScorer}
                isTopAssister={p.name === formation.leaders.topAssister}
                isTopDefender={p.name === formation.leaders.topDefender}
              />
            ))}
          </div>

          {/* Midfielders (3) */}
          <div className="flex justify-center gap-12 md:gap-32 items-center">
            {formation?.mids.map((p, i) => (
              <PlayerSpot 
                key={p.name} 
                player={p} 
                delay={0.3 + 0.1 * i} 
                isTopScorer={p.name === formation.leaders.topScorer}
                isTopAssister={p.name === formation.leaders.topAssister}
                isTopDefender={p.name === formation.leaders.topDefender}
              />
            ))}
          </div>

          {/* Defenders (4) */}
          <div className="flex justify-around items-center">
            {formation?.defs.map((p, i) => (
              <PlayerSpot 
                key={p.name} 
                player={p} 
                delay={0.6 + 0.1 * i} 
                isTopScorer={p.name === formation.leaders.topScorer}
                isTopAssister={p.name === formation.leaders.topAssister}
                isTopDefender={p.name === formation.leaders.topDefender}
              />
            ))}
          </div>

          {/* Goalkeeper (1) */}
          <div className="flex justify-center items-center">
            {formation?.gk && (
              <PlayerSpot 
                player={formation.gk} 
                delay={0.9} 
                isTopScorer={formation.gk.name === formation.leaders.topScorer}
                isTopAssister={formation.gk.name === formation.leaders.topAssister}
                isTopDefender={formation.gk.name === formation.leaders.topDefender}
              />
            )}
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-6 mt-12">
        <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
          <div className="p-1 bg-yellow-400/10 rounded-md border border-yellow-400/20">
            <Target size={12} className="text-yellow-400" />
          </div>
          Artilheiro
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
          <div className="p-1 bg-cyan-400/10 rounded-md border border-cyan-400/20">
            <Zap size={12} className="text-cyan-400" />
          </div>
          Garçom
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
          <div className="p-1 bg-emerald-400/10 rounded-md border border-emerald-400/20">
            <Shield size={12} className="text-emerald-400" />
          </div>
          Muralha
        </div>
      </div>
    </section>
  );
});

interface PlayerSpotProps {
  player: Player;
  delay: number;
  isTopScorer?: boolean;
  isTopAssister?: boolean;
  isTopDefender?: boolean;
}

function PlayerSpot({ player, delay, isTopScorer, isTopAssister, isTopDefender }: PlayerSpotProps) {
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
        {/* Star / Highlight Icons */}
        <div className="absolute -top-8 flex gap-1">
          {isTopScorer && (
            <motion.div 
              animate={{ y: [0, -3, 0] }} 
              transition={{ duration: 2, repeat: Infinity }}
              className="p-1 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.6)]"
            >
              <Target size={10} className="text-black" />
            </motion.div>
          )}
          {isTopAssister && (
            <motion.div 
              animate={{ y: [0, -3, 0] }} 
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="p-1 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.6)]"
            >
              <Zap size={10} className="text-black" />
            </motion.div>
          )}
          {isTopDefender && (
            <motion.div 
              animate={{ y: [0, -3, 0] }} 
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className="p-1 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.6)]"
            >
              <Shield size={10} className="text-black" />
            </motion.div>
          )}
        </div>

        <div className="w-12 h-12 md:w-20 md:h-20 rounded-full glass border border-white/20 flex items-center justify-center mb-3 group-hover:border-white group-hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all relative">
          <span className="text-xs md:text-xl font-black text-white">{getInitials(player.name)}</span>
          
          {/* Rating Badge */}
          <div className="absolute -top-1 -right-1 w-6 h-6 md:w-8 md:h-8 rounded-full bg-white text-black flex items-center justify-center text-[10px] md:text-xs font-black shadow-xl">
            {player.avgRating.toFixed(1)}
          </div>
        </div>

        <div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 group-hover:border-white/30 transition-all">
          <p className="text-[10px] md:text-xs font-bold text-white whitespace-nowrap">{player.name}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
