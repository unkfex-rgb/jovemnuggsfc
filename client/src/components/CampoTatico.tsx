import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SectionLabel } from './SectionLabel';
import { Reveal } from './Reveal';
import { getInitials } from '../lib/playerUtils';
import { Target, Zap, Shield } from 'lucide-react';
import type { Player } from '@/types/api';

interface CampoTaticoProps {
  players: Player[];
  loading?: boolean;
}

export default memo(function CampoTatico({ players, loading }: CampoTaticoProps) {
  const formation = useMemo(() => {
    if (players.length === 0) return null;

    // Dynamic leaders calculated from API data
    const topScorer = [...players].sort((a, b) => b.goals - a.goals)[0]?.name;
    const topAssister = [...players].sort((a, b) => b.assists - a.assists)[0]?.name;
    
    // Muralha: Best defensive stats (Clean Sheets or Saves if available, otherwise best rating among GK/DEF)
    const topDefender = [...players]
      .filter(p => p.position.toLowerCase().includes('gk') || p.position.toLowerCase().includes('def'))
      .sort((a, b) => {
        const scoreB = (b.cleanSheets || 0) * 10 + (b.avgRating || 0);
        const scoreA = (a.cleanSheets || 0) * 10 + (a.avgRating || 0);
        return scoreB - scoreA;
      })[0]?.name;

    const leaders = {
      topScorer,
      topAssister,
      topDefender
    };

    // Fixed starters provided by user - Updated positions
    const startersNames = {
      st: ['PECINHAA22'],
      ams: ['mxndini-', 'tavin__07', 'pedrofeRLK'],
      cdms: ['Vinim71655', 'corintia4i20'],
      defs: ['araujozx77_', 'scobyzinn', 'CELTA4656', 'Jessysz0'],
      gk: ['Dghs100']
    };

    const findByExactName = (name: string) => {
      return players.find(p => p.name === name) || 
             players.find(p => p.name.toLowerCase() === name.toLowerCase()) ||
             { name, position: 'N/A', goals: 0, assists: 0, matches: 0, avgRating: 0, cleanSheets: 0 } as any;
    };

    const gk = findByExactName(startersNames.gk[0]);
    const st = startersNames.st.map(findByExactName);
    const ams = startersNames.ams.map(findByExactName);
    const cdms = startersNames.cdms.map(findByExactName);
    const defs = startersNames.defs.map(findByExactName);

    return { gk, defs, cdms, ams, st, leaders };
  }, [players]);

  if (!formation && !loading) return null;

  return (
    <section id="formacao" className="relative py-28 px-6 max-w-7xl mx-auto overflow-hidden">
      <Reveal>
        <SectionLabel>Estratégia</SectionLabel>
        <h2 className="text-4xl md:text-6xl font-bold mb-16 tracking-tighter">CAMPO TÁTICO</h2>
      </Reveal>

      <div className="relative aspect-[3/5] sm:aspect-[3/4.5] md:aspect-[4/6] lg:aspect-[16/18] w-full max-w-5xl mx-auto glass-dark rounded-3xl sm:rounded-[3rem] border border-white/10 overflow-hidden p-4 sm:p-8 md:p-16">
        {/* Soccer Field Lines */}
        <div className="absolute inset-8 md:inset-16 border-2 border-white/10 rounded-xl pointer-events-none">
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/10 -translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white/10 rounded-full" />
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 border-2 border-t-0 border-white/10" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-40 border-2 border-b-0 border-white/10" />
        </div>

        {/* 4-2-3-1 Layout */}
        <div className="relative h-full flex flex-col justify-between py-12">
          {/* ST (1) */}
          <div className="flex justify-center items-center">
            {formation?.st.map((p, i) => (
              <PlayerSpot key={p.name} player={p} delay={0.1} leaders={formation.leaders} />
            ))}
          </div>

          {/* AMs (3) - LAM, CAM, RAM */}
          <div className="flex justify-around items-center px-4">
            {formation?.ams.map((p, i) => (
              <PlayerSpot key={p.name} player={p} delay={0.3 + 0.1 * i} leaders={formation.leaders} />
            ))}
          </div>

          {/* CDMs (2) */}
          <div className="flex justify-center gap-24 md:gap-48 items-center">
            {formation?.cdms.map((p, i) => (
              <PlayerSpot key={p.name} player={p} delay={0.5 + 0.1 * i} leaders={formation.leaders} />
            ))}
          </div>

          {/* Defenders (4) */}
          <div className="flex justify-around items-center">
            {formation?.defs.map((p, i) => (
              <PlayerSpot key={p.name} player={p} delay={0.7 + 0.1 * i} leaders={formation.leaders} />
            ))}
          </div>

          {/* Goalkeeper (1) */}
          <div className="flex justify-center items-center">
            {formation?.gk && (
              <PlayerSpot player={formation.gk} delay={0.9} leaders={formation.leaders} />
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
  leaders: { topScorer?: string; topAssister?: string; topDefender?: string };
}

function PlayerSpot({ player, delay, leaders }: PlayerSpotProps) {
  const isTopScorer = player.name.toLowerCase() === leaders.topScorer?.toLowerCase();
  const isTopAssister = player.name.toLowerCase() === leaders.topAssister?.toLowerCase();
  const isTopDefender = player.name.toLowerCase() === leaders.topDefender?.toLowerCase();

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
        <div className="absolute -top-8 flex gap-1">
          {isTopScorer && (
            <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }} className="p-1 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.6)]">
              <Target size={10} className="text-black" />
            </motion.div>
          )}
          {isTopAssister && (
            <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="p-1 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.6)]">
              <Zap size={10} className="text-black" />
            </motion.div>
          )}
          {isTopDefender && (
            <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} className="p-1 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.6)]">
              <Shield size={10} className="text-black" />
            </motion.div>
          )}
        </div>

        <div className="w-9 h-9 sm:w-12 sm:h-12 md:w-20 md:h-20 rounded-full glass border border-white/20 flex items-center justify-center mb-2 sm:mb-3 group-hover:border-white group-hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all relative">
          <span className="text-[10px] sm:text-xs md:text-xl font-black text-white">{getInitials(player.name)}</span>
          <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-white text-black flex items-center justify-center text-[7px] sm:text-[10px] md:text-xs font-black shadow-xl">
            {player.avgRating.toFixed(1)}
          </div>
        </div>

        <div className="bg-black/80 backdrop-blur-md px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/10 group-hover:border-white/30 transition-all">
          <p className="text-[7px] sm:text-[10px] md:text-xs font-bold text-white whitespace-nowrap">{player.name}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
