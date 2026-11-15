import React from 'react';

interface SantaHatProps {
  className?: string;
  animate?: boolean;
}

export const SantaHat: React.FC<SantaHatProps> = ({ 
  className = "w-16 h-16 sm:w-20 sm:h-20", 
  animate = true 
}) => {
  return (
    <div 
      className={`relative inline-block pointer-events-none select-none ${className} ${
        animate ? 'santa-hat-sway' : 'rotate-[11deg]'
      }`}
      aria-hidden="true"
    >
      <style>{`
        @keyframes santaHatSway {
          0%, 100% {
            transform: rotate(10deg) translateY(0px) scale(1);
          }
          50% {
            transform: rotate(14deg) translateY(-2px) scale(1.02);
          }
        }
        .santa-hat-sway {
          animation: santaHatSway 4.5s ease-in-out infinite;
          transform-origin: 25% 85%;
        }
      `}</style>
      <svg
        viewBox="0 0 120 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_10px_16px_rgba(0,0,0,0.55)]"
      >
        <defs>
          {/* Rich velvet red gradient for the Santa hat */}
          <linearGradient id="santaRedGrad" x1="20" y1="10" x2="95" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="20%" stopColor="#EF4444" />
            <stop offset="55%" stopColor="#DC2626" />
            <stop offset="85%" stopColor="#991B1B" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </linearGradient>

          {/* Shading inside the fold curve */}
          <linearGradient id="santaFoldGrad" x1="45" y1="15" x2="85" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#991B1B" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#450A0A" stopOpacity="0.4" />
          </linearGradient>

          {/* Brim rim gradient for soft fur texture */}
          <linearGradient id="furGrad" x1="20" y1="55" x2="85" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          {/* Soft drop shadow */}
          <filter id="softShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Droop / Tail underneath shadow */}
        <path
          d="M 72 26 C 84 32, 96 46, 94 62 C 92 70, 85 75, 80 72 C 77 70, 81 60, 85 52 C 88 44, 82 34, 72 26 Z"
          fill="#5B0E0E"
          opacity="0.6"
        />

        {/* Main Cone/Hat Velvet Body curving to the right */}
        <path
          d="M 23 64 C 27 40, 42 14, 57 11 C 72 8, 93 24, 96 45 C 98 58, 92 70, 85 71 C 80 72, 78 64, 82 54 C 86 42, 76 25, 62 23 C 50 21, 37 42, 34 63 Z"
          fill="url(#santaRedGrad)"
          filter="url(#softShadow)"
        />

        {/* Fold Highlight / Dimension overlay */}
        <path
          d="M 54 13 C 65 20, 84 32, 88 50 C 85 44, 76 34, 64 28 C 55 24, 51 17, 54 13 Z"
          fill="url(#santaFoldGrad)"
        />

        {/* Velvet sheen/specular arc */}
        <path
          d="M 33 50 C 36 34, 46 18, 55 14 C 54 17, 43 32, 40 50 Z"
          fill="#FFA39E"
          opacity="0.35"
        />

        {/* Fluffy Brim (Pillowy cloud-like fur band across bottom) */}
        <g filter="url(#softShadow)">
          {/* Foundation pillowy band */}
          <path
            d="M 18 64 C 18 56, 28 54, 38 55 C 48 56, 58 54, 68 55 C 78 56, 88 60, 86 68 C 84 76, 75 78, 65 77 C 54 76, 42 78, 32 77 C 22 76, 18 72, 18 64 Z"
            fill="url(#furGrad)"
          />
          {/* Cloud puffs giving tactile fluffy fur effect */}
          <circle cx="21" cy="65" r="7.5" fill="#FFFFFF" />
          <circle cx="31" cy="64.5" r="8" fill="#F8FAFC" />
          <circle cx="43" cy="63.5" r="8.5" fill="#FFFFFF" />
          <circle cx="55" cy="64" r="8" fill="#F1F5F9" />
          <circle cx="67" cy="64.5" r="8" fill="#FFFFFF" />
          <circle cx="78" cy="66" r="7.5" fill="#E2E8F0" />
          <circle cx="85" cy="67.5" r="6" fill="#CBD5E1" />

          {/* Lower puff row */}
          <circle cx="26" cy="68" r="6.5" fill="#F8FAFC" />
          <circle cx="37" cy="68.5" r="7" fill="#FFFFFF" />
          <circle cx="49" cy="68" r="7.5" fill="#F1F5F9" />
          <circle cx="61" cy="68.5" r="7" fill="#FFFFFF" />
          <circle cx="73" cy="69" r="6.5" fill="#E2E8F0" />
        </g>

        {/* Fluffy White Pom-Pom dangling on right side */}
        <g filter="url(#softShadow)">
          <circle cx="87" cy="74" r="10" fill="#CBD5E1" />
          <circle cx="86" cy="73" r="9" fill="#E2E8F0" />
          <circle cx="85" cy="72" r="8" fill="#FFFFFF" />
          <circle cx="82" cy="70" r="5" fill="#FFFFFF" />
          <circle cx="88" cy="75" r="5.5" fill="#F1F5F9" />
          <circle cx="84" cy="76" r="4.5" fill="#E2E8F0" />
          <circle cx="87" cy="70" r="4" fill="#FFFFFF" />
        </g>

        {/* Subtle festive sparkle near pom-pom */}
        <polygon 
          points="98,64 100,67 103,67 100.5,69 101.5,72 98,70 94.5,72 95.5,69 93,67 96,67" 
          fill="#FDE047" 
          opacity="0.85" 
        />
      </svg>
    </div>
  );
};

export default SantaHat;
