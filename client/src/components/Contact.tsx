import React, { memo, useState } from 'react';

export default memo(function Contact() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const socialLinks = [
    { name: 'Instagram', url: 'https://www.instagram.com/jovemnuggs.ofc/' },
    { name: 'Discord', url: 'https://discord.gg/kz5esRFec' }
  ];

  return (
    <section id="contato" className="relative py-20 px-5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-center gap-12">
          {socialLinks.map((link) => (
            <div
              key={link.name}
              className="relative"
              onMouseEnter={() => setHoveredLink(link.name)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300" />
                <div className="relative bg-black border border-white/10 rounded-lg px-8 py-6 hover:border-white/30 transition-all duration-300 text-center">
                  <div className="text-xl font-mono font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                    {link.name}
                  </div>
                </div>
              </a>

              {hoveredLink === link.name && (
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-black border border-cyan-500/50 rounded px-3 py-1 text-xs font-mono text-cyan-400 whitespace-nowrap animate-fadeIn">
                  Clique para acessar
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
