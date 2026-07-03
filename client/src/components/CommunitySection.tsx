import { motion } from "framer-motion";
import { MessageCircle, Instagram, ArrowUpRight } from "lucide-react";
import { SectionLabel } from "./SectionLabel";
import { Reveal } from "./Reveal";

export function CommunitySection() {
  const communities = [
    {
      name: "Discord",
      description: "Entre na comunidade oficial do Jovem Nuggs FC para conversar com jogadores, acompanhar novidades e participar da torcida.",
      icon: MessageCircle,
      url: "https://discord.gg/kz5esRFec",
      label: "Entrar no Discord",
      color: "group-hover:text-[#5865F2]"
    },
    {
      name: "Instagram",
      description: "Acompanhe resultados, bastidores, escalações e conteúdos exclusivos do clube.",
      icon: Instagram,
      url: "https://www.instagram.com/jovemnuggs.ofc/",
      label: "Seguir no Instagram",
      color: "group-hover:text-[#E4405F]"
    },
  ];

  return (
    <section id="comunidade" className="relative py-16 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      <Reveal>
        <SectionLabel>Conecte-se com a gente</SectionLabel>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 sm:mb-10 tracking-tighter">COMUNIDADE</h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {communities.map((community, i) => {
          const Icon = community.icon;
          return (
            <Reveal key={community.name} delay={i * 100}>
              <motion.a
                href={community.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-dark card-hover rounded-2xl sm:rounded-3xl p-6 sm:p-10 block group relative overflow-hidden"
                whileHover={{ y: -10 }}
              >
                {/* Background Decor */}
                <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Icon size={200} />
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
<div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 ${community.color} transition-colors`}>
	                      <Icon size={24} className="sm:w-8 sm:h-8" />
	                    </div>
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                      <ArrowUpRight size={20} />
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-3xl font-bold text-white mb-2 sm:mb-4 tracking-tight">
                    {community.name} Oficial
                  </h3>
                  
                  <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 max-w-md">
                    {community.description}
                  </p>

                  <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white group-hover:gap-4 transition-all">
                    {community.label}
                    <div className="w-8 h-[1px] bg-white/30 group-hover:w-12 group-hover:bg-white transition-all" />
                  </div>
                </div>
              </motion.a>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
