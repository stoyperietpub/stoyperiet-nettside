
import React, { useState, useEffect, useRef } from 'react';

const MenuCircle: React.FC = () => {
  const [isOverDark, setIsOverDark] = useState(false);
  const circleRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!circleRef.current) return;
      const rect = circleRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      // Sjekkar kva element som er under sirkelen for å tilpasse fargekontrast
      const elementUnder = document.elementFromPoint(x, y);
      if (elementUnder) {
        const darkParent = elementUnder.closest('[data-is-dark="true"]');
        setIsOverDark(!!darkParent);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('meny');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const textColor = isOverDark ? 'fill-[#C46E52]' : 'fill-[#2D2D2D]';
  const centerBg = isOverDark ? 'bg-[#C9BBAF]' : 'bg-[#C46E52]';
  const centerIconColor = isOverDark ? 'text-[#2D2D2D]' : 'text-white';

  return (
    <div className="fixed bottom-6 right-6 md:bottom-12 md:right-12 z-50 pointer-events-none">
      <a 
        ref={circleRef}
        href="#meny" 
        onClick={handleClick}
        className="group pointer-events-auto flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95"
      >
        <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
          {/* Dynamisk skygge/offset-print effekt */}
          <div className="absolute inset-0 rounded-full bg-[#1A1A1A] opacity-10 translate-x-1 translate-y-1 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform"></div>

          {/* Roterande tekst-sti */}
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full animate-[spin_20s_linear_infinite]"
          >
            <defs>
              <path id="circlePath" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
            </defs>
            <text 
              className={`font-mono text-[7px] uppercase font-black transition-colors duration-500 ${textColor}`}
              style={{ letterSpacing: '0.4em' }}
            >
              <textPath xlinkHref="#circlePath" startOffset="0%">
                DRIKK_MENY • LOKAL_SNACKS • INDUSTRI_KULTUR • 
              </textPath>
            </text>
          </svg>

          {/* Senter-knapp */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-10 h-10 md:w-14 md:h-14 ${centerBg} rounded-full border-2 border-[#1A1A1A] flex items-center justify-center transition-all duration-500 shadow-2xl relative overflow-hidden group-hover:rotate-12`}>
              <span className={`${centerIconColor} font-heading text-xl md:text-2xl mt-0.5 select-none relative z-10`}>M</span>
              {/* Halftone overlay på knappen */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(black 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default MenuCircle;
