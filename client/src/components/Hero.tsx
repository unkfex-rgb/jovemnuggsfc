import React, { memo } from 'react';

export default memo(function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Fundo preto puro com grid pattern sutil */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent),
                         linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent)`,
        backgroundSize: '50px 50px'
      }} />
      
      {/* Neon glow sutil - Cyan */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full opacity-40" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-cyan-500/5 blur-3xl rounded-full opacity-30" />
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Escudo com border neon */}
        <div className="relative mb-12 flex justify-center">
          <img 
            src="/escudo-metalico-transparente.png" 
            alt="Jovem Nuggs FC" 
            className="h-64 w-64 object-contain relative z-10"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.4))',
            }}
          />
          {/* Anel neon pulsante */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/60 scale-110" style={{
            animation: 'borderPulse 2s ease-in-out infinite',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.4)'
          }} />
        </div>

        {/* Título em branco com neon glow */}
        <h1 className="text-6xl md:text-8xl font-900 tracking-widest mb-6 font-orbitron text-white" style={{
          textShadow: '0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(0, 255, 255, 0.3)',
          letterSpacing: '0.08em'
        }}>
          JOVEM NUGGS FC
        </h1>

        {/* Linha divisória */}
        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-8" style={{
          boxShadow: '0 0 10px rgba(0, 255, 255, 0.6)'
        }} />

        {/* Descrição em branco */}
        <p className="text-base md:text-lg text-gray-300 font-mono mb-12 max-w-2xl mx-auto tracking-wide">
          TORCIDA ORGANIZADA | FUTEBOL VIRTUAL | ELITE
        </p>

        {/* Estatísticas com estilo clean e borders neon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-black border border-cyan-400/50 p-4" style={{
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)',
            transition: 'all 0.3s ease'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.8)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.5)';
            e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.2)';
          }}>
            <div className="text-3xl font-900 text-white mb-1">12</div>
            <div className="text-xs text-gray-400 font-mono uppercase tracking-widest">Partidas</div>
          </div>
          <div className="bg-black border border-cyan-400/50 p-4" style={{
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)',
            transition: 'all 0.3s ease'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.8)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.5)';
            e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.2)';
          }}>
            <div className="text-3xl font-900 text-white mb-1">8</div>
            <div className="text-xs text-gray-400 font-mono uppercase tracking-widest">Vitórias</div>
          </div>
          <div className="bg-black border border-cyan-400/50 p-4" style={{
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)',
            transition: 'all 0.3s ease'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.8)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.5)';
            e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.2)';
          }}>
            <div className="text-3xl font-900 text-white mb-1">34</div>
            <div className="text-xs text-gray-400 font-mono uppercase tracking-widest">Gols</div>
          </div>
          <div className="bg-black border border-cyan-400/50 p-4" style={{
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)',
            transition: 'all 0.3s ease'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.8)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.5)';
            e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.2)';
          }}>
            <div className="text-3xl font-900 text-white mb-1">18</div>
            <div className="text-xs text-gray-400 font-mono uppercase tracking-widest">Assistências</div>
          </div>
        </div>

        {/* CTA Button - Clean e Neon */}
        <button className="px-8 py-3 bg-black border-2 border-cyan-400 text-cyan-400 font-bold font-mono uppercase tracking-widest hover:bg-cyan-400 hover:text-black transition-all duration-300 transform hover:scale-105" style={{
          boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)'
        }}>
          INSCREVER-SE
        </button>
      </div>
    </section>
  );
});
