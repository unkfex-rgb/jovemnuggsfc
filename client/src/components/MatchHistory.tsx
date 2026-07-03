import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { SectionLabel } from './SectionLabel';
import { Reveal } from './Reveal';
import type { Match } from '@/types/api';

interface MatchHistoryProps {
  matches: Match[];
  loading?: boolean;
}

export default memo(function MatchHistory({ matches, loading }: MatchHistoryProps) {
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

  return (
    <section id="historico" className="relative py-28 px-6 max-w-7xl mx-auto">
      <Reveal>
        <SectionLabel>Linha do tempo</SectionLabel>
        <h2 className="text-4xl md:text-6xl font-bold mb-16 tracking-tighter">HISTÓRICO</h2>
      </Reveal>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent hidden md:block" />

        <div className="space-y-12">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="h-32 glass-dark rounded-3xl animate-pulse" />
            ))
          ) : (
            matches.slice(0, 10).map((match, idx) => (
              <Reveal key={match.id} delay={idx * 50}>
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className={`relative flex flex-col md:flex-row items-center gap-8 ${
                    idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-black z-10 hidden md:block" />

                  {/* Content Card */}
                  <div className={`w-full md:w-[calc(50%-2rem)] glass-dark p-8 rounded-3xl border border-white/10 hover:border-white/30 transition-all group`}>
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
                        <p className="text-xl font-black text-white truncate">JN FC</p>
                      </div>

                      <div className="flex flex-col items-center px-4">
                        <div className="text-3xl font-black text-white tracking-tighter">
                          {match.teamGoals} <span className="text-white/20 mx-1">-</span> {match.oppGoals}
                        </div>
                      </div>

                      <div className={`flex-1 ${idx % 2 === 0 ? 'text-right' : 'text-right md:text-left'}`}>
                        <h4 className="text-xs font-bold text-white/40 uppercase mb-1">Adversário</h4>
                        <p className="text-xl font-black text-white truncate">{match.opponent}</p>
                      </div>
                    </div>
                  </div>

                  {/* Empty space for the other side */}
                  <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                </motion.div>
              </Reveal>
            ))
          )}
        </div>
      </div>
    </section>
  );
});
