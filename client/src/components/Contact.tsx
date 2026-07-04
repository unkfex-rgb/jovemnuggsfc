import React, { memo, useState } from 'react';

export default memo(function Contact() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const socialLinks = [
    { name: 'Instagram', url: 'https://www.instagram.com/jovemnuggs.ofc/', logo: '/instagram-logo.png' },
    { name: 'Discord', url: 'https://discord.gg/kz5esRFec', logo: '/discord-logo.png' }
  ];

  return (
    <section id="contato" className="relative py-20 px-5 overflow-hidden">
      {/* Fundo preto com grid pattern */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 opacity-3" style={{
        backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, 0.03) 25%, rgba(0, 255, 255, 0.03) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.03) 75%, rgba(0, 255, 255, 0.03) 76%, transparent 77%, transparent),
                         linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, 0.03) 25%, rgba(0, 255, 255, 0.03) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.03) 75%, rgba(0, 255, 255, 0.03) 76%, transparent 77%, transparent)`,
        backgroundSize: '50px 50px'
      }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-center gap-8">
          {socialLinks.map((link) => (
            <div
              key={link.name}
              className="relative"
              onMouseEnter={() => setHoveredLink(link.name)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <a
                href={link.url}
                target="_blank" rel="noopener noreferrer"
                className="group relative overflow-hidden"
              >
                <div className="relative bg-black border-2 border-cyan-400 p-4 hover:border-cyan-300 transition-all duration-300 flex items-center justify-center" style={{
                  boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
                }} onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.6)';
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.3)';
                }}>
                  <img src={link.logo} alt={link.name} className="w-8 h-8 object-contain" />
                </div>
              </a>

              {hoveredLink === link.name && (
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-black border border-cyan-400 px-3 py-1 text-xs font-mono text-cyan-400 whitespace-nowrap animate-fadeIn" style={{
                  boxShadow: '0 0 10px rgba(0, 255, 255, 0.4)'
                }}>
                  {link.name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -5px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
});
