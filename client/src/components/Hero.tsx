import React, { memo } from 'react';

export default memo(function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Fundo com gradiente e efeito cyberpunk */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-cyan-950/10 to-black" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full" />
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Escudo com glow radial */}
        <div className="relative mb-8 flex justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-cyan-500 to-purple-500 opacity-30 blur-2xl rounded-full scale-150" />
          <img 
            src="/escudo-metalico-transparente.png" 
            alt="Jovem Nuggs FC" 
            className="h-64 w-64 object-contain relative z-10 drop-shadow-2xl animate-pulse"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(61, 255, 138, 0.4))',
              animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}
          />
          {/* Anel pulsante */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 scale-110" style={{
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }} />
        </div>

        {/* Título */}
        <h1 className="text-6xl md:text-8xl font-900 tracking-wider mb-6 font-orbitron">
          <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            JOVEM NUGGS FC
          </span>
        </h1>

        {/* Descrição */}
        <p className="text-lg md:text-xl text-gray-300 font-mono mb-12 max-w-2xl mx-auto">
          Seu clube virtual de futebol dedicado a reunir os melhores jogadores
        </p>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-4 backdrop-blur">
            <div className="text-3xl font-900 text-cyan-400">12</div>
            <div className="text-sm text-gray-400 font-mono">Partidas</div>
          </div>
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-4 backdrop-blur">
            <div className="text-3xl font-900 text-green-400">8</div>
            <div className="text-sm text-gray-400 font-mono">Vitórias</div>
          </div>
          <div className="bg-black/50 border border-purple-500/30 rounded-lg p-4 backdrop-blur">
            <div className="text-3xl font-900 text-purple-400">34</div>
            <div className="text-sm text-gray-400 font-mono">Gols</div>
          </div>
          <div className="bg-black/50 border border-yellow-500/30 rounded-lg p-4 backdrop-blur">
            <div className="text-3xl font-900 text-yellow-400">18</div>
            <div className="text-sm text-gray-400 font-mono">Assistências</div>
          </div>
        </div>

        {/* CTA Button */}
        <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold rounded-full hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 font-mono">
          INSCREVER-SE
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </section>
  );
});
