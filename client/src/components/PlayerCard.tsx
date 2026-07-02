import React, { useState, memo, useEffect } from 'react';
import { getInitials, getPositionColor } from '../lib/playerUtils';

export const PlayerCardHover = memo(({ player, onClose }: any) => {
  const positionMap: Record<string, string> = {
    goalkeeper: 'Goleiro',
    gk: 'Goleiro',
    defender: 'Defesa',
    def: 'Defesa',
    midfielder: 'Meio',
    mid: 'Meio',
    forward: 'Atacante',
    att: 'Atacante',
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={handleBackdropClick}>
      <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-green-400 rounded-lg p-6 w-full max-w-sm shadow-2xl shadow-green-400/50 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 text-3 font-bold"
        >
          ×
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center font-orbitron font-700 text-5 text-black bg-gradient-to-br ${getPositionColor(player.position)} shadow-lg`}>
            {getInitials(player.name)}
          </div>
          <div>
            <div className="text-4 font-700 text-white">{player.name}</div>
            <div className="text-2.75 text-green-400 uppercase">{positionMap[player.position?.toLowerCase()] || player.position}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
            <div className="text-2.5 text-gray-400">Partidas</div>
            <div className="text-4 font-900 text-green-400">{player.matches}</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
            <div className="text-2.5 text-gray-400">Gols</div>
            <div className="text-4 font-900 text-red-400">{player.goals}</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
            <div className="text-2.5 text-gray-400">Assistências</div>
            <div className="text-4 font-900 text-blue-400">{player.assists}</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
            <div className="text-2.5 text-gray-400">Rating</div>
            <div className="text-4 font-900 text-yellow-400">{player.averageRating}</div>
          </div>
        </div>

        <div className="text-center text-2.75 text-gray-400">
          Jogador em excelente forma
        </div>
      </div>
    </div>
  );
});

PlayerCardHover.displayName = 'PlayerCardHover';

export const PlayerCard = memo(({ player }: any) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowDetails(true)}
        className="group relative w-full text-left"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg opacity-0 group-hover:opacity-75 blur transition-all duration-300" />
        <div className="relative bg-black border border-white/10 rounded-lg p-4 text-center hover:border-white/30 transition-all duration-300 cursor-pointer">
          <div className={`w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center font-orbitron font-700 text-4 text-black bg-gradient-to-br ${getPositionColor(player.position)} shadow-lg`}>
            {getInitials(player.name)}
          </div>
          <div className="text-3 font-700 truncate text-white">{player.name}</div>
          <div className="text-2.5 text-gray-400 mt-1 uppercase tracking-wide">{player.position}</div>
          <div className="text-2.25 font-600 text-green-400 mt-2">{player.matches} Partidas</div>
        </div>
      </button>
      {showDetails && <PlayerCardHover player={player} onClose={() => setShowDetails(false)} />}
    </>
  );
});

PlayerCard.displayName = 'PlayerCard';
