import { motion } from "framer-motion";
import { MessageCircle, Instagram } from "lucide-react";
import { SectionLabel } from "./SectionLabel";
import { Reveal } from "./Reveal";

export function CommunitySection() {
  const communities = [
    {
      name: "Discord",
      description: "Junte-se ao servidor oficial",
      icon: MessageCircle,
      url: "https://discord.gg/kz5esRFec",
      color: "from-blue-500 to-purple-600",
    },
    {
      name: "Instagram",
      description: "Siga nossas atualizações",
      icon: Instagram,
      url: "https://www.instagram.com/jovemnuggs.ofc/",
      color: "from-pink-500 to-rose-600",
    },
  ];

  return (
    <section id="comunidade" className="relative py-28 px-6 max-w-7xl mx-auto">
      <Reveal>
        <SectionLabel>Conecte-se com a gente</SectionLabel>
        <h2 className="text-4xl md:text-6xl font-bold mb-10">COMUNIDADE</h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {communities.map((community, i) => {
          const Icon = community.icon;
          return (
            <Reveal key={community.name} delay={i * 100}>
              <motion.a
                href={community.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass card-hover rounded-2xl p-8 block group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${community.color} flex items-center justify-center`}
                  >
                    <Icon size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {community.name}
                    </h3>
                    <p className="text-white/60 text-sm">
                      {community.description}
                    </p>
                  </div>
                </div>
                <div className="text-white/40 group-hover:text-white/60 transition-colors text-sm">
                  Clique para acessar →
                </div>
              </motion.a>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
