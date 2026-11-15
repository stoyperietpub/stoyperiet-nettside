
import React from 'react';

const DugnadSection: React.FC = () => {
  return (
    <section id="dugnad" className="relative bg-[#D9D2C9] py-32 md:py-64 px-6 overflow-hidden section-divider">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        
        <div className="space-y-12 order-2 lg:order-1">
          <div className="space-y-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#C46E52] font-bold">HISTORIA_VAR</span>
            <h2 className="font-heading text-6xl md:text-8xl leading-[0.85] text-[#1A1A1A]">
              KRAFT I <br/><span className="text-[#C46E52]">SAMHALD.</span>
            </h2>
          </div>
          
          <div className="max-w-xl space-y-8">
            <p className="text-xl md:text-2xl font-medium leading-relaxed text-[#1A1A1A]">
              Støyperiet er bygd opp av 109 eldsjeler frå Husnes og omegn, som har lagt ned mange dugnadstimar for å gje bygda vår ein møteplass.
            </p>
            
            <div className="grid grid-cols-2 gap-4 md:gap-8 border-t border-black/10 pt-10">
              <div>
                <div className="font-mono text-5xl md:text-7xl font-bold flex items-baseline gap-1">
                  109
                </div>
                <div className="font-mono text-[9px] md:text-[10px] uppercase opacity-40">ELDSJELER</div>
              </div>
              <div>
                <div className="font-mono text-5xl md:text-7xl text-[#C46E52] font-bold">2026</div>
                <div className="font-mono text-[9px] md:text-[10px] uppercase opacity-40">OPNA_DØRER</div>
              </div>
            </div>

            {/* Aksjonær / Medeigar interesse-knapp */}
            <div className="pt-6 space-y-3 border-t border-black/10">
              <p className="font-mono text-xs uppercase tracking-wider text-[#1A1A1A]/70 font-semibold">
                Ynskjer du å bli aksjonær eller medeigar i Støyperiet?
              </p>
              <div>
                <a 
                  href="https://ik.stoyperietpub.no/ShareApplicants/new" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 relative px-6 py-4 bg-[#1A1A1A] text-white font-mono font-bold text-lg md:text-xl uppercase italic overflow-hidden transition-all hover:-translate-y-1 shadow-[6px_6px_0px_#C46E52]"
                >
                  <span className="relative z-10">MELD DEG PÅ INTERESSELISTA</span>
                  <span className="relative z-10 text-[#C46E52] group-hover:text-white transition-colors">→</span>
                  <div className="absolute inset-0 bg-[#C46E52] overprint opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="relative order-1 lg:order-2">
          <div className="relative z-10 bg-[#1A1A1A] p-1 shadow-[24px_24px_0px_#C46E52]">
            <div className="aspect-[4/5] bg-[#8C949D] overflow-hidden relative">
              <img 
                src="https://lh3.googleusercontent.com/d/1_CHUW0JYdTqxCsh802q5pBqQ9Xcz3b3I" 
                alt="Støyperiet autentisk møteplass" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(black 1.5px, transparent 1.5px)', backgroundSize: '8px 8px' }}></div>
            </div>
          </div>
          <div className="absolute -bottom-8 -left-8 bg-[#C46E52] text-white px-6 py-3 font-mono text-[11px] rotate-[-2deg] z-20 shadow-xl uppercase">
            Autentisk_møteplass
          </div>
        </div>

      </div>
    </section>
  );
};

export default DugnadSection;
