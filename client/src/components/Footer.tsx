import { Instagram, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black/50 backdrop-blur-md">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-black">
                JN
              </div>
              <span className="text-white font-bold">JOVEM NUGGS</span>
            </div>
            <p className="text-white/60 text-sm">Elite Squad • Professional Gaming</p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Comunidade</h3>
            <div className="flex flex-col gap-2">
              <a
                href="https://discord.gg/kz5esRFec"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm"
              >
                <MessageCircle size={16} /> Discord
              </a>
              <a
                href="https://www.instagram.com/jovemnuggs.ofc/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm"
              >
                <Instagram size={16} /> Instagram
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Informações</h3>
            <p className="text-white/60 text-sm">
              © 2026 Jovem Nuggs FC. Todos os direitos reservados.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-white/40 text-sm">
          <p>Desenvolvido com precisão e paixão pelo esports</p>
        </div>
      </div>
    </footer>
  );
}
