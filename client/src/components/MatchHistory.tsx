import React, { memo, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionLabel } from './SectionLabel';
import { Reveal } from './Reveal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Filter } from 'lucide-react';
import type { Match } from '@/types/api';

interface MatchHistoryProps {
  matches: Match[];
  loading?: boolean;
}

export default memo(function MatchHistory({ matches, loading }: MatchHistoryProps) {
  const [filterResult, setFilterResult] = useState<'all' | 'W' | 'L' | 'D'>('all');

  const getResultColor = (result: string) => {
    if (result === 'W') return 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5';
    if (result === 'L') return 'text-rose-400 border-rose-400/20 bg-rose-400/5';
    return 'text-amber-400 border-amber-400/20 bg-amber-400/5';
  };

  const getResultLabel = (result: string) => {
    if (result === 'W') return 'Vitória';
    if (result === 'L') return 'Derrota';
    return 'Empate';
  };

  // Filtrar partidas
  const filteredMatches = useMemo(() => {
    if (filterResult === 'all') return matches;
    return matches.filter(m => m.result === filterResult);
  }, [matches, filterResult]);

  // Dados para o gráfico de saldo
  const chartData = useMemo(() => {
    let cumulativeSaldo = 0;
    return matches.slice(-10).map((match, idx) => {
      const saldo = match.teamGoals - match.oppGoals;
      cumulativeSaldo += saldo;
      return {
        match: `M${matches.length - 10 + idx + 1}`,
        saldo: cumulativeSaldo,
        gf: match.teamGoals,
        ga: match.oppGoals,
      };
    });
  }, [matches]);

  return (
    <section id="historico" className="relative py-16 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      <Reveal>
        <SectionLabel>Linha do tempo</SectionLabel>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-8 sm:mb-16 tracking-tighter">HISTÓRICO</h2>
      </Reveal>

      {/* Gráfico de Saldo das Últimas 10 Partidas */}
      {!loading && matches.length > 0 && (
        <Reveal delay={50}>
          <div className="mb-16 glass-dark rounded-3xl p-6 sm:p-8 border border-white/10">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-6">Evolução de Saldo (Últimas 10 Partidas)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="match" stroke="rgba(255,255,255,0.3)" />
                <YAxis stroke="rgba(255,255,255,0.3)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'white' }}
                  formatter={(value) => [`Saldo: ${value}`, 'Cumulativo']}
                />
                <Line
                  type="monotone"
                  dataKey="saldo"
                  stroke="url(#colorSaldo)"
                  strokeWidth={2}
                  dot={{ fill: '#fff', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <defs>
                  <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Reveal>
      )}

      {/* Filtros */}
      <Reveal delay={100}>
        <div className="mb-8 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest">
            <Filter size={16} />
            Filtrar:
          </div>
          {(['all', 'W', 'L', 'D'] as const).map((filter) => (
            <motion.button
              key={filter}
              onClick={() => setFilterResult(filter)}
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255,255,255,0.2)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`px-4 py-2 rounded-lg font-bold uppercase text-xs tracking-widest transition-all border ${
                filterResult === filter
                  ? filter === 'W'
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : filter === 'L'
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                      : filter === 'D'
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'bg-white/10 border-white/30 text-white'
                  : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
              }`}
            >
              {filter === 'all' ? 'Todos' : filter === 'W' ? 'Vitórias' : filter === 'L' ? 'Derrotas' : 'Empates'}
              {filter !== 'all' && (
                <span className="ml-2 text-[10px]">
                  ({matches.filter(m => m.result === filter).length})
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </Reveal>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent hidden md:block" />

        <div className="space-y-12">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="h-32 glass-dark rounded-3xl animate-pulse" />
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredMatches.slice(0, 10).map((match, idx) => (
                <Reveal key={match.id} delay={idx * 50}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ scale: 1.01 }}
                    className={`relative flex flex-col md:flex-row items-center gap-8 ${
                      idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-black z-10 hidden md:block" />

                    {/* Content Card */}
                    <div className={`w-full md:w-[calc(50%-2rem)] glass-dark p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10 hover:border-white/30 transition-all group`}>
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                          {match.date}
                        </span>
                        <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getResultColor(match.result)}`}>
                          {getResultLabel(match.result)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-white/40 uppercase mb-1">Jovem Nuggs FC</h4>
                          <p className="text-lg sm:text-xl font-black text-white truncate">JN FC</p>
                        </div>

                        <div className="flex flex-col items-center px-4">
                          <div className="text-2xl sm:text-3xl font-black text-white tracking-tighter">
                            {match.teamGoals} <span className="text-white/20 mx-1">-</span> {match.oppGoals}
                          </div>
                        </div>

                        <div className={`flex-1 ${idx % 2 === 0 ? 'text-right' : 'text-right md:text-left'}`}>
                          <h4 className="text-xs font-bold text-white/40 uppercase mb-1">Adversário</h4>
                          <p className="text-lg sm:text-xl font-black text-white truncate">{match.opponent}</p>
                        </div>
                      </div>
                    </div>

                    {/* Empty space for the other side */}
                    <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                  </motion.div>
                </Reveal>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
});
