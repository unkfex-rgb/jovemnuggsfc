import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Instagram, Youtube } from 'lucide-react';
import { SectionLabel } from './SectionLabel';
import { Reveal } from './Reveal';

interface GoalMedia {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  type: 'instagram' | 'youtube';
  date: string;
}

interface GoalsGalleryProps {
  media?: GoalMedia[];
}

export const GoalsGallery = React.memo(({ media = [] }: GoalsGalleryProps) => {
  const [selectedMedia, setSelectedMedia] = useState<GoalMedia | null>(null);

  // Mock data - em produção, viria de uma API
  const defaultMedia: GoalMedia[] = [
    {
      id: '1',
      title: 'Golaço do PECINHAA22',
      description: 'Finalização perfeita na área',
      thumbnail: 'https://via.placeholder.com/400x300?text=Gol+1',
      videoUrl: 'https://www.instagram.com/p/example1',
      type: 'instagram',
      date: '2024-01-15',
    },
    {
      id: '2',
      title: 'Assistência de Ouro',
      description: 'Passe cirúrgico para o gol',
      thumbnail: 'https://via.placeholder.com/400x300?text=Gol+2',
      videoUrl: 'https://www.youtube.com/watch?v=example2',
      type: 'youtube',
      date: '2024-01-14',
    },
    {
      id: '3',
      title: 'Defesa Espetacular',
      description: 'Bloqueio crucial na reta final',
      thumbnail: 'https://via.placeholder.com/400x300?text=Gol+3',
      videoUrl: 'https://www.instagram.com/p/example3',
      type: 'instagram',
      date: '2024-01-13',
    },
  ];

  const galleryMedia = media.length > 0 ? media : defaultMedia;

  if (galleryMedia.length === 0) return null;

  return (
    <section className="relative py-16 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      <Reveal>
        <SectionLabel>Melhores momentos</SectionLabel>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-8 sm:mb-16 tracking-tighter">GOLS DA SEMANA</h2>
      </Reveal>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {galleryMedia.map((item, idx) => (
            <Reveal key={item.id} delay={idx * 50}>
              <motion.div
                layoutId={item.id}
                onClick={() => setSelectedMedia(item)}
                className="group cursor-pointer relative overflow-hidden rounded-2xl aspect-video"
              >
                {/* Thumbnail */}
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Play Button */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <Play size={24} className="text-white fill-white ml-1" />
                  </div>
                </motion.div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    {item.type === 'instagram' ? (
                      <Instagram size={16} className="text-pink-400" />
                    ) : (
                      <Youtube size={16} className="text-red-500" />
                    )}
                    <span className="text-xs font-bold text-white/70 uppercase">{item.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white line-clamp-2">{item.title}</h3>
                  <p className="text-xs text-white/60 line-clamp-1">{item.description}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMedia(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />

            <motion.div
              layoutId={selectedMedia.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="pointer-events-auto w-full max-w-4xl">
                <div className="relative rounded-2xl overflow-hidden bg-black border border-white/20">
                  {/* Video Container */}
                  <div className="relative aspect-video bg-black">
                    {selectedMedia.type === 'instagram' ? (
                      <iframe
                        src={`https://www.instagram.com/p/${selectedMedia.videoUrl.split('/p/')[1]}/embed`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        className="w-full h-full"
                      />
                    ) : (
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${selectedMedia.videoUrl.split('v=')[1]}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-6 border-t border-white/10">
                    <h3 className="text-xl font-bold text-white mb-2">{selectedMedia.title}</h3>
                    <p className="text-white/60 text-sm mb-4">{selectedMedia.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/40 font-bold uppercase">{selectedMedia.date}</span>
                      <a
                        href={selectedMedia.videoUrl}
                        target="_blank" rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-colors"
                      >
                        Ver Original
                      </a>
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedMedia(null)}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-black/50 hover:bg-black/70 transition-colors z-10"
                  >
                    <X size={20} className="text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
});

GoalsGallery.displayName = 'GoalsGallery';
