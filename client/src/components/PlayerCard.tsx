import React, { memo, useContext } from 'react';
import { getInitials, getPositionLabel, getPositionColor } from '../lib/playerUtils';
import { motion } from 'framer-motion';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/hover-card';
import { MatchRatingChart } from './MatchRatingChart';
import { PlayerBadges } from './PlayerBadges';
import { MatchContext } from '@/contexts/MatchContext';
import type { Player } from '@/types/api';

interface PlayerCardProps {
  player: Player;
  allPlayers?: Player[];
}

export const PlayerCard = memo(({ player, allPlayers = [] }: PlayerCardProps) => {
  const positionLabel = getPositionLabel(player.position);
  const matches = useContext(MatchContext);
  
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          whileHover={{ y: -10 }}
          className="group relative cursor-pointer"
        >
          {/* Card Background with Glassmorphism */}
          <div className="relative aspect-[3/4.5] bg-black border border-white/10 group-hover:border-white/30 rounded-2xl overflow-hidden transition-all duration-500">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
              <div className={`absolute inset-0 bg-gradient-to-b ${getPositionColor(player.position)}`} />
            </div>

            {/* HUD Elements */}
            <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-black text-white leading-none tracking-tighter">
                    {player.avgRating.toFixed(1)}
                  </span>
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">
                    {positionLabel}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center">
                   <span className="text-[10px] font-black text-white">{getInitials(player.name)}</span>
                </div>
              </div>

              <div className="flex flex-col items-center">
                {/* Player Avatar Placeholder / Initials */}
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-white/20 to-transparent flex items-center justify-center mb-3 sm:mb-4 border border-white/10 group-hover:scale-110 transition-transform duration-500 relative">
                   <div className="absolute inset-0 bg-white/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                   <span className="text-2xl sm:text-4xl font-black text-white/80">{getInitials(player.name)}</span>
                </div>
                
                <h3 className="text-sm sm:text-lg font-bold text-white text-center leading-tight mb-2 group-hover:text-gradient truncate w-full px-2">
                  {player.name}
                </h3>

                {/* Badges */}
                {allPlayers.length > 0 && matches && matches.length > 0 && (
                  <div className="mb-2">
                    <PlayerBadges player={player} allPlayers={allPlayers} matches={matches} />
                  </div>
                )}

                <div className="flex gap-3 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
                  <span>{player.matches} J</span>
                  <span>{player.goals} G</span>
                  <span>{player.assists} A</span>
                </div>
              </div>

              {/* Bottom Stats Grid */}
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/10 mt-4">
                <div className="flex flex-col items-center">
                   <span className="text-[8px] text-white/30 uppercase font-bold">Passes</span>
                   <span className="text-xs font-bold text-white">{player.passes}</span>
                </div>
                <div className="flex flex-col items-center">
                   <span className="text-[8px] text-white/30 uppercase font-bold">Shots</span>
                   <span className="text-xs font-bold text-white">{player.shots}</span>
                </div>
              </div>
            </div>

            {/* Scanlines Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
          </div>

          {/* Glow Effect on Hover */}
          <div className="absolute -inset-0.5 bg-white opacity-0 group-hover:opacity-10 blur-xl transition-opacity rounded-2xl -z-10" />
        </motion.div>
      </HoverCardTrigger>

      {/* Hover Card Content - Performance Chart */}
      {matches && matches.length > 0 && (
        <HoverCardContent className="w-72 bg-black/90 backdrop-blur-md border border-white/20 p-4" align="center" sideOffset={10}>
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white">Performance</h4>
            <MatchRatingChart playerName={player.name} matches={matches} />
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  );
});

PlayerCard.displayName = 'PlayerCard';
