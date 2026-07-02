import React, { memo } from 'react';
import { trpc } from '../lib/trpc';
import { getInitials, getPositionColor } from '../lib/playerUtils';

const TopPlayerCard = memo(({ player, rank, category }: any) => {
  const colorMap = {
    goals: 'from-red-500 to-pink-400',
    assists: 'from-blue-500 to-cyan-400',
    rating: 'from-yellow-500 to-orange-400',
  };

  const color = colorMap[category as keyof typeof colorMap];

  return (
    <div className="group relative">
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${color} rounded-lg opacity-0 group-hover:opacity-50 blur transition-all duration-300`} />
      <div className="relative bg-black border border-white/10 rounded-lg p-4 text-center hover:border-white/30 transition-all duration-300">
        <div className="text-5 font-900 text-white mb-2">#{rank}</div>
        <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center font-orbitron font-700 text-3.5 text-black bg-gradient-to-br ${getPositionColor(player.position)}`}>
          {getInitials(player.name)}
        </div>
        <div className="text-3 font-700 truncate text-white">{player.name}</div>
        <div className="text-2.5 text-gray-400 uppercase tracking-wide mt-1">{player.position}</div>
        <div className={`text-4 font-900 mt-3 bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
          {category === 'goals' && `${player.goals} Gols`}
          {category === 'assists' && `${player.assists} Assist`}
          {category === 'rating' && `${player.averageRating}`}
        </div>
      </div>
    </div>
  );
});

TopPlayerCard.displayName = 'TopPlayerCard';

export default memo(function TopPlayers() {
  const { data: topData } = trpc.club.topPlayers.useQuery();

  if (!topData) {
    return (
      <section className="relative py-20 px-5">
        <div className="max-w-270 mx-auto text-center text-gray-400">
          Carregando top jogadores...
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 px-5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-yellow-500/5 pointer-events-none" />
      <div className="max-w-270 mx-auto relative z-10">
        <h2 className="text-5 md:text-8 font-900 tracking-wider mb-16 font-orbitron text-center">
          <span className="bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Top Jogadores
          </span>
        </h2>

        <div className="space-y-12">
          {[
            { title: 'Top Gols', players: topData.topByGoals, category: 'goals', color: 'from-red-500 to-pink-400' },
            { title: 'Top Assistências', players: topData.topByAssists, category: 'assists', color: 'from-blue-500 to-cyan-400' },
            { title: 'Top Rating', players: topData.topByRating, category: 'rating', color: 'from-yellow-500 to-orange-400' },
          ].map((section, idx) => (
            <div key={idx}>
              <h3 className={`text-3.5 md:text-5 font-800 mb-6 font-orbitron bg-gradient-to-r ${section.color} bg-clip-text text-transparent`}>
                {section.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {section.players.map((player: any, pidx: number) => (
                  <TopPlayerCard key={pidx} player={player} rank={pidx + 1} category={section.category} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
