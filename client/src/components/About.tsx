import React, { memo } from 'react';

const AboutCard = memo(({ icon, title, description, image }: any) => (
  <div className="group relative overflow-hidden rounded-lg">
    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-cyan-500 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300" />
    <div className="relative bg-black border border-white/10 rounded-lg overflow-hidden hover:border-white/30 transition-all duration-300">
      <div className="h-32 bg-gradient-to-br from-white/10 to-white/5 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-6">
        <div className="text-4 font-700 mb-2 text-white">{title}</div>
        <p className="text-2.75 text-gray-400 leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
));

AboutCard.displayName = 'AboutCard';

export default memo(function About() {
  const cards = [
    {
      title: 'Fundacao',
      description: 'Fundado em 2026, o Jovem Nuggs FC nasceu da paixao por futebol virtual e competicao de alto nivel.',
      image: '/manus-storage/knqYxtUGeA5u_c20cf1ca.jpg',
    },
    {
      title: 'Estilo',
      description: 'Jogo ofensivo, rapido e criativo. Focamos em posse de bola, passes precisos e criacao de oportunidades.',
      image: '/manus-storage/MpC5fx16FzIe_82b89bf1.jpg',
    },
    {
      title: 'Plataforma',
      description: 'Competindo em EA SPORTS FC 26, a plataforma mais realista e competitiva de futebol virtual.',
      image: '/manus-storage/VRyn7WNjUkfQ_3374f296.webp',
    },
    {
      title: 'Divisao',
      description: 'Disputando a Elite Virtual, a mais alta divisao competitiva com os melhores clubes do mundo.',
      image: '/manus-storage/OYeaChdyu821_dc6f7e37.png',
    },
  ];

  return (
    <section id="sobre" className="relative py-20 px-5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />
      <div className="max-w-270 mx-auto relative z-10">
        <h2 className="text-5 md:text-8 font-900 tracking-wider mb-16 font-orbitron text-center">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Conheca o Clube
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <AboutCard key={idx} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
});
