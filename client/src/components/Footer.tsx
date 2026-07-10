import { Instagram, MessageCircle, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative border-t border-cyan-500/20 bg-black py-12 sm:py-20 overflow-hidden">
      {/* Background Decor */}
      <motion.div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Glow effect */}
      <motion.div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 sm:gap-12 mb-12 sm:mb-20">
          {/* Logo Section */}
          <motion.div 
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="flex items-center gap-3 mb-6 group cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 relative"
                whileHover={{ scale: 1.1 }}
              >
                <img 
                  src="/assets/logo-official.png" 
                  alt="JN" 
                  className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(0,255,255,0.3)] group-hover:drop-shadow-[0_0_25px_rgba(0,255,255,0.5)] transition-all" 
                />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-white font-black text-xl sm:text-2xl leading-none tracking-tighter uppercase">JOVEM NUGGS</span>
                <span className="text-xs text-cyan-400/60 font-bold tracking-[0.3em] uppercase">Elite Squad</span>
              </div>
            </motion.div>
            <motion.p 
              className="text-white/40 text-base sm:text-lg font-medium max-w-sm leading-relaxed hover:text-white/60 transition-colors"
              whileHover={{ x: 5 }}
            >
              "Ninguém joga sozinho. Respeita a camisa." O portal oficial da organização profissional Jovem Nuggs FC.
            </motion.p>
          </motion.div>

          {/* Social Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-8 text-cyan-400">Social</h3>
            <div className="flex flex-col gap-4">
              <motion.a
                href="https://discord.gg/kz5esRFec"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-cyan-400 transition-all flex items-center gap-3 font-bold uppercase text-[11px] tracking-widest group"
                whileHover={{ x: 5 }}
              >
                <motion.div 
                  className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-cyan-400/50 group-hover:bg-cyan-400/10 transition-all"
                  whileHover={{ rotate: 10 }}
                >
                  <MessageCircle size={16} />
                </motion.div>
                Discord Oficial
              </motion.a>
              <motion.a
                href="https://www.instagram.com/jovemnuggs.ofc/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-cyan-400 transition-all flex items-center gap-3 font-bold uppercase text-[11px] tracking-widest group"
                whileHover={{ x: 5 }}
              >
                <motion.div 
                  className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-cyan-400/50 group-hover:bg-cyan-400/10 transition-all"
                  whileHover={{ rotate: -10 }}
                >
                  <Instagram size={16} />
                </motion.div>
                Instagram Oficial
              </motion.a>
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-8 text-cyan-400">Informações</h3>
            <div className="text-white/40 text-sm font-medium space-y-2">
              <p>© 2026 Jovem Nuggs FC</p>
              <p>Todos os direitos reservados.</p>
              <p className="pt-4 text-[10px] font-bold uppercase tracking-widest text-cyan-400/60">Brasília, Brasil</p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-cyan-500/20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.p 
            className="text-white/20 text-[10px] font-bold uppercase tracking-[0.4em] hover:text-cyan-400/40 transition-colors"
            whileHover={{ letterSpacing: "0.5em" }}
          >
            Precision & Passion in Esports
          </motion.p>
          <motion.div 
            className="flex items-center gap-2 text-white/20 text-[10px] font-bold uppercase tracking-[0.4em] group"
            whileHover={{ scale: 1.05 }}
          >
            Developed with{" "}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart size={10} className="text-white/40 group-hover:text-red-500 transition-colors" />
            </motion.div>
            {" "}by{" "}
            <motion.a
              href="https://www.instagram.com/corintia420/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/20 hover:text-cyan-400 transition-all relative group/link"
              whileHover={{ scale: 1.1 }}
            >
              Corintia420
              <motion.span 
                className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded opacity-0 group-hover/link:opacity-20 blur-lg transition-opacity"
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
