
import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  const menuItems = [
    { name: 'HEIM', id: 'heim' },
    { name: 'LEDIG STILLING (20 %)', id: 'stilling', badge: 'NY' },
    { name: 'DUGNADEN', id: 'dugnad' },
    { name: 'DRIKKE', id: 'meny' },
    { name: 'PROGRAM & KALENDER', id: 'program' },
    { name: 'KVISSLIGA', id: 'quiz' },
    { name: 'KONTAKT', id: 'kontakt' }
  ];

  const socialLinks = [
    { 
      name: 'FACEBOOK', 
      url: 'https://www.facebook.com/profile.php?id=61588258673482', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
        </svg>
      )
    },
    { 
      name: 'INSTAGRAM', 
      url: 'https://www.instagram.com/stoyperietpub/', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4.162 4.162 0 110-8.324A4.162 4.162 0 0112 16zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      )
    }
  ];

  const scrollTo = (id: string) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-6 py-4 md:px-12 md:py-8 flex justify-between items-center ${scrolled ? 'bg-[#D9D2C9]/90 backdrop-blur-md py-4 border-b border-black/5' : ''}`}>
        {/* Venstre side - Navigasjon & Opningstider (Desktop) */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-4 bg-[#1A1A1A] text-white px-6 py-3.5 font-mono text-sm md:text-base group transition-all hover:bg-[#C46E52] active:scale-95 shadow-lg pointer-events-auto"
          >
            <div className="flex flex-col gap-1 w-5">
              <span className={`h-0.5 w-full bg-white transition-all ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`h-0.5 w-full bg-white transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
              <span className={`h-0.5 w-full bg-white transition-all ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
            <span className="tracking-tighter uppercase">{isOpen ? 'LUKK' : 'NAVIGASJON'}</span>
          </button>

          {/* Opningstider som rein tekst i header (Desktop & Tablet) */}
          <div className="hidden md:flex flex-col font-mono text-[10px] leading-tight border-l border-black/15 pl-4 lg:pl-6 bg-[#D9D2C9]/85 backdrop-blur-xs py-1 -my-1 rounded-xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#C46E52] font-bold uppercase tracking-widest">OPNINGSTIDER</span>
              <span className="bg-[#C46E52] text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
                20+ ETTER 19:00
              </span>
            </div>
            <div className="opacity-75 font-bold">
              ONS & SØN: 12:00—22:00<br />
              FRE & LAUR: 12:00—00:00
            </div>
          </div>
        </div>

        {/* Høgre side - Kontakt & Sosiale */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:flex items-center gap-2 mr-2">
            {socialLinks.map((link) => (
              <a 
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-[#1A1A1A] text-white hover:bg-[#C46E52] transition-colors shadow-lg"
                title={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
          <button 
            onClick={() => scrollTo('stilling')}
            className="hidden lg:flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#C46E52] text-white px-4 py-3.5 font-mono text-xs md:text-sm transition-all active:scale-95 shadow-lg pointer-events-auto uppercase tracking-wider border border-white/10 cursor-pointer"
            title="Støyperiet søkjer dagleg leiar (20 %)"
          >
            <span className="w-2 h-2 rounded-full bg-[#C46E52] animate-pulse"></span>
            <span>LEDIG STILLING</span>
          </button>
          <button 
            onClick={() => scrollTo('kontakt')}
            className="bg-[#C46E52] text-white px-6 py-3.5 font-mono text-sm md:text-base transition-all hover:bg-[#1A1A1A] active:scale-95 shadow-lg pointer-events-auto uppercase tracking-tighter cursor-pointer"
          >
            KONTAKT
          </button>
        </div>
      </header>

      {/* Fullskjerm Meny */}
      <div className={`fixed inset-0 bg-[#D9D2C9] z-[90] transition-all duration-700 ease-in-out flex flex-col items-center justify-start overflow-y-auto pt-32 pb-12 ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(black 2px, transparent 2px)', backgroundSize: '48px 48px' }}></div>
        
        <nav className="relative z-10 flex flex-col items-center gap-6 md:gap-8 w-full">
          {menuItems.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="group relative flex flex-col items-center py-2 px-6 w-full cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[10px] md:text-xs opacity-40">0{idx+1}</span>
                {item.badge && (
                  <span className="bg-[#C46E52] text-white font-mono text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="font-mono text-4xl md:text-7xl text-[#1A1A1A] transition-all group-hover:text-[#C46E52] group-hover:scale-105 block leading-none uppercase tracking-tighter font-bold text-center">
                {item.name}
              </span>
            </button>
          ))}

          {/* Sosiale medium i menyen */}
          <div className="mt-12 md:mt-16 flex flex-col items-center gap-8">
            {/* Opningstider & Aldersgrense i menyen */}
            <div className="flex flex-col items-center gap-2 p-5 bg-black/5 border-2 border-[#1A1A1A] max-w-sm w-full text-center">
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#C46E52] font-bold">OPNINGSTIDER</span>
              <div className="font-mono text-base md:text-xl text-[#1A1A1A] font-bold leading-tight uppercase">
                ONS & SØN: 12:00—22:00<br />
                FRE & LAUR: 12:00—00:00
              </div>
              <div className="mt-2 pt-2 border-t border-black/15 w-full flex flex-col items-center gap-1">
                <span className="inline-block bg-[#C46E52] text-white font-mono text-xs font-bold px-2.5 py-0.5 uppercase tracking-wider">
                  20+ ETTER KL. 19:00
                </span>
                <span className="font-mono text-[11px] text-[#1A1A1A]/70 uppercase tracking-wide">
                  Alle aldrar velkomne før kl. 19:00
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-40">FØLG_OSS</span>
              <div className="flex gap-12">
                {socialLinks.map((link) => (
                  <a 
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-3 font-mono text-xl md:text-2xl text-[#C46E52] hover:text-[#1A1A1A] transition-colors font-bold"
                  >
                    <span className="scale-150 mb-1">{link.icon}</span>
                    <span className="text-sm tracking-widest">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
