
import React, { useState } from 'react';
import Logo from './Logo';
import { Copy, Check } from 'lucide-react';
import { useSeason } from '../seasonConfig';

const Footer: React.FC = () => {
  const email = "post@stoyperietpub.no";
  const eventEmail = "events@stoyperietpub.no";
  const [copiedType, setCopiedType] = useState<'main' | 'event' | null>(null);

  const copyToClipboard = (text: string, type: 'main' | 'event') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    });
  };

  const { isChristmas, isPreview, togglePreview } = useSeason();

  return (
    <footer id="kontakt" className="bg-[#1A1A1A] text-[#D9D2C9] pt-32 pb-12 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          
          <div className="lg:col-span-5 space-y-12">
            <div className="w-64">
              <Logo className="text-white opacity-90" />
            </div>
            <p className="font-mono text-[11px] uppercase tracking-widest leading-relaxed opacity-50 max-w-sm">
              STØYPERIET ER EIN DUGNADSBYGD PUB PÅ HUSNES.
            </p>
            
            {/* Prominent social buttons in footer with Icons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61588258673482" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 border-2 border-[#C46E52] text-[#C46E52] font-mono text-lg hover:bg-[#C46E52] hover:text-white transition-all group"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
                <span>FACEBOOK</span>
                <span className="font-mono text-xs opacity-50 group-hover:opacity-100">→</span>
              </a>
              <a 
                href="https://www.instagram.com/stoyperietpub/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 border-2 border-[#C46E52] text-[#C46E52] font-mono text-lg hover:bg-[#C46E52] hover:text-white transition-all group"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4.162 4.162 0 110-8.324A4.162 4.162 0 0112 16zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                <span>INSTAGRAM</span>
                <span className="font-mono text-xs opacity-50 group-hover:opacity-100">→</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <span className="font-mono text-[10px] text-[#C46E52] tracking-[0.3em] font-bold uppercase">Opningstider</span>
              <div className="font-mono text-xl sm:text-2xl text-white tracking-tight leading-none font-bold uppercase">
                ONS & SØN: 12:00—22:00<br/>
                FRE & LAUR: 12:00—00:00
              </div>
              <div className="pt-2 border-t border-white/10 space-y-1">
                <span className="inline-block bg-[#C46E52] text-white font-mono text-xs font-bold px-2.5 py-1 uppercase tracking-wider">
                  20+ ETTER KL. 19:00
                </span>
                <p className="font-mono text-[11px] text-[#D9D2C9]/60 uppercase tracking-wider">
                  Alle aldrar velkomne før kl. 19:00
                </p>
              </div>

              {isChristmas && (
                <div className="pt-2">
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('stoyperiet-open-christmas-hours'))}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#C46E52] hover:bg-[#A85339] text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                  >
                    <span>📅</span>
                    <span>Sjå opningstider i jula</span>
                    <span>→</span>
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="font-mono text-[10px] text-[#C46E52] tracking-[0.3em] font-bold uppercase">Generell kontakt</span>
                <div className="space-y-2">
                  <button 
                    onClick={() => copyToClipboard(email, 'main')}
                    className="group flex flex-col items-start gap-1 p-0 bg-transparent border-none cursor-pointer transition-transform active:scale-95"
                  >
                    <div className="flex items-center gap-2 font-mono text-base sm:text-lg md:text-xl lg:text-lg xl:text-2xl text-white tracking-tight leading-none font-bold group-hover:text-[#C46E52] transition-colors uppercase">
                      {email}
                      {copiedType === 'main' ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 opacity-30 group-hover:opacity-100" />
                      )}
                    </div>
                    {copiedType === 'main' && (
                      <span className="font-mono text-[10px] uppercase text-green-500 animate-pulse">E-post kopiert!</span>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <span className="font-mono text-[10px] text-[#C46E52] tracking-[0.3em] font-bold uppercase">Arrangement & Booking</span>
                <div className="space-y-2">
                  <button 
                    onClick={() => copyToClipboard(eventEmail, 'event')}
                    className="group flex flex-col items-start gap-1 p-0 bg-transparent border-none cursor-pointer transition-transform active:scale-95"
                  >
                    <div className="flex items-center gap-2 font-mono text-base sm:text-lg md:text-xl lg:text-lg xl:text-2xl text-white tracking-tight leading-none font-bold group-hover:text-[#C46E52] transition-colors uppercase">
                      {eventEmail}
                      {copiedType === 'event' ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 opacity-30 group-hover:opacity-100" />
                      )}
                    </div>
                    {copiedType === 'event' && (
                      <span className="font-mono text-[10px] uppercase text-green-500 animate-pulse">E-post kopiert!</span>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <div className="font-mono text-sm opacity-50 uppercase tracking-widest">
                  Sentrumsvegen 41, 5460 Husnes
                </div>
              </div>
            </div>
          </div>
        </div>


        {isChristmas && (
          <div className="border-t border-white/5 pt-10 pb-8 text-center">
            <p className="font-heading text-3xl md:text-5xl uppercase text-[#C46E52] tracking-tight">God jul frå Støyperiet</p>
            <p className="font-mono text-sm md:text-base text-[#D9D2C9]/80 mt-3">
              Me ses att 6. januar, utkvilte og litt rundare.
            </p>
          </div>
        )}

        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 font-mono text-[10px] uppercase tracking-widest opacity-40">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-center md:text-left">
            <span>© 2026 STØYPERIET PUB // HUSNES_NORWAY</span>
            <span>DESIGN & MERKEVARE: <a href="https://catalinajimenez.no/" target="_blank" rel="noopener noreferrer" className="hover:text-[#C46E52] transition-colors underline underline-offset-4 decoration-dotted">CATALINA JIMENEZ</a></span>
            <button
              onClick={() => togglePreview()}
              className={`transition-all text-center md:text-left cursor-pointer font-bold ${
                isChristmas 
                  ? "text-[#E97A5D] underline decoration-solid" 
                  : "text-white/80 hover:text-[#C46E52] underline decoration-dotted"
              }`}
              title="Førehandsvis julepynt for sida (Testmodus)"
            >
              {isChristmas ? (isPreview ? "🌲 Julepynt er PÅ (klikk for å avslutte test)" : "🌲 Julestemning er aktiv") : "🌲 Test julepynt (Førehandsvising)"}
            </button>
          </div>
          <div className="flex gap-8">
             <a 
               href="https://www.instagram.com/stoyperietpub/" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="hover:text-[#C46E52] transition-colors flex items-center gap-1"
             >
               <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4.162 4.162 0 110-8.324A4.162 4.162 0 0112 16zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
               Instagram
             </a>
             <a 
               href="https://www.facebook.com/profile.php?id=61588258673482" 
               target="_blank" 
               rel="noopener noreferrer" 
               className="hover:text-[#C46E52] transition-colors flex items-center gap-1"
             >
               <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" /></svg>
               Facebook
             </a>
          </div>
        </div>
      </div>
      
      {/* Bottom accent stripe */}
      <div className="absolute bottom-0 left-0 w-full h-3 bg-[#C46E52]"></div>
    </footer>
  );
};

export default Footer;
