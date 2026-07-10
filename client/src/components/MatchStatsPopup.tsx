import React from 'react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './ui/hover-card';
import type { Match } from '@/types/api';
import { Trophy, Calendar } from 'lucide-react';

interface MatchStatsPopupProps {
  match: Match;
  children: React.ReactNode;
}

export const MatchStatsPopup = ({ match, children }: MatchStatsPopupProps) => {
  const teamGoals = match.teamGoals;
  const oppGoals = match.oppGoals;
  const result = match.result;

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-64 glass-dark border-white/10 p-0 overflow-hidden shadow-2xl"
        side="top"
        align="center"
        sideOffset={10}
      >
        <div className="p-4 border-b border-white/5 bg-white/5">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Resumo da Partida</h4>
            <div className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${
              result === 'W' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' :
              result === 'L' ? 'text-rose-400 border-rose-400/20 bg-rose-400/5' :
              'text-amber-400 border-amber-400/20 bg-amber-400/5'
            }`}>
              {result === 'W' ? 'Vitória' : result === 'L' ? 'Derrota' : 'Empate'}
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-4 mt-4">
            <div className="flex-1 text-center">
              <div className="text-[10px] font-bold text-white/40 uppercase mb-1">JN FC</div>
              <div className="text-2xl font-black text-white">{teamGoals}</div>
            </div>
            <div className="text-white/20 font-black text-xl">-</div>
            <div className="flex-1 text-center">
              <div className="text-[10px] font-bold text-white/40 uppercase mb-1">ADV</div>
              <div className="text-2xl font-black text-white">{oppGoals}</div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <Trophy size={14} className="text-emerald-400" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-tight">Competição</div>
              <div className="text-[11px] font-bold text-white">Liga Pro Clubs</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <Calendar size={14} className="text-blue-400" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-tight">Data do Jogo</div>
              <div className="text-[11px] font-bold text-white">{match.date}</div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 p-3 text-center border-t border-white/5">
          <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest italic">
            Dados Oficiais EA SPORTS FC 26
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
