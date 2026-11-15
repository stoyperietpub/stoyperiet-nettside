
import React from 'react';

interface MarqueeProps {
  text: string;
  reverse?: boolean;
  /** Julemodus: annakvar frase i julerau, resten i sand */
  christmas?: boolean;
}

const Marquee: React.FC<MarqueeProps> = ({ text, reverse = false, christmas = false }) => {
  return (
    <div 
      data-is-dark="true"
      className="bg-[#2D2D2D] py-5 overflow-hidden whitespace-nowrap border-y-2 border-[#C46E52] relative"
    >
      {/* Halftone texture overlay on marquee strip */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 0.5px, transparent 0.5px)', backgroundSize: '4px 4px' }}></div>
      
      <div className={`inline-block animate-marquee ${reverse ? 'animate-marquee-reverse' : ''}`}>
        {[...Array(15)].map((_, i) =>
          christmas ? (
            <span key={i} className="font-heading uppercase text-2xl md:text-4xl tracking-tight px-8 opacity-95">
              {text.split('•').map((part) => part.trim()).filter(Boolean).map((part, j) => (
                <React.Fragment key={j}>
                  <span className={j % 2 === 0 ? 'text-[#E0453B]' : 'text-[#E9DFD1]'}>{part}</span>
                  <span className="text-[#C46E52] px-4">•</span>
                </React.Fragment>
              ))}
            </span>
          ) : (
            <span key={i} className={`font-heading uppercase text-2xl md:text-4xl tracking-tight px-8 ${i % 2 === 0 ? 'text-[#C46E52]' : 'text-[#BCC2C7]'} opacity-90`}>
              {text}
            </span>
          )
        )}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-33.33%); }
          100% { transform: translateX(0); }
        }
        /* Saktare fart: Justert frå 30s til 80s */
        .animate-marquee { animation: marquee 80s linear infinite; }
        .animate-marquee-reverse { animation: marquee-reverse 80s linear infinite; }
      `}</style>
    </div>
  );
};

export default Marquee;
