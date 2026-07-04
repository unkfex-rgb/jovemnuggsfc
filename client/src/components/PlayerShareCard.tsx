import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Instagram } from 'lucide-react';
import html2canvas from 'html2canvas';
import { getPositionLabel, getPositionColor } from '@/lib/playerUtils';
import type { Player } from '@/types/api';

interface PlayerShareCardProps {
  player: Player;
  isOpen: boolean;
  onClose: () => void;
}

export const PlayerShareCard = React.memo(({ player, isOpen, onClose }: PlayerShareCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadCard = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#000000',
        scale: 1, // Reduzindo o scale para simplificar a renderização
        useCORS: true,
        allowTaint: true,
        logging: true, // Ativando logs para debugar se falhar novamente
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${player.name.replace(/\s+/g, '_')}_JN_Card.png`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => document.body.removeChild(link), 100);
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      alert('Erro ao gerar a imagem. Tente novamente.');
    }
  };

  const shareToInstagram = () => {
    // Em produção, isso geraria a imagem e permitiria compartilhar
    alert(
      `Compartilhe esta imagem do ${player.name} no seu Instagram Stories!\n\n` +
        `Baixe a imagem primeiro e compartilhe com a hashtag #JovemNuggsFC`
    );
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Card Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Share Card */}
        <div
          ref={cardRef}
          className={`relative rounded-3xl overflow-hidden border-4 border-white p-8 bg-gradient-to-br ${getPositionColor(player.position)}`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10" data-html2canvas-ignore="true">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center space-y-6">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border-2 border-white flex items-center justify-center">
                <span className="text-2xl font-black text-white">JN</span>
              </div>
            </div>

            {/* Player Info */}
            <div>
              <h2 className="text-4xl font-black text-white mb-2">{player.name}</h2>
              <p className="text-lg font-bold text-white/80 uppercase tracking-widest">
                {getPositionLabel(player.position)}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                <p className="text-xs font-bold text-white/60 uppercase">Partidas</p>
                <p className="text-2xl font-black text-white">{player.matches}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                <p className="text-xs font-bold text-white/60 uppercase">Gols</p>
                <p className="text-2xl font-black text-white">{player.goals}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                <p className="text-xs font-bold text-white/60 uppercase">Assists</p>
                <p className="text-2xl font-black text-white">{player.assists}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p className="text-xs font-bold text-white/60 uppercase mb-1">Nota Média</p>
              <p className="text-5xl font-black text-white">{player.avgRating.toFixed(1)}</p>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-white/20">
              <p className="text-xs font-bold text-white/60 uppercase tracking-widest">
                JOVEM NUGGS FC • Elite Squad
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadCard}
            className="flex-1 px-4 py-3 rounded-lg bg-white text-black font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
          >
            <Download size={18} />
            Baixar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareToInstagram}
            className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Instagram size={18} />
            Compartilhar
          </motion.button>
        </div>

        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-colors"
        >
          Fechar
        </motion.button>
      </div>
    </motion.div>
  );
});

PlayerShareCard.displayName = 'PlayerShareCard';
