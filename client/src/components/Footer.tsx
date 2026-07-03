import { Instagram, MessageCircle, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-black py-20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6 group cursor-pointer">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-black group-hover:rotate-12 transition-transform duration-500 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                JN
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-2xl leading-none tracking-tighter uppercase">JOVEM NUGGS</span>
                <span className="text-xs text-white/40 font-bold tracking-[0.3em] uppercase">Elite Squad</span>
              </div>
            </div>
            <p className="text-white/40 text-lg font-medium max-w-sm leading-relaxed">
              "Ninguém joga sozinho. Respeita a camisa." O portal oficial da organização profissional Jovem Nuggs FC.
            </p>
          </div>

          <div>
            <h3 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-8">Social</h3>
            <div className="flex flex-col gap-4">
              <a
                href="https://discord.gg/kz5esRFec"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-all flex items-center gap-3 font-bold uppercase text-[11px] tracking-widest group"
              >
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-white/30 transition-colors">
                  <MessageCircle size={16} />
                </div>
                Discord Oficial
              </a>
              <a
                href="https://www.instagram.com/jovemnuggs.ofc/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-all flex items-center gap-3 font-bold uppercase text-[11px] tracking-widest group"
              >
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-white/30 transition-colors">
                  <Instagram size={16} />
                </div>
                Instagram Oficial
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-8">Informações</h3>
            <div className="text-white/40 text-sm font-medium space-y-2">
              <p>© 2026 Jovem Nuggs FC</p>
              <p>Todos os direitos reservados.</p>
              <p className="pt-4 text-[10px] font-bold uppercase tracking-widest">Brasília, Brasil</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5">
          <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">
            Precision & Passion in Esports
          </p>
          <div className="flex items-center gap-2 text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">
            Developed with <Heart size={10} className="text-white/40" /> by Manus
          </div>
        </div>
      </div>
    </footer>
  );
}
