import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import type { Player } from '@/types/api';

interface PlayerAttributesRadarProps {
  player: Player;
  allPlayers: Player[];
}

export const PlayerAttributesRadar = React.memo(({ player, allPlayers }: PlayerAttributesRadarProps) => {
  // Calcular a média do time para cada atributo
  const teamAverage = {
    finishing: allPlayers.reduce((sum, p) => sum + p.goals, 0) / Math.max(allPlayers.length, 1),
    passing: allPlayers.reduce((sum, p) => sum + p.passes, 0) / Math.max(allPlayers.length, 1),
    defense: allPlayers.reduce((sum, p) => sum + p.cleanSheets, 0) / Math.max(allPlayers.length, 1),
    pace: allPlayers.reduce((sum, p) => sum + p.matches, 0) / Math.max(allPlayers.length, 1),
  };

  // Normalizar os atributos do jogador em escala de 0-100
  const playerAttributes = [
    {
      attribute: 'Finalização',
      value: Math.min(100, (player.goals / Math.max(teamAverage.finishing, 1)) * 50),
      fullMark: 100,
    },
    {
      attribute: 'Passe',
      value: Math.min(100, (player.passes / Math.max(teamAverage.passing, 1)) * 50),
      fullMark: 100,
    },
    {
      attribute: 'Defesa',
      value: Math.min(100, (player.cleanSheets / Math.max(teamAverage.defense, 1)) * 50),
      fullMark: 100,
    },
    {
      attribute: 'Ritmo',
      value: Math.min(100, (player.matches / Math.max(teamAverage.pace, 1)) * 50),
      fullMark: 100,
    },
    {
      attribute: 'Criatividade',
      value: Math.min(100, (player.assists / Math.max(allPlayers.reduce((sum, p) => sum + p.assists, 0) / allPlayers.length, 1)) * 50),
      fullMark: 100,
    },
    {
      attribute: 'Consistência',
      value: player.avgRating * 10,
      fullMark: 100,
    },
  ];

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={playerAttributes}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis
            dataKey="attribute"
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 'bold' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
          />
          <Radar
            name={player.name}
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
            isAnimationActive
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
});

PlayerAttributesRadar.displayName = 'PlayerAttributesRadar';
