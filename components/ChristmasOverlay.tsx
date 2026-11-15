import React, { useState, useEffect, useMemo } from 'react';
import { useSeason } from '../seasonConfig';
import ChristmasHoursTable from './ChristmasHoursTable';

/**
 * Autentisk julelyslenke, snøfall og juleopningstider for Støyperiet Pub.
 * 
 * Klassiske vintage C7/C9 julelyspærer (dråpefasong), naturtru granbargirlander
 * med bær og roleg funkling. Pynten er rein visuell atmosfære (ikkje-interaktiv),
 * med ein fast knapp nede til høgre: "Opningstider i jula".
 */

interface BulbData {
  id: number;
  x: number; // pikslar
  y: number; // pikslar
  tilt: number; // rotasjonsvinkel i grader
  colorIndex: number;
  delay: number; // animasjonsvippe-delay
  duration: number; // syklustid for funkling
  scale: number;
}

export const ChristmasOverlay: React.FC = () => {
  const { isChristmas, isPreview, togglePreview } = useSeason();
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  // Følg med på vindaugsbreidda for perfekt tilpassa lyslenke
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lytt etter global opne-hending frå andre knappar eller snarvegar
  useEffect(() => {
    const handleOpenHours = () => setShowHoursModal(true);
    window.addEventListener('stoyperiet-open-christmas-hours', handleOpenHours);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowHoursModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('stoyperiet-open-christmas-hours', handleOpenHours);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Klassiske nostalgiske julefargar
  const palette = [
    { name: 'Rubinraud', glass: '#DC2626', core: '#F87171', glow: '#EF4444', halo: 'rgba(239, 68, 68, 0.45)' },
    { name: 'Edelgran', glass: '#15803D', core: '#4ADE80', glow: '#22C55E', halo: 'rgba(34, 197, 94, 0.45)' },
    { name: 'Gyllengull', glass: '#D97706', core: '#FDE047', glow: '#F59E0B', halo: 'rgba(245, 158, 11, 0.5)' },
    { name: 'Vinterblå', glass: '#0284C7', core: '#7DD3FC', glow: '#38BDF8', halo: 'rgba(56, 189, 248, 0.45)' },
    { name: 'Kandelys', glass: '#EAB308', core: '#FEF08A', glow: '#FACC15', halo: 'rgba(250, 204, 21, 0.5)' },
    { name: 'Gløgg-bær', glass: '#BE123C', core: '#FB7185', glow: '#F43F5E', halo: 'rgba(244, 63, 94, 0.45)' },
  ];

  // Rekn ut boger (swags) og pæreplassering basert på breidda
  const garlandData = useMemo(() => {
    const targetSwagWidth = windowWidth < 640 ? 100 : 140;
    const numSwags = Math.max(3, Math.ceil(windowWidth / targetSwagWidth));
    const swagWidth = windowWidth / numSwags;
    const sagDepth = windowWidth < 640 ? 22 : 28;

    const swags: { x1: number; x2: number; cx: number; cy: number; path: string }[] = [];
    const bulbs: BulbData[] = [];
    let bulbIndex = 0;

    for (let i = 0; i < numSwags; i++) {
      const x1 = i * swagWidth;
      const x2 = (i + 1) * swagWidth;
      const cx = (x1 + x2) / 2;
      const cy = sagDepth;

      const path = `M ${x1} 0 Q ${cx} ${cy * 1.5} ${x2} 0`;
      swags.push({ x1, x2, cx, cy, path });

      const bulbsPerSwag = windowWidth < 640 ? 2 : 3;
      const tStep = 1 / (bulbsPerSwag + 1);

      for (let j = 1; j <= bulbsPerSwag; j++) {
        const t = j * tStep;
        const bx = Math.round((1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2);
        const by = Math.round((1 - t) * (1 - t) * 0 + 2 * (1 - t) * t * (cy * 1.5) + t * t * 0);
        
        const dx = 2 * (1 - t) * (cx - x1) + 2 * t * (x2 - cx);
        const dy = 2 * (1 - t) * (cy * 1.5 - 0) + 2 * t * (0 - cy * 1.5);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const tilt = Math.max(-18, Math.min(18, angle * 0.35));

        bulbs.push({
          id: bulbIndex,
          x: bx,
          y: by,
          tilt: Number(tilt.toFixed(1)),
          colorIndex: bulbIndex % palette.length,
          delay: Number(((bulbIndex * 0.37) % 3.2).toFixed(2)),
          duration: Number((2.4 + ((bulbIndex * 0.53) % 1.8)).toFixed(2)),
          scale: windowWidth < 640 ? 0.85 : 1,
        });

        bulbIndex++;
      }
    }

    return { swags, bulbs, sagDepth };
  }, [windowWidth, palette.length]);

  if (!isChristmas) {
    return null;
  }

  return (
    <>
      {/* 1. JULELYSLENKE (z-[80] - ligg bak header og er rein atmosfære utan å blokkere klikk) */}
      <div 
        className="fixed top-0 left-0 right-0 z-[80] pointer-events-none select-none h-20 sm:h-24 overflow-visible"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-[#0a1a0f]/60 via-[#0a1a0f]/20 to-transparent"></div>

        <svg
          className="w-full h-full overflow-visible"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}
        >
          <defs>
            <linearGradient id="stoyperietSocketGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1C1917" />
              <stop offset="35%" stopColor="#44403C" />
              <stop offset="70%" stopColor="#292524" />
              <stop offset="100%" stopColor="#0C0A09" />
            </linearGradient>

            <linearGradient id="stoyperietBrassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#78350F" />
              <stop offset="50%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>

            <linearGradient id="glassGlossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>

            {palette.map((col, idx) => (
              <radialGradient
                key={idx}
                id={`bulbGrad_${idx}`}
                cx="35%"
                cy="30%"
                r="70%"
                fx="35%"
                fy="30%"
              >
                <stop offset="0%" stopColor={col.core} />
                <stop offset="45%" stopColor={col.glow} />
                <stop offset="85%" stopColor={col.glass} />
                <stop offset="100%" stopColor="#0f0f0f" stopOpacity="0.8" />
              </radialGradient>
            ))}
          </defs>

          {garlandData.swags.map((swag, i) => {
            const midX = (swag.x1 + swag.x2) / 2;
            const midY = swag.cy * 1.5;

            return (
              <g key={`swag_${i}`}>
                {/* Granbar-bakgrunn */}
                <path
                  d={swag.path}
                  fill="none"
                  stroke="#143319"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray="3, 4"
                  opacity="0.8"
                />

                {/* Granbar-detaljar */}
                <path
                  d={swag.path}
                  fill="none"
                  stroke="#23532B"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="2, 5"
                  opacity="0.95"
                />

                {/* Snoa kabel */}
                <path
                  d={swag.path}
                  fill="none"
                  stroke="#0C1F10"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d={swag.path}
                  fill="none"
                  stroke="#B45309"
                  strokeWidth="0.8"
                  strokeDasharray="6, 8"
                  opacity="0.75"
                />

                {/* Kristtornbær ved festepunkt */}
                <g transform={`translate(${swag.x1}, 0)`}>
                  <line x1="-8" y1="2" x2="6" y2="7" stroke="#1A4324" strokeWidth="2" strokeLinecap="round" />
                  <line x1="8" y1="2" x2="-6" y2="7" stroke="#2D633B" strokeWidth="2" strokeLinecap="round" />
                  <line x1="-4" y1="-2" x2="4" y2="8" stroke="#143319" strokeWidth="2.2" strokeLinecap="round" />
                  <circle cx="-3" cy="5" r="2.8" fill="#DC2626" />
                  <circle cx="3" cy="6" r="2.6" fill="#B91C1C" />
                  <circle cx="0" cy="9" r="2.4" fill="#EF4444" />
                  <circle cx="-3.6" cy="4.2" r="0.7" fill="#ffffff" opacity="0.8" />
                  <circle cx="2.4" cy="5.2" r="0.6" fill="#ffffff" opacity="0.8" />
                </g>

                {/* Ekstra bærklynge på midten */}
                <g transform={`translate(${midX}, ${midY * 0.92})`}>
                  <circle cx="-2" cy="0" r="2.2" fill="#E11D48" />
                  <circle cx="2.5" cy="1" r="2" fill="#BE123C" />
                  <circle cx="-2.6" cy="-0.6" r="0.5" fill="#ffffff" opacity="0.7" />
                </g>
              </g>
            );
          })}

          {garlandData.swags.length > 0 && (
            <g transform={`translate(${windowWidth}, 0)`}>
              <line x1="-8" y1="2" x2="6" y2="7" stroke="#1A4324" strokeWidth="2" strokeLinecap="round" />
              <circle cx="-3" cy="5" r="2.6" fill="#DC2626" />
              <circle cx="0" cy="8" r="2.3" fill="#EF4444" />
            </g>
          )}

          {/* Julelyspærene med sokkel og levande kveldsglød */}
          {garlandData.bulbs.map((bulb) => {
            const col = palette[bulb.colorIndex];

            return (
              <g
                key={bulb.id}
                transform={`translate(${bulb.x}, ${bulb.y}) rotate(${bulb.tilt}) scale(${bulb.scale})`}
                className="pointer-events-none select-none"
                style={{ transformOrigin: '0px 0px' }}
              >
                {/* Atmosfærisk lyshalo */}
                <ellipse
                  cx="0"
                  cy="20"
                  rx="26"
                  ry="24"
                  fill={col.halo}
                  style={{
                    filter: 'blur(10px)',
                    animation: `stoyperietHaloPulse ${bulb.duration}s ease-in-out infinite alternate`,
                    animationDelay: `${bulb.delay}s`,
                  }}
                />

                {/* Hengewire */}
                <line x1="0" y1="-1" x2="0" y2="5" stroke="#16291C" strokeWidth="2" strokeLinecap="round" />

                {/* Fatning */}
                <g transform="translate(-5, 4)">
                  <rect x="0" y="0" width="10" height="7" rx="1.5" fill="url(#stoyperietSocketGrad)" />
                  <rect x="1" y="5.5" width="8" height="2.2" rx="0.5" fill="url(#stoyperietBrassGrad)" />
                  <line x1="1" y1="2" x2="9" y2="2" stroke="#57534E" strokeWidth="0.8" opacity="0.8" />
                  <line x1="1" y1="4" x2="9" y2="4" stroke="#0C0A09" strokeWidth="0.8" opacity="0.9" />
                </g>

                {/* Glaspære C7/C9 */}
                <g 
                  transform="translate(0, 11)"
                  style={{
                    animation: `stoyperietBulbTwinkle ${bulb.duration}s ease-in-out infinite alternate`,
                    animationDelay: `${bulb.delay}s`,
                  }}
                >
                  <path
                    d="M -7 0 
                       C -9 4, -11 11, -9 18 
                       C -7 24, -3 29, 0 33 
                       C 3 29, 7 24, 9 18 
                       C 11 11, 9 4, 7 0 
                       Z"
                    fill={`url(#bulbGrad_${bulb.colorIndex})`}
                    stroke={col.core}
                    strokeWidth="0.6"
                    style={{
                      filter: `drop-shadow(0 0 6px ${col.glow}) drop-shadow(0 0 14px ${col.glow}88)`,
                    }}
                  />

                  {/* Filament */}
                  <path
                    d="M -2.5 5 Q 0 14 -2 18 Q 0 15 2 18 Q 0 14 2.5 5"
                    fill="none"
                    stroke="#FFFFEE"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    opacity="0.95"
                    style={{ filter: 'drop-shadow(0 0 3px #FFFFFF)' }}
                  />

                  <circle
                    cx="0"
                    cy="14"
                    r="3.5"
                    fill="#FFFFFF"
                    opacity="0.75"
                    style={{ filter: 'blur(1.2px)' }}
                  />

                  {/* Glasrefleksjon */}
                  <path
                    d="M -5.5 4 C -7.5 9, -7.5 16, -5 22"
                    fill="none"
                    stroke="url(#glassGlossGrad)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                  
                  <circle cx="1" cy="30" r="0.9" fill="#FFFFFF" opacity="0.6" />
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 2. ROLIG, NESTEN USYNLIG VINTERSNØ-DRYSS */}
      <div 
        className="fixed inset-0 pointer-events-none z-[45] overflow-hidden select-none" 
        aria-hidden="true"
      >
        {Array.from({ length: 24 }).map((_, i) => {
          const left = (i * 4.1 + (i % 7) * 1.5).toFixed(1);
          // Ekstra roleg fall: 24 til 42 sekund
          const duration = (24 + (i % 7) * 3).toFixed(1);
          const delay = ((i % 13) * 1.8).toFixed(1);
          // Ekstremt små, mjuke korn (1.2px til 2.4px)
          const size = (1.2 + (i % 4) * 0.4).toFixed(1);
          // Svært svak gjennomsiktigheit slik at det nesten ikkje syner (0.08 til 0.18)
          const opacity = (0.08 + (i % 3) * 0.05).toFixed(2);

          return (
            <div
              key={i}
              className="absolute rounded-full bg-white blur-[0.6px]"
              style={{
                left: `${left}%`,
                top: '-20px',
                width: `${size}px`,
                height: `${size}px`,
                opacity: opacity,
                animation: `stoyperietSnow ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>

      {/* 3. ENKEL FAST KNAPP NEDE TIL HØGRE: "Opningstider i jula" */}
      <div className="fixed bottom-5 right-5 z-[120] hidden lg:flex flex-col items-end gap-2 pointer-events-auto">
        {isPreview && (
          <button
            onClick={() => togglePreview(false)}
            className="bg-[#1C1C1C]/90 hover:bg-[#C46E52] text-[#F4EBD9] px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider border border-stone-700/80 shadow-lg transition-colors cursor-pointer rounded-xs"
            title="Avslutt førehandsvising av jul"
          >
            ✕ Avslutt test
          </button>
        )}

        <button
          onClick={() => setShowHoursModal(true)}
          className="bg-[#C46E52] hover:bg-[#A85339] text-white px-5 py-3 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider shadow-2xl border-2 border-[#1A1A1A] transition-all active:scale-95 flex items-center gap-2.5 cursor-pointer rounded-none group"
          title="Sjå opningstider i jula"
        >
          <span aria-hidden="true" className="text-sm">📅</span>
          <span>Opningstider i jula</span>
        </button>
      </div>

      {/* 4. JULEOPNINGSTIDER MODAL OVERLAY */}
      {showHoursModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="christmas-hours-title"
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowHoursModal(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#D9D2C9] border-2 border-[#1A1A1A] p-6 sm:p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lukkeknapp */}
            <button
              onClick={() => setShowHoursModal(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 border border-[#1A1A1A] bg-[#1A1A1A] text-white hover:bg-[#C46E52] hover:border-[#C46E52] transition-colors flex items-center justify-center font-mono text-sm font-bold cursor-pointer shadow-md"
              title="Lukk opningstider"
            >
              ✕
            </button>

            {/* Selve tabellen (tro kopi av biletet) */}
            <ChristmasHoursTable />

            {/* Aldersgrense og ordinære opningstider */}
            <div className="mt-8 pt-4 border-t border-[#1A1A1A]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] font-mono text-[#1A1A1A]/75 uppercase">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C46E52]"></span>
                20+ etter kl. 19:00 på opningskveldar
              </span>
              <span>Vanlege opningstider startar att onsdag 6. januar</span>
            </div>
          </div>
        </div>
      )}

      {/* CSS-animasjonar */}
      <style>{`
        @keyframes stoyperietBulbTwinkle {
          0% {
            opacity: 0.75;
            filter: brightness(0.92);
            transform: scale(0.98);
          }
          40% {
            opacity: 1;
            filter: brightness(1.2);
            transform: scale(1.02);
          }
          70% {
            opacity: 0.85;
            filter: brightness(0.96);
            transform: scale(0.99);
          }
          100% {
            opacity: 0.95;
            filter: brightness(1.15);
            transform: scale(1.01);
          }
        }

        @keyframes stoyperietHaloPulse {
          0% {
            opacity: 0.45;
            transform: scale(0.9);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.12);
          }
          100% {
            opacity: 0.55;
            transform: scale(0.95);
          }
        }

        @keyframes stoyperietSnow {
          0% {
            transform: translateY(0vh) translateX(0px);
          }
          50% {
            transform: translateY(50vh) translateX(8px);
          }
          100% {
            transform: translateY(105vh) translateX(-6px);
          }
        }
      `}</style>
    </>
  );
};

export default ChristmasOverlay;
