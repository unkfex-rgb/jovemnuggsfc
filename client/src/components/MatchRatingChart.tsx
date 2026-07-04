import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from 'recharts';
import type { Match } from '@/types/api';

interface MatchRatingChartProps {
  playerName: string;
  matches: Match[];
}

interface ChartDataPoint {
  match: number;
  rating: number;
  opponent: string;
}

export const MatchRatingChart = React.memo(({ playerName, matches }: MatchRatingChartProps) => {
  const chartData = useMemo(() => {
    const playerMatches: ChartDataPoint[] = [];

    // Pega as últimas 10 partidas com dados do jogador
    matches
      .slice()
      .reverse()
      .slice(0, 10)
      .reverse()
      .forEach((match, index) => {
        const playerStats = match.playerStats[playerName];
        if (playerStats && playerStats.rating) {
          const rating = parseFloat(playerStats.rating);
          playerMatches.push({
            match: index + 1,
            rating: Math.round(rating * 10) / 10,
            opponent: match.opponent,
          });
        }
      });

    return playerMatches;
  }, [playerName, matches]);

  const stats = useMemo(() => {
    if (chartData.length === 0) return { avg: 0, best: 0, worst: 0 };

    const ratings = chartData.map(d => d.rating);
    const avg = Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10;
    const best = Math.max(...ratings);
    const worst = Math.min(...ratings);

    return { avg, best, worst };
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-white/40 text-xs">
        Sem dados de partidas
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Chart */}
      <div className="h-24 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis
              dataKey="match"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 10]}
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '6px',
                padding: '6px 10px',
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}
              formatter={(value: number) => [value.toFixed(1), 'Rating']}
              labelFormatter={(label) => `Match ${label}`}
            />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="url(#colorGradient)"
              strokeWidth={2}
              dot={(props) => {
                const { cx, cy, payload } = props;
                const isHighest = payload.rating === stats.best;
                const isLowest = payload.rating === stats.worst;

                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHighest || isLowest ? 4 : 3}
                    fill={isHighest ? '#06b6d4' : isLowest ? '#f97316' : '#8b5cf6'}
                    opacity={0.8}
                  />
                );
              }}
              isAnimationActive={false}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="100%" y2="0">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
        <div className="text-center">
          <div className="text-xs font-bold text-white/40 uppercase tracking-widest">Média</div>
          <div className="text-sm font-black text-white">{stats.avg.toFixed(1)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Melhor</div>
          <div className="text-sm font-black text-cyan-400">{stats.best.toFixed(1)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-bold text-orange-400 uppercase tracking-widest">Pior</div>
          <div className="text-sm font-black text-orange-400">{stats.worst.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
});

MatchRatingChart.displayName = 'MatchRatingChart';
