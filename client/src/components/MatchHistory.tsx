import React, { useMemo, memo } from 'react';
import { trpc } from '../lib/trpc';
import { formatDate, getResultColor } from '../lib/playerUtils';

const MatchCard = memo(({ match }: any) => {
  const ourGoals = parseInt(match.match_data.clubs['8044401'].goals);
  const opponentData = Object.entries(match.match_data.clubs)
    .filter(([_, club]: any) => club.clubName !== 'Jovem Nuggs FC')
    .map(([_, club]: any) => club)[0] as any;

  const opponentGoals = parseInt(opponentData?.goals || 0);
  const opponentName = opponentData?.clubName || 'Desconhecido';
  const resultColor = getResultColor(ourGoals, opponentGoals);
  const matchDate = formatDate(match.match_date);

  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg opacity-0 group-hover:opacity-30 blur transition-all duration-300" />
      <div className="relative bg-black border border-white/10 rounded-lg p-5 hover:border-white/30 transition-all duration-300">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-3.25 font-700 text-white truncate">Jovem Nuggs FC</div>
            <div className="text-2.5 text-gray-500 mt-1">{matchDate}</div>
          </div>
          <div className={`text-center px-4 py-2 bg-white/5 rounded-lg border border-white/10 ${resultColor}`}>
            <div className="text-5 font-900">{ourGoals} - {opponentGoals}</div>
          </div>
          <div className="flex-1 text-right min-w-0">
            <div className="text-3.25 font-700 text-white truncate">{opponentName}</div>
            <div className="text-2.5 text-gray-500 mt-1">Liga</div>
          </div>
        </div>
      </div>
    </div>
  );
});

MatchCard.displayName = 'MatchCard';

export default memo(function MatchHistory() {
  const { data: matches = [] } = trpc.club.matchHistory.useQuery();

  const recentMatches = useMemo(() => matches.slice(0, 15), [matches]);

  return (
    <section className="relative py-20 px-5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent pointer-events-none" />
      <div className="max-w-270 mx-auto relative z-10">
        <h2 className="text-5 md:text-8 font-900 tracking-wider mb-16 font-orbitron text-center">
          <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Historico Oficial
          </span>
        </h2>

        <div className="space-y-3">
          {recentMatches.map((match: any, idx: number) => (
            <MatchCard key={idx} match={match} />
          ))}
        </div>

        {recentMatches.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-3.375">Nenhuma partida registrada ainda.</p>
          </div>
        )}
      </div>
    </section>
  );
});
