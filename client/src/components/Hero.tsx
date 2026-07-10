import { motion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background with cinematic effects */}
      <div className="absolute inset-0 -z-10">
        <motion.img
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src="/manus-storage/ea-fc-hero-bg.webp"
          alt="Background"
          className="w-full h-full object-cover blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black" />
        
        {/* Animated Light Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: "spring" }}
          className="mb-12 relative inline-block"
        >
          <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full" />
          <div className="relative w-32 h-32 md:w-48 md:h-48 mx-auto">
            <img
              src="/assets/logo-official.png"
              alt="Logo"
              className="w-full h-full drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            />
          </div>
        </motion.div>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white mb-6 tracking-tighter leading-none">
              JOVEM NUGGS <span className="ea-fc-text-gradient">FC</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white/40 text-xs sm:text-sm md:text-lg tracking-[0.2em] sm:tracking-[0.4em] uppercase mb-12 font-bold max-w-2xl mx-auto px-4"
          >
            "Ninguém joga sozinho. Respeita a camisa."
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button
              onClick={() =>
                document
                  .getElementById("estatisticas")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="group relative px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-sm rounded-xl overflow-hidden transition-all hover:pr-12 btn-primary"
            >
              <span className="relative z-10">Explorar Estatísticas</span>
              <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" size={20} />
            </button>
            
            <a 
              href="#elenco"
              className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-black uppercase tracking-widest text-sm rounded-xl hover:bg-white/10 transition-all btn-secondary"
            >
              Ver Elenco
            </a>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown className="text-white/20" size={24} />
      </motion.div>
    </section>
  );
}
