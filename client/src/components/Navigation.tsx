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
    <nav className={`fixed top-0 left-0 right-0 z-300 flex items-center justify-between px-6 py-3.5 transition-all duration-250 ${scrolled ? 'bg-black/80 backdrop-blur-lg border-b border-cyan-400/30' : 'bg-black/40 backdrop-blur-sm border-b border-cyan-400/20'}`} style={{
      boxShadow: scrolled ? '0 0 20px rgba(0, 255, 255, 0.2)' : 'none'
    }}>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-black border border-cyan-400 flex items-center justify-center text-xs font-bold text-cyan-400 font-mono" style={{
          boxShadow: '0 0 10px rgba(0, 255, 255, 0.4)'
        }}>
          JN
        </div>
        <span className="hidden sm:inline font-orbitron font-800 text-xs tracking-widest text-white" style={{
          textShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
        }}>
          JOVEM NUGGS FC
        </span>
      </div>
      <div className="hidden md:flex gap-1 items-center">
        {[
          { id: 'sobre', label: 'Sobre' },
        ].map((item) => (
          <button 
            key={item.id} 
            onClick={() => scrollToSection(item.id)} 
            className={`text-xs font-600 tracking-widest uppercase px-4 py-2 transition-all duration-200 border ${activeSection === item.id ? 'border-cyan-400 text-cyan-400 bg-black/50' : 'border-transparent text-gray-400 hover:text-white hover:border-cyan-400/50'}`}
            style={activeSection === item.id ? {
              boxShadow: '0 0 10px rgba(0, 255, 255, 0.4)'
            } : {}}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
