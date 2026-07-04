import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { getInitials, getPositionLabel, getPositionColor } from '../lib/playerUtils';
import type { Player } from '@/types/api';

interface ProCardProps {
  player: Player;
}

/**
 * Calcula um nível fictício baseado em partidas e rating
 * Escala de 1 a 99 (como no EA FC 26)
 */
function calculateLevel(player: Player): number {
  const baseLevel = Math.min(99, Math.floor((player.matches / 2) + (player.avgRating * 5)));
  return Math.max(1, baseLevel);
}

/**
 * Mapeia as estatísticas reais para atributos visuais tipo EA FC 26
 */
function getAttributes(player: Player) {
  const matches = Math.max(1, player.matches);
  
  // Normalizar valores para escala 0-99
  const str = Math.min(99, Math.floor((player.goals / matches) * 20 + player.avgRating * 3));
  const int = Math.min(99, Math.floor((player.assists / matches) * 25 + player.avgRating * 2));
  const dfa = Math.min(99, Math.floor((player.tackles / matches) * 10 + player.avgRating * 3));
  const lbh = Math.min(99, Math.floor((player.passes / matches) * 0.5 + player.avgRating * 4));
  const pac = Math.min(99, Math.floor(player.avgRating * 8 + 20));
  const sho = Math.min(99, Math.floor((player.shots / matches) * 15 + player.avgRating * 2));

  return { str, int, dfa, lbh, pac, sho };
}

/**
 * Calcula o Overall (OVR) baseado nos atributos
 */
function calculateOverall(attributes: ReturnType<typeof getAttributes>): number {
  const avg = (attributes.str + attributes.int + attributes.dfa + attributes.lbh + attributes.pac + attributes.sho) / 6;
  return Math.round(avg);
}

/**
 * Retorna a cor da raridade baseada no overall
 */
function getRarityColor(overall: number): string {
  if (overall >= 90) return 'from-yellow-300 to-yellow-500'; // Legendary/Gold
  if (overall >= 80) return 'from-purple-400 to-purple-600'; // Epic/Purple
  if (overall >= 70) return 'from-blue-400 to-blue-600'; // Rare/Blue
  return 'from-green-400 to-green-600'; // Common/Green
}

function getRarityLabel(overall: number): string {
  if (overall >= 90) return 'LEGENDARY';
  if (overall >= 80) return 'EPIC';
  if (overall >= 70) return 'RARE';
  return 'COMMON';
}

export const ProCard = memo(({ player }: ProCardProps) => {
  const level = calculateLevel(player);
  const attributes = getAttributes(player);
  const overall = calculateOverall(attributes);
  const positionLabel = getPositionLabel(player.position);
  const rarityColor = getRarityColor(overall);
  const rarityLabel = getRarityLabel(overall);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.05 }}
      className="group relative"
    >
      {/* Card Container */}
      <div className={`relative w-full max-w-xs aspect-[3/4.5] rounded-xl overflow-hidden shadow-2xl group-hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300`}>
        
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-b ${rarityColor} opacity-80`} />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-4 sm:p-6">
          
          {/* Top Section: Level and Position */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Level</span>
              <span className="text-3xl sm:text-4xl font-black text-white leading-none">{level}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{positionLabel}</span>
              <span className="text-2xl font-black text-white">{getInitials(player.name)}</span>
            </div>
          </div>

          {/* Middle Section: Player Avatar and Name */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl sm:text-5xl font-black text-white/80">{getInitials(player.name)}</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white text-center leading-tight">
              {player.name}
            </h3>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{rarityLabel}</span>
          </div>

          {/* Bottom Section: Overall and Attributes */}
          <div className="flex flex-col gap-3">
            
            {/* Overall Rating */}
            <div className="flex justify-center items-center gap-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-black text-white">{overall}</span>
              </div>
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">OVR</span>
            </div>

            {/* Attributes Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/20">
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-bold text-white/40 uppercase">STR</span>
                <span className="text-xs font-black text-white">{attributes.str}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-bold text-white/40 uppercase">INT</span>
                <span className="text-xs font-black text-white">{attributes.int}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-bold text-white/40 uppercase">DFA</span>
                <span className="text-xs font-black text-white">{attributes.dfa}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-bold text-white/40 uppercase">LBH</span>
                <span className="text-xs font-black text-white">{attributes.lbh}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-bold text-white/40 uppercase">PAC</span>
                <span className="text-xs font-black text-white">{attributes.pac}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-bold text-white/40 uppercase">SHO</span>
                <span className="text-xs font-black text-white">{attributes.sho}</span>
              </div>
            </div>

            {/* Stats Footer */}
            <div className="grid grid-cols-3 gap-1 pt-2 border-t border-white/20 text-[8px] text-white/60 font-bold uppercase tracking-widest">
              <div className="text-center">
                <span className="block">{player.matches}</span>
                <span className="text-[7px]">Partidas</span>
              </div>
              <div className="text-center">
                <span className="block">{player.goals}</span>
                <span className="text-[7px]">Gols</span>
              </div>
              <div className="text-center">
                <span className="block">{player.assists}</span>
                <span className="text-[7px]">Assistências</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </motion.div>
  );
});

ProCard.displayName = 'ProCard';
