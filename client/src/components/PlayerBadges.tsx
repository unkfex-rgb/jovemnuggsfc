import React from 'react';
import { Trophy, Target, Shield, Zap } from 'lucide-react';
import type { Player, Match } from '@/types/api';

interface PlayerBadgesProps {
  player: Player;
  allPlayers: Player[];
  matches: Match[];
}

export const PlayerBadges = React.memo(({ player, allPlayers, matches }: PlayerBadgesProps) => {
  const badges: Array<{ icon: React.ReactNode; label: string; color: string }> = [];

  // Artilheiro (Top Scorer)
  const topScorer = [...allPlayers].sort((a, b) => b.goals - a.goals)[0];
  if (topScorer?.name === player.name && player.goals > 0) {
    badges.push({
      icon: <Target size={12} />,
      label: 'Artilheiro',
      color: 'bg-red-500/20 border-red-500/50 text-red-300',
    });
  }

  // Muralha (Most Clean Sheets)
  const topDefender = [...allPlayers].sort((a, b) => b.cleanSheets - a.cleanSheets)[0];
  if (topDefender?.name === player.name && player.cleanSheets > 0) {
    badges.push({
      icon: <Shield size={12} />,
      label: 'Muralha',
      color: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
    });
  }

  // Garçom (Most Assists)
  const topAssist = [...allPlayers].sort((a, b) => b.assists - a.assists)[0];
  if (topAssist?.name === player.name && player.assists > 0) {
    badges.push({
      icon: <Zap size={12} />,
      label: 'Garçom',
      color: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
    });
  }

  // MVP (Best Average Rating)
  const bestAvg = [...allPlayers].sort((a, b) => b.avgRating - a.avgRating)[0];
  if (bestAvg?.name === player.name && player.avgRating >= 7) {
    badges.push({
      icon: <Trophy size={12} />,
      label: 'MVP',
      color: 'bg-purple-500/20 border-purple-500/50 text-purple-300',
    });
  }

  // Forma (Recent Good Performance - Last 3 matches average > 7)
  if (matches.length > 0) {
    const recentMatches = matches.slice(-3);
    const recentRatings = recentMatches
      .map(m => parseFloat(m.playerStats[player.name]?.rating || '0'))
      .filter(r => r > 0);
    
    if (recentRatings.length > 0) {
      const avgRecent = recentRatings.reduce((a, b) => a + b, 0) / recentRatings.length;
      if (avgRecent >= 7.5) {
        badges.push({
          icon: <Zap size={12} />,
          label: 'Em Forma',
          color: 'bg-green-500/20 border-green-500/50 text-green-300',
        });
      }
    }
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {badges.map((badge, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${badge.color}`}
          title={badge.label}
        >
          {badge.icon}
          <span className="hidden sm:inline">{badge.label}</span>
        </div>
      ))}
    </div>
  );
});

PlayerBadges.displayName = 'PlayerBadges';
