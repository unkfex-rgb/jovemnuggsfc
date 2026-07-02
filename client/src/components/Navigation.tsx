import { useEffect, useState } from 'react';

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('sobre');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ['sobre'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-300 flex items-center justify-between px-6 py-3.5 transition-all duration-250 ${scrolled ? 'bg-black/55 backdrop-blur-lg border-b border-white/9' : 'bg-gradient-to-r from-green-500/10 via-cyan-500/10 to-blue-500/10 backdrop-blur-sm'}`}>
      <div className="flex items-center gap-2.5">
        <div className="w-7.5 h-7.5 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center text-xs font-bold text-black drop-shadow-lg">JN</div>
        <span className="hidden sm:inline font-orbitron font-800 text-xs tracking-widest">JOVEM NUGGS FC</span>
      </div>
      <div className="hidden md:flex gap-1 items-center">
        {[
          { id: 'sobre', label: 'Sobre' },
        ].map((item) => (
          <button key={item.id} onClick={() => scrollToSection(item.id)} className={`text-xs font-600 tracking-widest uppercase px-3 py-2 rounded-full transition-all duration-200 ${activeSection === item.id ? 'text-white bg-white/7' : 'text-gray-500 hover:text-white'}`}>
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
