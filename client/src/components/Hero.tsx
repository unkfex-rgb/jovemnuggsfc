import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      <div className="absolute inset-0 -z-10">
        <img
          src="/manus-storage/hero-bg_62eb721f.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-8">
            <img
              src="/manus-storage/logo-mark_a44f0256.png"
              alt="Logo"
              className="w-full h-full"
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-gradient mb-4"
        >
          JOVEM NUGGS FC
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-white/60 text-sm md:text-base tracking-widest uppercase mb-8"
        >
          Elite Squad • Professional Gaming
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          onClick={() =>
            document
              .getElementById("estatisticas")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="btn-primary"
        >
          Explorar Estatísticas
        </motion.button>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="text-white/40" size={32} />
      </motion.div>
    </section>
  );
}
