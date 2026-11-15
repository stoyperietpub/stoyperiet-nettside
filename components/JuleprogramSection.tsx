import React from 'react';
import { useSeason } from '../seasonConfig';
import { INITIAL_PROGRAM_EVENTS } from './EventsHubSection';

/**
 * Juleprogram: ei kort liste over desemberarrangementa, berre synleg i julemodus.
 * Hentar data frå INITIAL_PROGRAM_EVENTS, så ho held seg oppdatert av seg sjølv.
 */
const WEEKDAYS = ['Søn', 'Mån', 'Tys', 'Ons', 'Tor', 'Fre', 'Lau'];

const JuleprogramSection: React.FC = () => {
  const { isChristmas } = useSeason();
  if (!isChristmas) return null;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const events = INITIAL_PROGRAM_EVENTS
    .filter((ev) => {
      const start = new Date(ev.startDate);
      return start.getMonth() === 11 && new Date(ev.endDate).getTime() >= todayStart;
    })
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  if (events.length === 0) return null;

  const goToProgram = () => document.getElementById('program')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="juleprogram" className="bg-[#D9D2C9] px-6 py-20 md:py-28 border-t-2 border-[#1A1A1A]/10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#C46E52] font-bold">Desember på Støyperiet</span>
            <h2 className="font-heading text-5xl md:text-7xl leading-[0.9] text-[#1A1A1A] uppercase mt-2">Juleprogram</h2>
          </div>
          <p className="font-mono text-xs text-[#1A1A1A]/60 max-w-xs md:text-right">
            Trykk på eit arrangement for klokkeslett, billettar og meir info.
          </p>
        </div>

        <ul className="border-t-2 border-[#1A1A1A]">
          {events.map((ev) => {
            const d = new Date(ev.startDate);
            const soldOut = ev.status === 'Utseld' || ev.status === 'Utselt' || ev.status === 'Utsolgt' || ev.isFull;
            return (
              <li key={ev.id} className="border-b border-[#1A1A1A]/20">
                <button
                  type="button"
                  onClick={goToProgram}
                  className="group w-full grid grid-cols-[4.5rem_1fr_auto] sm:grid-cols-[6rem_1fr_auto] items-center gap-3 sm:gap-6 py-4 text-left cursor-pointer hover:bg-[#1A1A1A]/5 transition-colors px-1"
                >
                  <span className="font-mono text-[#1A1A1A]">
                    <span className="block text-2xl sm:text-3xl font-bold leading-none tabular-nums">{d.getDate()}.12</span>
                    <span className="block text-[10px] uppercase tracking-wider text-[#1A1A1A]/50 mt-1">{WEEKDAYS[d.getDay()]} · {ev.time}</span>
                  </span>
                  <span className={`font-mono font-bold uppercase text-sm sm:text-lg tracking-tight ${soldOut ? 'text-[#1A1A1A]/45 line-through decoration-[#C46E52] decoration-2' : 'text-[#1A1A1A]'}`}>
                    {ev.title}
                  </span>
                  <span className="flex items-center gap-2">
                    {soldOut ? (
                      <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#C46E52] border-2 border-[#C46E52] px-2 py-0.5 -rotate-6 inline-block">
                        Utseld
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-[#1A1A1A]/60">
                        {ev.price || ev.status}
                      </span>
                    )}
                    <span className="text-[#C46E52] font-bold group-hover:translate-x-1 transition-transform hidden sm:inline">→</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default JuleprogramSection;
