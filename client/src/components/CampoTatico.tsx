import React, { memo, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionLabel } from './SectionLabel';
import { Reveal } from './Reveal';
import { getInitials, getPositionCategory, calculatePlayerScore } from '../lib/playerUtils';
import { Target, Zap, Shield } from 'lucide-react';
import type { Player } from '@/types/api';

interface CampoTaticoProps {
  players: Player[];
  loading?: boolean;
}

export default memo(function CampoTatico({ players, loading }: CampoTaticoProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const formation = useMemo(() => {
    if (players.length === 0) return null;

    // Dynamic leaders calculated from API data
    const topScorer = [...players].sort((a, b) => b.goals - a.goals)[0]?.name;
    const topAssister = [...players].sort((a, b) => b.assists - a.assists)[0]?.name;
    
    // Muralha: Best defensive stats (Clean Sheets or Saves if available, otherwise best rating among GK/DEF)
    const topDefender = [...players]
      .filter(p => p.position.toLowerCase().includes('gk') || p.position.toLowerCase().includes('def') || p.position === 'GOL' || p.position === 'ZAG' || p.position === 'LAT')
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

    // Dynamic selection based on position and performance
    const playersByCategory = {
      goalkeeper: [] as Player[],
      defender: [] as Player[],
      midfielder: [] as Player[],
      forward: [] as Player[]
    };

    // Categorize players
    players.forEach(player => {
      const category = getPositionCategory(player.position);
      playersByCategory[category].push(player);
    });

    // Sort each category by performance score
    Object.keys(playersByCategory).forEach(key => {
      playersByCategory[key as keyof typeof playersByCategory].sort((a, b) => {
        return calculatePlayerScore(b) - calculatePlayerScore(a);
      });
    });

    // Select best players for each position (4-2-3-1 formation)
    const st = playersByCategory.forward.slice(0, 1);
    const ams = [
      ...playersByCategory.midfielder.slice(0, 2),
      ...playersByCategory.forward.slice(1, 2)
    ].slice(0, 3);
    const cdms = playersByCategory.midfielder.slice(2, 4);
    const defs = playersByCategory.defender.slice(0, 4);
    const gk = playersByCategory.goalkeeper[0];

    const ensurePlayer = (player?: Player) => player || {
      name: 'N/A',
      position: 'N/A',
      goals: 0,
      assists: 0,
      matches: 0,
      avgRating: 0,
      cleanSheets: 0,
      shots: 0,
      passes: 0,
      tackles: 0
    };

    return {
      gk: ensurePlayer(gk),
      defs: defs.map(ensurePlayer),
      cdms: cdms.map(ensurePlayer),
      ams: ams.map(ensurePlayer),
      st: st.map(ensurePlayer),
      leaders
    };
  }, [players]);

  if (!formation && !loading) return null;

  return (
    <section id="formacao" className="relative py-28 px-6 max-w-7xl mx-auto overflow-hidden">
      <Reveal>
        <SectionLabel>Estratégia</SectionLabel>
        <h2 className="text-4xl md:text-6xl font-bold mb-16 tracking-tighter">CAMPO TÁTICO</h2>
      </Reveal>

      <div className="relative aspect-[3/5] sm:aspect-[3/4.5] md:aspect-[4/6] lg:aspect-[16/18] w-full max-w-5xl mx-auto glass-dark rounded-3xl sm:rounded-[3rem] border border-white/10 hover:border-white/20 overflow-hidden p-4 sm:p-8 md:p-16 transition-all duration-500 shadow-2xl hover:shadow-[0_0_40px_rgba(0,255,255,0.1)]">
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
              <PlayerSpot 
                key={p.name} 
                player={p} 
                delay={0.1} 
                leaders={formation.leaders}
                isSelected={selectedPlayer?.name === p.name}
                onSelect={setSelectedPlayer}
              />
            ))}
          </div>

          {/* AMs (3) - LAM, CAM, RAM */}
          <div className="flex justify-around items-center px-4">
            {formation?.ams.map((p, i) => (
              <PlayerSpot 
                key={p.name} 
                player={p} 
                delay={0.3 + 0.1 * i} 
                leaders={formation.leaders}
                isSelected={selectedPlayer?.name === p.name}
                onSelect={setSelectedPlayer}
              />
            ))}
          </div>

          {/* CDMs (2) */}
          <div className="flex justify-center gap-24 md:gap-48 items-center">
            {formation?.cdms.map((p, i) => (
              <PlayerSpot 
                key={p.name} 
                player={p} 
                delay={0.5 + 0.1 * i} 
                leaders={formation.leaders}
                isSelected={selectedPlayer?.name === p.name}
                onSelect={setSelectedPlayer}
              />
            ))}
          </div>

          {/* Defenders (4) */}
          <div className="flex justify-around items-center">
            {formation?.defs.map((p, i) => (
              <PlayerSpot 
                key={p.name} 
                player={p} 
                delay={0.7 + 0.1 * i} 
                leaders={formation.leaders}
                isSelected={selectedPlayer?.name === p.name}
                onSelect={setSelectedPlayer}
              />
            ))}
          </div>

          {/* Goalkeeper (1) */}
          <div className="flex justify-center items-center">
            {formation?.gk && (
              <PlayerSpot 
                player={formation.gk} 
                delay={0.9} 
                leaders={formation.leaders}
                isSelected={selectedPlayer?.name === formation.gk.name}
                onSelect={setSelectedPlayer}
              />
            )}
          </div>
        </div>
      </div>

      {/* Player Info Card */}
      <AnimatePresence>
        {selectedPlayer && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="mt-8 max-w-2xl mx-auto glass-dark rounded-2xl p-6 border border-white/20 backdrop-blur-xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-black text-white mb-1">{selectedPlayer.name}</h3>
                <p className="text-white/60 text-sm uppercase tracking-widest">{selectedPlayer.position}</p>
              </div>
              <button
                onClick={() => setSelectedPlayer(null)}
                className="text-white/40 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                <div className="text-xs text-white/60 uppercase tracking-widest mb-1">Gols</div>
                <div className="text-2xl font-black text-yellow-400">{selectedPlayer.goals}</div>
              </div>
              <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                <div className="text-xs text-white/60 uppercase tracking-widest mb-1">Assistências</div>
                <div className="text-2xl font-black text-cyan-400">{selectedPlayer.assists}</div>
              </div>
              <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                <div className="text-xs text-white/60 uppercase tracking-widest mb-1">Jogos</div>
                <div className="text-2xl font-black text-white">{selectedPlayer.matches}</div>
              </div>
              <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                <div className="text-xs text-white/60 uppercase tracking-widest mb-1">Rating</div>
                <div className="text-2xl font-black text-emerald-400">{selectedPlayer.avgRating.toFixed(2)}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex flex-wrap justify-center gap-6 mt-12">
        <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest hover:text-white/60 transition-colors cursor-help">
          <div className="p-1 bg-yellow-400/10 rounded-md border border-yellow-400/20">
            <Target size={12} className="text-yellow-400" />
          </div>
          Artilheiro
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest hover:text-white/60 transition-colors cursor-help">
          <div className="p-1 bg-cyan-400/10 rounded-md border border-cyan-400/20">
            <Zap size={12} className="text-cyan-400" />
          </div>
          Garçom
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest hover:text-white/60 transition-colors cursor-help">
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
  isSelected: boolean;
  onSelect: (player: Player) => void;
}

function PlayerSpot({ player, delay, leaders, isSelected, onSelect }: PlayerSpotProps) {
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
      onClick={() => onSelect(player)}
    >
      <motion.div 
        whileHover={{ y: -8, scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center transition-all"
      >
        <div className="absolute -top-8 flex gap-1">
          {isTopScorer && (
            <motion.div 
              animate={{ y: [0, -3, 0] }} 
              transition={{ duration: 2, repeat: Infinity }} 
              className="p-1 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.6)]"
              title="Artilheiro"
            >
              <Target size={10} className="text-black" />
            </motion.div>
          )}
          {isTopAssister && (
            <motion.div 
              animate={{ y: [0, -3, 0] }} 
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} 
              className="p-1 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.6)]"
              title="Garçom"
            >
              <Zap size={10} className="text-black" />
            </motion.div>
          )}
          {isTopDefender && (
            <motion.div 
              animate={{ y: [0, -3, 0] }} 
              transition={{ duration: 2, repeat: Infinity, delay: 1 }} 
              className="p-1 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.6)]"
              title="Muralha"
            >
              <Shield size={10} className="text-black" />
            </motion.div>
          )}
        </div>

        <motion.div 
          animate={isSelected ? { scale: 1.15 } : { scale: 1 }}
          className={`w-9 h-9 sm:w-12 sm:h-12 md:w-20 md:h-20 rounded-full glass border flex items-center justify-center mb-2 sm:mb-3 transition-all relative ${
            isSelected 
              ? 'border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.6)] bg-cyan-400/10' 
              : 'border-white/20 group-hover:border-white group-hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]'
          }`}
        >
          <span className="text-[10px] sm:text-xs md:text-xl font-black text-white">{getInitials(player.name)}</span>
          <motion.div 
            animate={isSelected ? { scale: 1.2 } : { scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-white text-black flex items-center justify-center text-[7px] sm:text-[10px] md:text-xs font-black shadow-xl"
          >
            {player.avgRating.toFixed(1)}
          </motion.div>
        </motion.div>

        <motion.div 
          animate={isSelected ? { scale: 1.05 } : { scale: 1 }}
          className={`px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full border transition-all ${
            isSelected
              ? 'bg-cyan-400/20 border-cyan-400/50 backdrop-blur-md'
              : 'bg-black/80 backdrop-blur-md border-white/10 group-hover:border-white/30'
          }`}
        >
          <p className="text-[7px] sm:text-[10px] md:text-xs font-bold text-white whitespace-nowrap">{player.name}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
