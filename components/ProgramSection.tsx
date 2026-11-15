
import React, { useState, useMemo } from 'react';
import Stamp from './Stamp';
import { ArrowRight, Calendar, Clock, CheckCircle2, History, Sparkles } from 'lucide-react';

export interface EventItem {
  id: string;
  startDate: string; // ISO format: YYYY-MM-DDTHH:MM:SS
  endDate: string;   // ISO format: YYYY-MM-DDTHH:MM:SS
  dateDisplay: string;
  time: string;
  title: string;
  description: string;
  status: 'Gratis' | 'Billett' | 'Uavklart' | 'Utsolgt' | 'Utselt';
  registrationLink?: string;
  buttonLabel?: string;
  vippsNumber?: string;
  isFull?: boolean;
  category?: string;
}

// Master event program list with date stamps for automated lifecycle handling
const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'matfestival-2026',
    startDate: '2026-07-31T12:00:00',
    endDate: '2026-08-02T23:59:59',
    dateDisplay: "31. JULI - 02. AUG",
    time: "12:00",
    title: "MATFESTIVAL PÅ HUSNES",
    description: "Matfestival på Husnes. Me har ope frå 12:00-00:00 alle dagane.",
    status: "Gratis",
    category: "Festival"
  },
  {
    id: 'olsmaking-2026',
    startDate: '2026-08-19T18:00:00',
    endDate: '2026-08-19T23:59:59',
    dateDisplay: "19. AUGUST",
    time: "18:00",
    title: "ØLSMAKING OG SOGER",
    description: "Åsmund Kåre Rørvik held føredrag om ølbryggingskultur på Husnes og omegn, og det blir høve til å smaka på det aller fyrste brygget vårt.",
    status: "Billett",
    registrationLink: "https://event.checkin.no/227730/oelsmaking-og-soger",
    buttonLabel: "Kjøp billett her",
    category: "Føredrag & Smaking"
  },
  {
    id: 'bakgardsfest-2026',
    startDate: '2026-09-12T12:00:00',
    endDate: '2026-09-12T23:59:59',
    dateDisplay: "12. SEPT",
    time: "INFO KJEM",
    title: "BAKGARDSFEST",
    description: "Støyperiet x Kulturhuset arrangerer bakgardsfest på uteområdet vårt. Meir info kjem.",
    status: "Gratis",
    category: "Musikk & Fest"
  },
  {
    id: 'klesborsen-2026',
    startDate: '2026-09-20T13:00:00',
    endDate: '2026-09-20T17:00:00',
    dateDisplay: "20. SEPTEMBER",
    time: "13:00",
    title: "KLESBØRSEN VED STØYPERIET",
    description: "Konseptet er at folk tar med seg eit stativ eller eit bord, og kjøper seg plass på Støyperiet for å selja klede dei ikkje brukar lenger og som fortener ein ny heim.",
    status: "Billett",
    registrationLink: "https://event.checkin.no/228961/klesborsen-ved-stoyperiet",
    buttonLabel: "Kjøp plass her",
    category: "Gjenbruk & Marknad"
  },
  {
    id: 'reprise-olsmaking-2026',
    startDate: '2026-09-23T18:00:00',
    endDate: '2026-09-23T23:59:59',
    dateDisplay: "23. SEPTEMBER",
    time: "18:00",
    title: "REPRISE: ØLSMAKING OG SOGER",
    description: "Etter stor pågang køyrer me reprise! Åsmund Kåre Rørvik held føredrag om ølbryggingskultur på Husnes og omegn, og det blir høve til å smaka på 10 ulike øltypar.",
    status: "Billett",
    registrationLink: "https://event.checkin.no/228867/reprise-oelsmaking-og-soger",
    buttonLabel: "Kjøp billett her",
    category: "Føredrag & Smaking"
  },
  {
    id: 'husnes-jazzklubb-45aar-2026',
    startDate: '2026-10-02T19:00:00',
    endDate: '2026-10-02T23:59:59',
    dateDisplay: "02. OKTOBER",
    time: "INFO KJEM",
    title: "HUSNES JAZZKLUBB: GRÅBLÅ STRENGER",
    description: "Husnes Jazzklubb har gleden av å presentere bluesbandet Gråblå Strenger. Det blir garantert god stemning, råe gitarrytmar og ein herleg kveld du ikkje vil gå glipp av. Ta med deg venner og kjente og bli med på konsert. Sikre deg billett på førehand ved å vippse til 12838.",
    status: "Billett",
    vippsNumber: "12838",
    category: "Jubileum & Blueskonsert"
  },
  {
    id: 'roar-brekke-2026',
    startDate: '2026-10-09T20:00:00',
    endDate: '2026-10-09T21:30:00',
    dateDisplay: "09. OKTOBER",
    time: "20:00-21:30",
    title: "ROAR BREKKE - FOR Å SI DET SÅNN",
    description: "Etter braksuksess på Ole Bull Scene i Bergen og fulle hus rundt om i landet, er det vår tur. Med nærare 30 år på scena gjer Roar opp status: ikkje berre over karrieren, med over livet slik det faktisk blei.",
    status: "Utsolgt",
    isFull: true,
    category: "Standup & Humor"
  },
  {
    id: 'after-run-2026',
    startDate: '2026-10-10T14:00:00',
    endDate: '2026-10-10T18:00:00',
    dateDisplay: "10. OKTOBER",
    time: "14:00",
    title: "AFTER RUN PÅ STØYPERIET",
    description: "Social Run arrangerer «Rosa sløyfe-løpet» for å samla inn pengar til saka. Løpet varer til kl. 14:00, og me oppfordrar alle til å komma innom Støyperiet frå kl. 14:00 for god stemning og sosialt samver!",
    status: "Gratis",
    category: "Sosialt & Samhald"
  },
  {
    id: 'tv-aksjonen-2026',
    startDate: '2026-10-18T12:00:00',
    endDate: '2026-10-18T20:00:00',
    dateDisplay: "18. OKTOBER",
    time: "INFO KJEM",
    title: "TV-AKSJONEN",
    description: "TV-aksjonen 18. oktober i regi av frivilligsentralen. Bli med og støtt årets viktigaste sak og fellesskap på Støyperiet!",
    status: "Gratis",
    category: "Frivillig & Samhald"
  },
  {
    id: 'headset-konsert-anti-klovn-2026',
    startDate: '2026-10-21T19:00:00',
    endDate: '2026-10-21T21:00:00',
    dateDisplay: "21. OKTOBER",
    time: "19:00",
    title: "HEADSET-KONSERT MED ANTI_KLOVN",
    description: "Headset-konsert med Anti_Klovn på Støyperiet kl. 19:00. Ei unik og stemningsfull konsertoppleving rett i øyret!",
    status: "Billett",
    registrationLink: "https://mono-log.hoopla.no/event/antiklovnhusnes",
    buttonLabel: "Kjøp billett her",
    category: "Konsert & Musikk"
  },
  {
    id: 'pubkor-2026',
    startDate: '2026-10-30T19:00:00',
    endDate: '2026-10-30T21:00:00',
    dateDisplay: "30. OKTOBER",
    time: "19:00–21:00",
    title: "PUBKOR PÅ STØYPERIET",
    description: "Kammerskoret og musikalsk leiar Hilde Svalbjørg inviterer til Pubkor på Støyperiet! Pubkor er, som ordet sjølv hintar til, eit uformelt og sosialt arrangement der folk møtes på ein pub for å synge saman over eit glas. Det er gratis, men ein MÅ melde seg på.",
    status: "Gratis",
    registrationLink: "https://event.checkin.no/230414/pubkor-paa-stoeyperiet",
    buttonLabel: "Meld deg på her (Gratis)",
    category: "Song & Sosialt"
  },
  {
    id: 'the-real-thing-2026',
    startDate: '2026-10-31T20:00:00',
    endDate: '2026-10-31T23:59:59',
    dateDisplay: "31. OKTOBER",
    time: "20:00",
    title: "THE REAL THING",
    description: "I regi med Husnes Jazzklubb. Sjå arrangementet for meir info og billettar!",
    status: "Billett",
    registrationLink: "https://fb.me/e/bAJr46gob",
    buttonLabel: "Billett & info (Facebook)",
    category: "Konsert & Jazz"
  },
  {
    id: 'dansn-2026',
    startDate: '2026-11-06T20:00:00',
    endDate: '2026-11-06T23:59:59',
    dateDisplay: "06. NOVEMBER",
    time: "20:00",
    title: "DANS'N",
    description: "Hugsar du når ein kunne gå ut på dans? Det kan ein igjen! Dans’n inviterer til ein svingande og triveleg dansekveld på Støyperiet fredag 6. november 2026. Gratis inngang!",
    status: "Gratis",
    category: "Musikk & Dans"
  },
  {
    id: 'hurtigsjakk-2026',
    startDate: '2026-11-08T16:00:00',
    endDate: '2026-11-08T20:00:00',
    dateDisplay: "08. NOVEMBER",
    time: "16:00",
    title: "UFORMELT KVINNHERADMEISTERSKAP I HURTIGSJAKK",
    description: "Har du lyst å testa deg mot andre kvinnheringar i sjakk og slå i hel nokre timar med hurtigsjakk? Støyperiet arrangerer eit uoffisielt Kvinnheradmeisterskap i sjakk søndag 8. november kl. 16:00. Meld deg på via Checkin!",
    status: "Gratis",
    registrationLink: "https://event.checkin.no/232514/uformelt-kvinnheradmeisterskap-i-hurtigsjakk",
    buttonLabel: "Meld deg på",
    category: "Konkurranse & Sjakk"
  },
  {
    id: 'boklansering-maria-2026',
    startDate: '2026-11-15T18:00:00',
    endDate: '2026-11-15T21:00:00',
    dateDisplay: "15. NOVEMBER",
    time: "18:00",
    title: "BOKLANSERING MARIA BRÅTVEIT PETTERSEN",
    description: "Boklansering med Maria Bråtveit Pettersen på Støyperiet sundag 15. november kl. 18:00. Velkommen!",
    status: "Gratis",
    category: "Boklansering & Litteratur"
  },
  {
    id: 'eit-slags-arrangement-anders-totland-2026',
    startDate: '2026-11-18T20:00:00',
    endDate: '2026-11-18T21:00:00',
    dateDisplay: "18. NOVEMBER",
    time: "20:00 - 21:00",
    title: "KULTURELT KNASK PÅ EIN ONSDAG",
    description: "Anders Totland tar med trøorgelet og ein kremgjeng med gode folk som bidrar med litt av kvart frå scenen, og alt er heilt gratis (bortsett frå det du kjøper i baren).",
    status: "Gratis",
    category: "Kultur & Litteratur"
  },
  {
    id: 'mannsdagsquiz-2026',
    startDate: '2026-11-20T18:30:00',
    endDate: '2026-11-20T22:00:00',
    dateDisplay: "20. NOVEMBER",
    time: "18:30",
    title: "MANNSDAGSQUIZ",
    description: "Menn toppar statistikken for sjølvmord, rus og utanforskap i Noreg. Psykisk uhelse og einsemd blir ofte peika på som ein del av grunnen. Ein kviss løyser ikkje det. Men ein kveld der det er lett å kome, lett å bli sitjande og lett å prate, er ein god start. Difor inviterer LO Kvinnherad og Støyperiet til kvisspub og gode samtalar fredag 20. november.",
    status: "Gratis",
    category: "Konkurranse & Quiz"
  },
  {
    id: 'juletradisjonar-2026',
    startDate: '2026-12-02T18:30:00',
    endDate: '2026-12-05T23:59:59',
    dateDisplay: "02. - 05. DESEMBER",
    time: "18:30 / 20:30",
    title: "JULETRADISJONAR OG ANDRE LIDELSAR..",
    description: "Ein førjulskveld med latter, allsong og uhøgtidleg humor med Anne Kathrin, Karianne og Nils'n! Framsyningar 2., 4. og 5. desember. Sjå Hoopla for billettar og info.",
    status: "Billett",
    registrationLink: "https://stoyperiet.hoopla.no/event/67317976",
    buttonLabel: "Kjøp billett på Hoopla",
    category: "Juleshow & Humor"
  },
  {
    id: 'moondance-2026',
    startDate: '2026-12-11T20:00:00',
    endDate: '2026-12-11T23:59:59',
    dateDisplay: "11. DESEMBER",
    time: "20:00",
    title: "KONSERT MED MOONDANCE",
    description: "Moondance kjem for å ringa inn jula på Støyperiet fredag 11. desember!",
    status: "Billett",
    registrationLink: "https://moondance.hoopla.no/event/1862730922",
    buttonLabel: "Kjøp billett på Hoopla",
    category: "Konsert & Musikk"
  },
  {
    id: 'allsongbingo-2026',
    startDate: '2026-12-19T19:00:00',
    endDate: '2026-12-19T23:00:00',
    dateDisplay: "19. DESEMBER",
    time: "19:00",
    title: "ALLSONGBINGO M/ÅGE STOKKEN",
    description: "Allsongbingo med Åge Stokken laurdag 19. desember! Meir info og påmelding kjem.",
    status: "Uavklart",
    buttonLabel: "Meir info & påmelding kjem",
    category: "Song & Sosialt"
  },
  {
    id: 'foerstejuledagskviss-2026',
    startDate: '2026-12-25T20:00:00',
    endDate: '2026-12-25T23:59:59',
    dateDisplay: "25. DESEMBER",
    time: "20:00",
    title: "FØRSTEJULEDAGSKVISS",
    description: "Tradisjonsrik og stemningsfull førstejuledagskviss på Støyperiet 1. juledag! Ta med vener, familie og heimkomne sambygdingar for ein kjekk og sosial kveld.",
    status: "Gratis",
    category: "Konkurranse & Quiz"
  }
];

const ProgramSection: React.FC = () => {
  const [filter, setFilter] = useState<'upcoming' | 'all' | 'past'>('upcoming');

  // Evaluate real-time status of each event
  const processedEvents = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const todayEnd = todayStart + (24 * 60 * 60 * 1000) - 1;

    return INITIAL_EVENTS.map(event => {
      const eventStart = new Date(event.startDate).getTime();
      const eventEnd = new Date(event.endDate).getTime();

      const isPast = now.getTime() > eventEnd;
      const isToday = (eventStart <= todayEnd && eventEnd >= todayStart);
      const isUpcoming = !isPast;

      return {
        ...event,
        isPast,
        isToday,
        isUpcoming,
        eventStart,
        eventEnd
      };
    }).sort((a, b) => {
      // Sort upcoming events earliest first; past events latest first
      if (!a.isPast && !b.isPast) return a.eventStart - b.eventStart;
      if (a.isPast && b.isPast) return b.eventStart - a.eventStart;
      return a.isPast ? 1 : -1;
    });
  }, []);

  const upcomingCount = processedEvents.filter(e => e.isUpcoming).length;
  const pastCount = processedEvents.filter(e => e.isPast).length;

  const displayedEvents = useMemo(() => {
    if (filter === 'upcoming') {
      return processedEvents.filter(e => e.isUpcoming);
    }
    if (filter === 'past') {
      return processedEvents.filter(e => e.isPast);
    }
    return processedEvents;
  }, [processedEvents, filter]);

  return (
    <section id="program" className="bg-[#2D2D2D] text-[#C9BBAF] py-32 md:py-56 px-6 relative overflow-hidden scroll-mt-24" data-is-dark="true">
      {/* Large background halftone sphere */}
      <div className="absolute -bottom-20 -right-20 w-96 h-96 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#C46E52 2px, transparent 2px)', backgroundSize: '12px 12px' }}></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-12">
          <div className="max-w-3xl space-y-4">
            <div className="bg-[#C46E52] text-white px-4 py-1 font-mono text-[11px] uppercase tracking-widest inline-block font-bold">
              LOG_04: BULLETIN_SCHEDULE
            </div>
            <h2 className="font-heading text-7xl md:text-9xl uppercase leading-none text-white tracking-tighter">
              KVA <br/><span className="text-[#C46E52] riso-print" data-text="SKJER?">SKJER?</span>
            </h2>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Stamp text="AUTOMATISK OPPDATERT" color="rust" />
          </div>
        </div>

        {/* Dynamic Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/20 mb-12 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2.5 border uppercase font-bold transition-all cursor-pointer flex items-center gap-2 ${
                filter === 'upcoming'
                  ? 'bg-[#C46E52] border-[#C46E52] text-white shadow-lg'
                  : 'bg-black/30 border-white/15 text-white/70 hover:text-white hover:border-[#C46E52]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>KOMMANDE ({upcomingCount})</span>
            </button>

            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2.5 border uppercase font-bold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#C46E52] border-[#C46E52] text-white shadow-lg'
                  : 'bg-black/30 border-white/15 text-white/70 hover:text-white hover:border-[#C46E52]'
              }`}
            >
              <span>ALLE ARRANGEMENT ({processedEvents.length})</span>
            </button>

            {pastCount > 0 && (
              <button
                onClick={() => setFilter('past')}
                className={`px-4 py-2.5 border uppercase font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  filter === 'past'
                    ? 'bg-[#C46E52] border-[#C46E52] text-white shadow-lg'
                    : 'bg-black/30 border-white/15 text-white/70 hover:text-white hover:border-[#C46E52]'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>TIDLEGARE ({pastCount})</span>
              </button>
            )}
          </div>

          <div className="text-[11px] text-white/50 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span>
            <span>Live datobasert program</span>
          </div>
        </div>

        {/* Event List */}
        {displayedEvents.length === 0 ? (
          <div className="p-16 border border-white/10 bg-black/20 text-center font-mono space-y-4">
            <Calendar className="w-10 h-10 text-[#C46E52] mx-auto opacity-70" />
            <h4 className="text-xl text-white font-bold uppercase">Ingen arrangement i dette valet</h4>
            <p className="text-sm opacity-60 max-w-md mx-auto">
              {filter === 'upcoming' 
                ? 'Nye kulturarrangement vert annonsert fortløpande. Sjekk også mikroarrangementa i kalenderen ovanfor!' 
                : 'Ingen arrangement funne.'}
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="mt-4 px-4 py-2 bg-[#C46E52] text-white font-mono text-xs uppercase font-bold hover:bg-white hover:text-[#1A1A1A] transition-colors cursor-pointer"
              >
                Vis alle arrangement
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-0 border-t-2 border-white/20">
            {displayedEvents.map((event) => {
              return (
                <div 
                  key={event.id} 
                  className={`group flex flex-col md:flex-row gap-8 md:gap-16 items-start py-14 border-b border-white/10 transition-all ${
                    event.isPast 
                      ? 'opacity-40 hover:opacity-75 bg-black/10' 
                      : event.isToday
                        ? 'bg-[#C46E52]/10 hover:bg-[#C46E52]/15 border-l-4 border-l-[#C46E52] pl-4 sm:pl-6'
                        : 'hover:bg-white/[0.02]'
                  }`}
                >
                  {/* Date Column */}
                  <div className="flex-shrink-0 w-full md:w-56">
                    <div className="relative">
                      <div className="absolute -top-2 -left-2 bg-[#C46E52] w-full h-full opacity-0 group-hover:opacity-40 mix-blend-multiply transition-opacity"></div>
                      <div className={`p-6 shadow-xl relative z-10 ${
                        event.isToday 
                          ? 'bg-[#C46E52] text-white font-bold'
                          : event.isPast
                            ? 'bg-[#8C949D] text-[#1A1A1A]'
                            : 'bg-[#C9BBAF] text-[#2D2D2D]'
                      }`}>
                        <div className="flex justify-between items-start">
                          <p className="font-mono text-2xl sm:text-3xl leading-none tracking-tighter font-bold">{event.dateDisplay}</p>
                          
                          {event.isToday && (
                            <span className="bg-black text-white text-[9px] px-1.5 py-0.5 font-bold tracking-widest uppercase animate-pulse">
                              I DAG
                            </span>
                          )}

                          {!event.isToday && event.isPast && (
                            <span className="bg-black/60 text-white text-[9px] px-1.5 py-0.5 font-bold tracking-widest uppercase">
                              FERDIG
                            </span>
                          )}

                          {!event.isToday && !event.isPast && event.isFull && (
                            <span className="bg-[#C46E52] text-white text-[9px] px-1.5 py-0.5 font-bold tracking-tighter uppercase">
                              {event.status === 'Billett' ? 'UTSELT' : 'FULLT'}
                            </span>
                          )}
                        </div>
                        <p className={`font-mono text-[12px] uppercase mt-3 pt-3 border-t ${
                          event.isToday ? 'border-white/30 text-white' : 'border-[#2D2D2D]/20 text-[#2D2D2D]'
                        }`}>
                          {/^\d/.test(event.time) ? `KLOKKA ${event.time}` : event.time}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Details Column */}
                  <div className="flex-1 space-y-5">
                    <div className="flex flex-wrap items-center gap-3">
                      {event.category && (
                        <span className="font-mono text-[10px] text-[#C46E52] uppercase font-bold tracking-wider px-2 py-0.5 bg-black/40 border border-white/10">
                          {event.category}
                        </span>
                      )}
                      {event.isToday && (
                        <span className="flex items-center gap-1.5 font-mono text-[11px] text-green-400 font-bold uppercase tracking-wider">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-ping inline-block"></span>
                          Føregår i dag
                        </span>
                      )}
                      {event.isPast && (
                        <span className="font-mono text-[11px] text-white/50 uppercase font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white/40" />
                          Gjennomført arrangement
                        </span>
                      )}
                    </div>

                    <h3 className={`font-mono text-3xl md:text-5xl transition-colors leading-[0.9] tracking-tighter font-bold ${
                      event.isPast 
                        ? 'text-white/60 line-through decoration-white/30' 
                        : 'text-white group-hover:text-[#C46E52]'
                    }`}>
                      {event.title}
                    </h3>

                    <p className="text-lg opacity-75 max-w-2xl font-medium tracking-tight leading-relaxed">
                      {event.description}
                    </p>

                    {/* Action buttons if not expired */}
                    {!event.isPast && (
                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        {event.vippsNumber && (
                          <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-[#FF5B24]/20 border border-[#FF5B24]/60 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-md">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5B24] inline-block"></span>
                            <span>Kjøp billett: Vipps til #{event.vippsNumber}</span>
                          </div>
                        )}

                        {event.registrationLink && (
                          event.isFull ? (
                            <span className="inline-block px-4 py-2 border border-white/20 font-mono text-xs text-white/50 uppercase font-bold">
                              Arrangementet er fullt
                            </span>
                          ) : (
                            <a 
                              href={event.registrationLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-3 bg-[#C46E52] hover:bg-white text-white hover:text-[#2D2D2D] px-6 py-3 font-mono text-sm uppercase tracking-widest transition-all group/btn font-bold shadow-lg"
                            >
                              {event.buttonLabel || "Meld deg på her"}
                              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </a>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  {/* Stamp / Status */}
                  <div className="flex-shrink-0 self-start md:self-center">
                    <Stamp 
                      text={event.isPast ? 'AVSLUTTA' : event.isToday ? 'I DAG' : event.status} 
                      color={event.isPast ? 'steel' : event.isToday ? 'rust' : event.status === 'Gratis' ? 'steel' : event.status === 'Uavklart' ? 'rust' : 'charcoal'} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProgramSection;
