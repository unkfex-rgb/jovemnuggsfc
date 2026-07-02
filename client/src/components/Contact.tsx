import React, { memo } from 'react';

export default memo(function Contact() {
  const socialLinks = [
    { name: 'Instagram', url: 'https://www.instagram.com/jovemnuggs.ofc/', icon: '📷' },
    { name: 'Discord', url: 'https://discord.gg/kz5esRFec', icon: '💬' }
  ];

  return (
    <section id="contato" className="relative py-20 px-5 overflow-hidden">
      {/* Fundo com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-center gap-8">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300" />
              <div className="relative bg-black border border-white/10 rounded-lg p-8 hover:border-white/30 transition-all duration-300 text-center">
                <div className="text-6xl mb-4">{link.icon}</div>
                <div className="text-white font-mono font-bold text-lg">{link.name}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
});
