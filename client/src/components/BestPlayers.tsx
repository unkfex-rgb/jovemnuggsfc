import React, { useMemo, memo } from 'react';
import { trpc } from '../lib/trpc';
import { getInitials, getPositionColor, getPositionLabel, getPositionCategory, calculatePlayerScore } from '../lib/playerUtils';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BestPlayerCard = memo(({ player, position, rank }: any) => {
  const positionLabel = getPositionLabel(position);
  const playerScore = calculatePlayerScore(player);

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className="group relative flex-shrink-0 w-full sm:w-80"
    >
      {/* Animated glow background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-40 blur-lg transition-all duration-500" />

      {/* Card Container */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-black border border-white/10 group-hover:border-cyan-500/50 rounded-xl p-6 transition-all duration-300 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)',
        }} />

        {/* Content */}
        <div className="relative z-10">
          {/* Rank Badge */}
          <div className="mb-4 flex items-center justify-between">
            <div className="inline-block px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-lg">
              <span className="text-2.5 font-900 text-yellow-300">#{rank}</span>
            </div>
            <div className="inline-block px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-lg">
              <span className="text-2 font-bold text-cyan-300">{positionLabel}</span>
            </div>
          </div>

          {/* Player Avatar */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className={`w-20 h-20 rounded-xl mx-auto mb-4 flex items-center justify-center font-orbitron font-900 text-5 text-white bg-gradient-to-br ${getPositionColor(position)} shadow-lg shadow-cyan-500/30 border-2 border-cyan-400/30 group-hover:border-cyan-400/70 transition-all duration-300`}
          >
            {getInitials(player.name)}
          </motion.div>

          {/* Player Name */}
          <h3 className="text-3 font-800 text-white text-center mb-3 group-hover:text-cyan-300 transition-colors duration-300 line-clamp-2">
            {player.name}
          </h3>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center">
              <div className="text-1.75 text-gray-400">Partidas</div>
              <div className="text-3 font-900 text-cyan-400">{player.matches}</div>
            </div>
            <div className="text-center">
              <div className="text-1.75 text-gray-400">Gols</div>
              <div className="text-3 font-900 text-red-400">{player.goals}</div>
            </div>
            <div className="text-center">
              <div className="text-1.75 text-gray-400">Rating</div>
              <div className="text-3 font-900 text-yellow-400">{player.averageRating}</div>
            </div>
          </div>

          {/* Score Bar */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-2 text-gray-400">Score</span>
              <span className="text-2.5 font-bold text-purple-300">{playerScore}</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (playerScore / 100) * 100)}%` }}
                transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

BestPlayerCard.displayName = 'BestPlayerCard';

export default memo(function BestPlayers() {
  const { data: stats } = trpc.club.stats.useQuery();
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const bestPlayersByPosition = useMemo(() => {
    if (!stats?.players) return {};

    const players = Object.values(stats.players) as any[];
    const grouped: Record<string, any> = {
      goalkeeper: null,
      defender: null,
      midfielder: null,
      forward: null,
    };

    // Find best player for each position
    players.forEach((player) => {
      const category = getPositionCategory(player.position);
      if (!grouped[category] || calculatePlayerScore(player) > calculatePlayerScore(grouped[category])) {
        grouped[category] = player;
      }
    });

    return grouped;
  }, [stats]);

  const positions = useMemo(() => {
    return Object.entries(bestPlayersByPosition)
      .filter(([_, player]) => player !== null)
      .map(([position, player]) => ({ position, player }));
  }, [bestPlayersByPosition]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newPosition = direction === 'left'
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth',
      });
      setScrollPosition(newPosition);
    }
  };

  if (positions.length === 0) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
    },
  };

  return (
    <section className="relative py-20 px-5 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="max-w-270 mx-auto relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-5 md:text-8 font-900 tracking-wider mb-4 font-orbitron text-center">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Melhores por Posição
            </span>
          </h2>
          <p className="text-center text-gray-400 text-3 md:text-3.5">
            Destaque do elenco em cada setor do campo
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Scroll Container */}
          <motion.div
            ref={scrollContainerRef}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {positions.map(({ position, player }, idx) => (
              <motion.div key={position} variants={itemVariants as any}>
                <BestPlayerCard
                  player={player}
                  position={position}
                  rank={idx + 1}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Navigation Buttons */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:from-cyan-400 hover:to-blue-400"
          >
            <ChevronLeft size={24} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:from-cyan-400 hover:to-blue-400"
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>

        {/* Grid Alternative (for smaller screens) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
        >
          {positions.map(({ position, player }, idx) => (
            <BestPlayerCard
              key={position}
              player={player}
              position={position}
              rank={idx + 1}
            />
          ))}
        </motion.div>
      </div>

      {/* Custom scrollbar hide CSS */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
});
