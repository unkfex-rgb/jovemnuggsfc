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
        isScrolled ? "py-4 bg-black/60 backdrop-blur-xl border-b border-white/5" : "py-6 bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-black group-hover:rotate-12 transition-transform duration-500 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            JN
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black text-lg leading-none tracking-tighter">JOVEM NUGGS</span>
            <span className="text-[10px] text-white/40 font-bold tracking-[0.3em] uppercase">Elite Squad</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <div className="flex gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-white/50 hover:text-white transition-all text-[11px] font-bold uppercase tracking-widest relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-white/10 mx-2" />

          <div className="flex items-center gap-4">
            <a 
              href="https://discord.gg/kz5esRFec" 
              target="_blank" 
              className="p-2 text-white/40 hover:text-white transition-colors"
            >
              <MessageCircle size={18} />
            </a>
            <a 
              href="https://www.instagram.com/jovemnuggs.ofc/" 
              target="_blank" 
              className="p-2 text-white/40 hover:text-white transition-colors"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>

        <button
          className="lg:hidden w-10 h-10 flex items-center justify-center text-white bg-white/5 rounded-lg border border-white/10"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 top-[73px] bg-black/95 backdrop-blur-2xl z-40 border-t border-white/5"
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
                  className="text-3xl font-black text-white/40 hover:text-white transition-all uppercase tracking-tighter"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              
              <div className="mt-8 pt-8 border-t border-white/10 flex gap-6">
                 <a href="https://discord.gg/kz5esRFec" target="_blank" className="flex items-center gap-2 text-white font-bold">
                    <MessageCircle size={24} /> Discord
                 </a>
                 <a href="https://www.instagram.com/jovemnuggs.ofc/" target="_blank" className="flex items-center gap-2 text-white font-bold">
                    <Instagram size={24} /> Instagram
                 </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
