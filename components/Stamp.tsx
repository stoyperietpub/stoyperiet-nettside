
import React from 'react';

interface StampProps {
  text: string;
  color: 'rust' | 'steel' | 'charcoal';
}

const Stamp: React.FC<StampProps> = ({ text, color }) => {
  const colors = {
    rust: 'bg-[#C46E52] text-white border-white',
    steel: 'bg-[#BCC2C7] text-[#2D2D2D] border-[#2D2D2D]',
    charcoal: 'bg-[#2D2D2D] text-white border-[#C46E52]',
  };

  return (
    <div className={`inline-block px-6 py-2 md:px-8 md:py-3 border-4 font-heading uppercase text-2xl md:text-4xl tracking-tighter shadow-[5px_5px_0px_rgba(0,0,0,0.1)] italic transition-transform hover:scale-110 hover:-rotate-3 cursor-default relative overflow-hidden ${colors[color]}`}>
      <div className="relative z-10">
        {text}
      </div>
      {/* Ink Bleed Texture */}
      <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
      {/* Subtle halftone on the stamp */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 0)', backgroundSize: '3px 3px' }}></div>
    </div>
  );
};

export default Stamp;
