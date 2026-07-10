import { useState, useEffect } from "react";
import { Menu, X, Instagram, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Estatísticas", href: "#estatisticas" },
    { label: "Dashboard", href: "#dashboard" },
    { label: "Elenco", href: "#elenco" },
    { label: "Formação", href: "#formacao" },
    { label: "Histórico", href: "#historico" },
    { label: "Comunidade", href: "#comunidade" },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "py-4 bg-black/70 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_0_30px_rgba(0,255,255,0.1)]" 
          : "py-6 bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-2 sm:gap-3 group cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div 
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 relative"
            animate={isScrolled ? { scale: 0.9 } : { scale: 1 }}
          >
            <img 
              src="/assets/logo-official.png" 
              alt="JN" 
              className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all" 
            />
            {/* Glow effect */}
            <motion.div 
              animate={isScrolled ? { opacity: 0.5 } : { opacity: 0 }}
              className="absolute inset-0 rounded-full bg-cyan-500/20 blur-lg"
            />
          </motion.div>
          <div className="flex flex-col">
            <motion.span 
              animate={isScrolled ? { fontSize: "0.875rem" } : { fontSize: "1rem" }}
              className="text-white font-black leading-none tracking-tighter transition-all"
            >
              JOVEM NUGGS
            </motion.span>
            <span className="text-[8px] sm:text-[10px] text-cyan-400/60 font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase">Elite Squad</span>
          </div>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex gap-6">
            {navLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="text-white/50 hover:text-cyan-400 transition-all text-[11px] font-bold uppercase tracking-widest relative group"
                whileHover={{ y: -2 }}
              >
                {link.label}
                <motion.span 
                  className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-400 transition-all group-hover:shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </div>

          <motion.div 
            className="h-4 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/40 to-transparent mx-2"
            animate={isScrolled ? { opacity: 1 } : { opacity: 0.5 }}
          />

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <motion.a 
              href="https://discord.gg/kz5esRFec" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 text-white/40 hover:text-cyan-400 transition-all rounded-lg hover:bg-cyan-400/10 border border-transparent hover:border-cyan-400/30"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle size={18} />
            </motion.a>
            <motion.a 
              href="https://www.instagram.com/jovemnuggs.ofc/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 text-white/40 hover:text-cyan-400 transition-all rounded-lg hover:bg-cyan-400/10 border border-transparent hover:border-cyan-400/30"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Instagram size={18} />
            </motion.a>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="lg:hidden w-10 h-10 flex items-center justify-center text-white bg-white/5 rounded-lg border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-400/10 transition-all"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 top-[65px] sm:top-[73px] bg-black/95 backdrop-blur-2xl z-40 border-t border-cyan-500/20"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="container py-12 flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-2xl sm:text-3xl font-black text-white/40 hover:text-cyan-400 transition-all uppercase tracking-tighter"
                  onClick={() => setIsOpen(false)}
                  whileHover={{ x: 10 }}
                >
                  {link.label}
                </motion.a>
              ))}
              
              <motion.div 
                className="mt-8 pt-8 border-t border-cyan-500/20 flex gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
              >
                <motion.a 
                  href="https://discord.gg/kz5esRFec" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-white font-bold hover:text-cyan-400 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <MessageCircle size={24} /> Discord
                </motion.a>
                <motion.a 
                  href="https://www.instagram.com/jovemnuggs.ofc/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-white font-bold hover:text-cyan-400 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <Instagram size={24} /> Instagram
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
