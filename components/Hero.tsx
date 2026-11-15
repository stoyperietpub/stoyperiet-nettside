
import React from 'react';
import Logo from './Logo';
import { useSeason } from '../seasonConfig';

const Hero: React.FC = () => {
  const { isChristmas } = useSeason();
  const scrollToContent = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('meny')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="heim" className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 overflow-hidden">
      {/* Sentrert Grid og Tekniske Elementer */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] select-none flex items-center justify-center">
        {/* Vertikal og horisontal senterlinje */}
        <div className="absolute top-0 left-1/2 w-px h-full bg-black"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-black"></div>
        
        {/* Symmetriske sirklar */}
        <div className="w-[600px] h-[600px] border border-black rounded-full"></div>
        <div className="absolute w-[300px] h-[300px] border border-black rounded-full"></div>
        
        {/* Hjørne-koordinatar (Symmetrisk plassert) */}
        <div className="absolute top-24 left-12 font-mono text-[9px] rotate-[-90deg] origin-left uppercase tracking-widest">LAT_59.8583_N</div>
        <div className="absolute top-24 right-12 font-mono text-[9px] rotate-[90deg] origin-right uppercase tracking-widest">LNG_5.7514_E</div>
      </div>

      <div className="w-full max-w-6xl flex flex-col items-center text-center relative z-10">
        {/* Sentralt Label */}
        <div className="mb-8 flex flex-col items-center">
          <div className="font-mono text-[10px] md:text-xs uppercase tracking-[0.8em] text-[#C46E52] font-bold mb-4">
            PROSJEKT: STØYPERIET
          </div>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#C46E52] to-transparent"></div>
        </div>

        {/* Logo - Symmetrisk lagdeling (offset er balansert) */}
        <div className="relative w-full max-w-4xl mb-8">
          {/* Symmetrisk offset: Rust til venstre, stål til høgre */}
          <div className="absolute top-0 left-[-2px] w-full h-full text-[#C46E52] opacity-20 mix-blend-multiply pointer-events-none">
            <Logo />
          </div>
          <div className="absolute top-0 left-[2px] w-full h-full text-[#8C949D] opacity-20 mix-blend-multiply pointer-events-none">
            <Logo />
          </div>
          <Logo className="relative z-10 w-full h-auto text-[#1A1A1A]" />
        </div>

        {/* Tagline */}
        <div className="relative flex flex-col items-center mb-12">
          <h1 className="font-mono text-2xl md:text-5xl lg:text-6xl text-[#1A1A1A] tracking-tighter leading-[0.85] font-bold uppercase">
            EIN FOLKEPUB<br />
            <span className="text-[#C46E52] riso-text block mt-2" data-text="PÅ HUSNES">PÅ HUSNES</span>
          </h1>
        </div>

        {/* Stillingsutlysing Callout Banner */}
        <div className="mb-8 w-full max-w-xl">
          <a 
            href="#stilling"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('stilling')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group block border-2 border-[#1A1A1A] bg-[#C46E52] text-white p-3.5 sm:p-4 text-left transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_#1A1A1A] shadow-[4px_4px_0px_#1A1A1A] cursor-pointer"
            title="Gå til stillingsutlysing for dagleg leiar"
          >
            <div className="flex items-center justify-between gap-3 font-mono">
              <div className="flex items-center gap-2">
                <span className="bg-[#1A1A1A] text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 uppercase tracking-wider">
                  LEDIG STILLING
                </span>
                <span className="text-[11px] sm:text-xs text-[#F4EBD9] font-bold uppercase tracking-wider">
                  Frist: 25. nov
                </span>
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>LES MEIR</span>
                <span>→</span>
              </span>
            </div>
            <div className="mt-2 font-heading text-xl sm:text-2xl text-black uppercase tracking-tight leading-snug">
              Støyperiet søkjer dagleg leiar (20 %)
            </div>
            <div className="mt-1 font-mono text-xs text-[#F4EBD9]/90 italic">
              «Ansvarleg på papiret. Støttespelar i praksis.»
            </div>
          </a>
        </div>

        {/* Sentrert Action Button */}
        <div className="relative">
          <a 
            href="#meny"
            onClick={scrollToContent}
            className="group relative inline-flex items-center justify-center px-8 py-4 md:px-12 md:py-5 bg-[#1A1A1A] text-white font-mono text-lg md:text-2xl transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 tracking-tight">SJEKK UT DRIKKEMENYEN</span>
            
            {/* Balansert Print Offset (bak knappen) */}
            <div className="absolute inset-0 translate-y-2 w-full h-full border border-[#C46E52] opacity-40 -z-10 group-hover:translate-y-4 transition-transform"></div>
          </a>
        </div>

        {/* Opningstider & Aldersgrense - synleg på mobil og tablet, skjult på desktop der det står i header */}
        <div className="lg:hidden mt-10 sm:mt-12 w-full max-w-lg border-2 border-[#1A1A1A] bg-[#D9D2C9]/90 backdrop-blur-sm p-4 sm:p-5 shadow-lg text-center font-mono relative z-10">
          <div className="flex items-center justify-center gap-2 mb-2 text-[10px] sm:text-xs text-[#C46E52] font-bold tracking-[0.25em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C46E52]"></span>
            <span>FASTE OPNINGSTIDER</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C46E52]"></span>
          </div>
          <div className="text-base sm:text-lg font-bold text-[#1A1A1A] tracking-tight uppercase leading-snug">
            <span>ONS & SØN: 12:00—22:00</span>
            <span className="hidden sm:inline"> &nbsp;•&nbsp; </span>
            <br className="sm:hidden" />
            <span>FRE & LAUR: 12:00—00:00</span>
          </div>
          
          <div className="mt-3 pt-3 border-t border-black/15 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2">
            <span className="inline-flex items-center gap-1.5 bg-[#C46E52] text-white text-[11px] sm:text-xs font-bold px-2.5 py-1 uppercase tracking-wider shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              20+ ETTER KL. 19:00
            </span>
            <span className="text-[11px] sm:text-xs text-[#1A1A1A]/75 font-semibold">
              (Alle aldrar velkomne før kl. 19:00)
            </span>
          </div>

          {isChristmas && (
            <div className="mt-3 pt-3 border-t border-black/15">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('stoyperiet-open-christmas-hours'))}
                className="w-full py-2.5 px-3 bg-[#C46E52] hover:bg-[#A85339] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>📅</span>
                <span>SJÅ OPNINGSTIDER I JULA</span>
                <span>→</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Symmetriske fot-merknader */}
      <div className="absolute bottom-12 w-full max-w-5xl flex justify-between px-12 opacity-30 pointer-events-none font-mono text-[9px] uppercase tracking-widest">
        <div className="flex items-center gap-4">
          <span className="font-bold">109_VOL</span>
          <div className="w-8 h-px bg-black"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-px bg-black"></div>
          <span className="font-bold">EST_2026</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
