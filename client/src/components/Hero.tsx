import React, { memo } from 'react';

export default memo(function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-5 overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 via-transparent to-blue-500/10 pointer-events-none" />
      
      <div className="relative z-10 text-center max-w-270">
        <div className="mb-12 flex justify-center">
          <div className="relative w-40 h-40 md:w-56 md:h-56">
            <img 
              src="/manus-storage/Gemini_Generated_Image_5n2j585n2j585n2j_850aa1ac.png" 
              alt="Jovem Nuggs FC" 
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        <h1 className="text-7 md:text-12 font-900 tracking-wider mb-6 font-orbitron">
          <span className="bg-gradient-to-r from-white via-green-400 to-cyan-400 bg-clip-text text-transparent">
            JOVEM NUGGS FC
          </span>
        </h1>

        <p className="text-3 md:text-4 text-gray-300 mb-12 font-jetbrains">Seu clube virtual de futebol dedicado a reunir os melhores jogadores</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Partidas', value: '12' },
            { label: 'Vitorias', value: '8' },
            { label: 'Gols', value: '34' },
            { label: 'Assistencias', value: '18' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-4 md:text-5 font-900 text-green-400">{stat.value}</div>
              <div className="text-2.5 text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <button className="px-8 py-3.5 bg-gradient-to-r from-green-400 to-cyan-400 text-black font-700 rounded-full text-3 hover:shadow-lg hover:shadow-green-400/50 transition-all duration-300 font-orbitron">
          INSCREVER-SE
        </button>
      </div>
    </section>
  );
});
