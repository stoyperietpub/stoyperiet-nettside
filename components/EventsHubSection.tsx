import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ArrowRight, 
  Users, 
  Download, 
  Share2, 
  Coffee, 
  Target, 
  Crown, 
  Coins, 
  Briefcase, 
  Dices, 
  Music, 
  Ticket, 
  Check, 
  Copy, 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  ExternalLink,
  Sparkles,
  Award,
  Footprints,
  HelpCircle
} from 'lucide-react';
import { useSeason } from '../seasonConfig';
import SantaHat from './SantaHat';

export type UnifiedEventType = 'program' | 'micro';

export interface EventItem {
  id: string;
  startDate: string; // ISO format: YYYY-MM-DDTHH:MM:SS
  endDate: string;   // ISO format: YYYY-MM-DDTHH:MM:SS
  dateDisplay: string;
  time: string;
  doorsOpen?: string;
  title: string;
  description: string;
  status: 'Gratis' | 'Billett' | 'Uavklart' | 'Utsolgt' | 'Utselt' | 'Utseld';
  registrationLink?: string;
  buttonLabel?: string;
  vippsNumber?: string;
  isFull?: boolean;
  category?: string;
  price?: string;
  image?: string;
}

export interface MicroEventRule {
  id: string;
  title: string;
  category: 'sosialt' | 'konkurranse' | 'nettverk' | 'musikk';
  ruleDescription: string;
  time: string;
  doorsOpen?: string;
  price: string;
  registrationLink?: string;
  registrationNote?: string;
  description: string;
  badgeColor: string;
  calculateDate: (year: number, month: number) => number | null;
  /** Kan visast same dag som eit programarrangement (t.d. tidleg mingling før kveldskonsert) */
  allowSameDayAsProgram?: boolean;
}

export interface UnifiedCalendarEvent {
  id: string;
  title: string;
  category: string;
  eventType: UnifiedEventType;
  time: string;
  doorsOpen: string;
  price?: string;
  status?: 'Gratis' | 'Billett' | 'Uavklart' | 'Utsolgt' | 'Utselt' | 'Utseld';
  registrationLink?: string;
  buttonLabel?: string;
  registrationNote?: string;
  vippsNumber?: string;
  isFull?: boolean;
  description: string;
  badgeColor: string;
  ruleDescription?: string;
  day: number;
  date: Date;
  dateString: string;
  isPast?: boolean;
  image?: string;
}

// Master list of cultural and headline program events
export const INITIAL_PROGRAM_EVENTS: EventItem[] = [
  {
    id: 'matfestival-2026',
    startDate: '2026-07-31T12:00:00',
    endDate: '2026-08-02T23:59:59',
    dateDisplay: "31. JULI - 02. AUG",
    time: "12:00",
    doorsOpen: "12:00",
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
    doorsOpen: "12:00",
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
    doorsOpen: "12:00",
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
    doorsOpen: "12:00",
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
    doorsOpen: "12:00",
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
    doorsOpen: "12:00",
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
    time: "20:00–21:30",
    doorsOpen: "12:00",
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
    time: "14:00–18:00",
    doorsOpen: "12:00",
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
    doorsOpen: "12:00",
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
    doorsOpen: "12:00",
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
    doorsOpen: "12:00",
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
    doorsOpen: "12:00",
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
    doorsOpen: "12:00",
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
    doorsOpen: "12:00",
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
    doorsOpen: "12:00",
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
    doorsOpen: "12:00",
    title: "KULTURELT KNASK PÅ EIN ONSDAG",
    description: "Anders Totland tar med trøorgelet og ein kremgjeng med gode folk som bidrar med litt av kvart frå scenen, og alt er heilt gratis (bortsett frå det du kjøper i baren).\n\nMed Anders Totland (trøorgel), Rune Eikemo, Nils Trygve Markhus, Trond Thorsen, Ståle Eskeland, Karianne Solheim og Arne Torget.",
    status: "Gratis",
    category: "Kultur & Litteratur"
  },
  {
    id: 'mannsdagsquiz-2026',
    startDate: '2026-11-20T18:30:00',
    endDate: '2026-11-20T20:30:00',
    dateDisplay: "20. NOVEMBER",
    time: "18:30–20:30",
    doorsOpen: "12:00",
    title: "MANNSDAGSKVISS",
    description: "Menn toppar statistikken for sjølvmord, rus og utanforskap i Noreg. Psykisk uhelse og einsemd blir ofte peika på som ein del av grunnen. Ein kviss løyser ikkje det. Men ein kveld der det er lett å kome, lett å bli sitjande og lett å prate, er ein god start. Difor inviterer LO Kvinnherad og Støyperiet til kvisspub og gode samtalar fredag 20. november.\n\nTa med deg venner, kjentfolk og kollegaer. Eller kom åleine, så finn me eit lag til deg. Påmeldinga stengjer fredag 20. november kl. 10:00.",
    status: "Gratis",
    registrationLink: "https://event.checkin.no/234741/lo-kvinnherad-arrangerer-mannsdagskviss-pa-stoyperiet",
    buttonLabel: "Meld deg på (Checkin)",
    category: "Konkurranse & Kviss"
  },
  {
    id: 'torill-aurora-band-2026',
    startDate: '2026-11-27T20:00:00',
    endDate: '2026-11-27T23:59:59',
    dateDisplay: "27. NOVEMBER",
    time: "20:00",
    doorsOpen: "12:00",
    title: "TORILL AURORA BAND",
    description: "I regi av Husnes Jazzklubb. Fredag 27. november kjem Torill Aurora Band til folkepuben Støyperiet på Husnes. Trass i sin unge alder har Torill Aurora lang fartstid innan mange ulike musikkgenre som jazz, rock, blues, country og mykje anna.\n\nBillettar: ordinær 300,-, medlemmar 200,-, student 100,-. Kjøp billett via Vipps til 12838. Hiv deg rundt før det blir utselt!",
    status: "Billett",
    vippsNumber: "12838",
    price: "kr 300 / 200 / 100",
    category: "Konsert & Jazz"
  },
  {
    id: 'juletradisjonar-ons-2026',
    startDate: '2026-12-02T18:30:00',
    endDate: '2026-12-02T22:00:00',
    dateDisplay: "02. DESEMBER",
    time: "18:30",
    doorsOpen: "17:30",
    title: "JULETRADISJONAR OG ANDRE LIDELSAR..",
    description: "Ein førjulskveld med latter, allsong og uhøgtidleg humor med Anne Kathrin, Karianne og Nils'n! Denne framsyninga er utseld. Det er framleis billettar til fredag kl. 18:30 og ekstrashowa søndag 6. desember.",
    status: "Utseld",
    registrationLink: "https://stoyperiet.hoopla.no/event/67317976",
    buttonLabel: "Sjå ledige billettar på Hoopla",
    category: "Juleshow & Humor",
    price: "kr 455,-"
  },
  {
    id: 'juletradisjonar-fre-2026',
    startDate: '2026-12-04T18:30:00',
    endDate: '2026-12-04T23:00:00',
    dateDisplay: "04. DESEMBER",
    time: "18:30 & 20:30",
    doorsOpen: "17:30",
    title: "JULETRADISJONAR OG ANDRE LIDELSAR..",
    description: "Ein førjulskveld med latter, allsong og uhøgtidleg humor med Anne Kathrin, Karianne og Nils'n! To framsyningar: kl. 18:30 (ledige billettar) og kl. 20:30 (utseld).",
    status: "Billett",
    registrationLink: "https://stoyperiet.hoopla.no/event/67317976",
    buttonLabel: "Kjøp billett på Hoopla",
    category: "Juleshow & Humor",
    price: "kr 455,-"
  },
  {
    id: 'juletradisjonar-lau-2026',
    startDate: '2026-12-05T20:30:00',
    endDate: '2026-12-05T23:59:59',
    dateDisplay: "05. DESEMBER",
    time: "20:30",
    doorsOpen: "19:30",
    title: "JULETRADISJONAR OG ANDRE LIDELSAR..",
    description: "Ein førjulskveld med latter, allsong og uhøgtidleg humor med Anne Kathrin, Karianne og Nils'n! Denne framsyninga er utseld. Det er framleis billettar til fredag kl. 18:30 og ekstrashowa søndag 6. desember.",
    status: "Utseld",
    registrationLink: "https://stoyperiet.hoopla.no/event/67317976",
    buttonLabel: "Sjå ledige billettar på Hoopla",
    category: "Juleshow & Humor",
    price: "kr 455,-"
  },
  {
    id: 'juletradisjonar-son-2026',
    startDate: '2026-12-06T17:30:00',
    endDate: '2026-12-06T22:00:00',
    dateDisplay: "06. DESEMBER",
    time: "17:30 & 20:00",
    title: "JULETRADISJONAR OG ANDRE LIDELSAR..",
    description: "Ein førjulskveld med latter, allsong og uhøgtidleg humor med Anne Kathrin, Karianne og Nils'n! Ekstrashow! To nye framsyningar søndag 6. desember kl. 17:30 og 20:00.",
    status: "Billett",
    registrationLink: "https://stoyperiet.hoopla.no/event/67317976",
    buttonLabel: "Kjøp billett på Hoopla",
    category: "Juleshow & Humor",
    price: "kr 455,-"
  },
  {
    id: 'moondance-2026',
    startDate: '2026-12-11T19:00:00',
    endDate: '2026-12-11T23:59:59',
    dateDisplay: "11. DESEMBER",
    time: "19:00",
    doorsOpen: "12:00",
    title: "KONSERT MED MOONDANCE",
    description: "Seks erfarne musikarar frå Kvinnherad tek med seg låtar du kan, låtar du trur du ikkje kan, og ein liten pose juleklassikarar. På repertoaret står mellom anna Van Morrison, Bob Dylan, Amy Winehouse, Cher, Johnny Cash og Tom Jones.\n\nBandet er Håkon Røstbø (gitar/vokal), Ingrid og Astrid Fjellandsbø Røstbø (vokal), Ole Bjarte Røssland (trommer), Kjartan Hansen (bass) og Hallgeir Tvedten (keyboard). Allsong er frivillig, men erfaringsmessig vanskeleg å la vere.",
    status: "Billett",
    registrationLink: "https://moondance.hoopla.no/event/1862730922",
    buttonLabel: "Kjøp billett på Hoopla",
    category: "Konsert & Musikk",
    price: "kr 275,-"
  },
  {
    id: 'allsongbingo-2026',
    startDate: '2026-12-19T19:00:00',
    endDate: '2026-12-19T23:00:00',
    dateDisplay: "19. DESEMBER",
    time: "19:00",
    doorsOpen: "12:00",
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
    doorsOpen: "12:00",
    title: "FØRSTEJULEDAGSKVISS",
    description: "Tradisjonsrik og stemningsfull førstejuledagskviss på Støyperiet 1. juledag! Ta med vener, familie og heimkomne sambygdingar for ein kjekk og sosial kveld.",
    status: "Gratis",
    category: "Konkurranse & Quiz"
  }
];

// Calculation helpers
function getNthDayOfWeek(year: number, month: number, dayOfWeek: number, n: number): number {
  let count = 0;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    if (d.getDay() === dayOfWeek) {
      count++;
      if (count === n) {
        return day;
      }
    }
  }
  return 1;
}

function getLastDayOfWeek(year: number, month: number, dayOfWeek: number): number {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = daysInMonth; day >= 1; day--) {
    const d = new Date(year, month, day);
    if (d.getDay() === dayOfWeek) {
      return day;
    }
  }
  return daysInMonth;
}

function calculateLonnstreff(year: number, month: number): number {
  // In November 2026: Mannsdagsquiz is on Friday Nov 20, so Lønningstreff is moved to Saturday Nov 21
  if (year === 2026 && month === 10) return 21;
  // In December 2026: Moondance concert is on Friday Dec 11, so Lønningstreff is on Friday Dec 4
  if (year === 2026 && month === 11) return 4;

  // Alternates between closest to 12th and 20th each month.
  // Human calendar: Odd months (Jan=1, Mar=3, Mai=5, Jul=7, Sep=9, Nov=11) -> target 20.
  // Even months (Feb=2, Apr=4, Jun=6, Aug=8, Okt=10, Des=12) -> target 12.
  const humanMonth = month + 1;
  const targetDay = (humanMonth % 2 === 0) ? 12 : 20;
  const date = new Date(year, month, targetDay);
  const dow = date.getDay();

  if (dow === 5) {
    return targetDay;
  } else if (dow === 6) {
    return targetDay - 1;
  } else if (dow === 0) {
    return targetDay - 2;
  } else {
    return targetDay + (5 - dow);
  }
}

export const MICRO_EVENT_RULES: MicroEventRule[] = [
  {
    id: 'strikkekafe',
    title: 'Strikkekafé',
    category: 'sosialt',
    ruleDescription: '1. søndag i månaden',
    time: '17:30–20:30',
    doorsOpen: '12:00',
    price: 'Gratis',
    description: 'Ta med strikketøyet eller handarbeidet ditt og slå deg ned saman med andre handarbeidsglade. Kaffi, drøs og uformell søndagsstemning.',
    badgeColor: '#C46E52',
    calculateDate: (year, month) => getNthDayOfWeek(year, month, 0, 1)
  },
  {
    id: 'dartkveld',
    title: 'Dartkveld',
    category: 'konkurranse',
    ruleDescription: '1. onsdag i månaden',
    time: '18:00–22:00',
    doorsOpen: '12:00',
    price: 'Gratis',
    description: 'Uformell dartkveld for både ferske og erfarne kastarar. Bli med på miniturnering, lær tips og triks, eller berre kast nokre piler i hyggeleg lag.',
    badgeColor: '#8C949D',
    calculateDate: (year, month) => getNthDayOfWeek(year, month, 3, 1)
  },
  {
    id: 'sjakksondag',
    title: 'Sjakksøndag',
    category: 'sosialt',
    ruleDescription: '2. søndag i månaden',
    time: '17:00–21:00',
    doorsOpen: '12:00',
    price: 'Gratis',
    description: 'Sjakkbrett, klokker og godt selskap. Ope for alle ferdigheitsnivå – frå deg som vil lære dei grunnleggjande reglane til dei som vil spele lynsjakk.',
    badgeColor: '#C46E52',
    calculateDate: (year, month) => {
      // In November 2026, replaced by Uformelt Kvinnheradmeisterskap i hurtigsjakk
      if (year === 2026 && month === 10) return null;
      return getNthDayOfWeek(year, month, 0, 2);
    }
  },
  {
    id: 'lonningstreff',
    title: 'Lønningstreff',
    category: 'sosialt',
    ruleDescription: 'Fredag nærast den 12. eller 20. (vekslar annakvar månad)',
    time: '17:00–00:00',
    doorsOpen: '12:00',
    price: 'Gratis',
    description: 'Feir lønninga saman med kollegaer, vener og sambygdingar! God stemning, noko godt i glaset og uformell mingling etter arbeidsdagen. Vanlegvis på ein fredag.',
    badgeColor: '#E6A15C',
    calculateDate: (year, month) => calculateLonnstreff(year, month)
  },
  {
    id: 'naeringslivsmingling',
    title: 'Næringslivsmingling',
    category: 'nettverk',
    ruleDescription: 'Siste fredag i månaden',
    time: '16:30–19:00',
    doorsOpen: '12:00',
    price: 'Gratis',
    description: 'Uformelt treff for lokalt næringsliv, etablerarar, tilsette og nysgjerrige. Knyt nye kontaktar, diskuter idear og gå inn i helga inspirert.',
    badgeColor: '#8C949D',
    allowSameDayAsProgram: true,
    calculateDate: (year, month) => {
      // In October 2026, Friday 30th is dedicated to Pubkor, so mingling is on Friday 23rd
      if (year === 2026 && month === 9) return 23;
      // In December 2026, Friday 25th is dedicated to Førstejuledagskviss, so mingling is moved to Friday 18th
      if (year === 2026 && month === 11) return 18;
      return getLastDayOfWeek(year, month, 5);
    }
  },
  {
    id: 'kviss',
    title: 'Fast Månadsquiz',
    category: 'konkurranse',
    ruleDescription: 'Siste onsdag i månaden',
    time: '19:00–21:30',
    doorsOpen: '12:00',
    price: 'Påmelding',
    registrationLink: 'https://event.checkin.no/233631/quiz-pa-stoyperiet-onsdag-25-november',
    registrationNote: 'Påmeldinga opnar den 1. i kvar månad kl. 18:00.',
    description: 'Saml laget ditt til den faste månadsquizen på Støyperiet! Quizen er no blitt til liga – bli med og kjemp om poeng, topplassering, heider og ære.',
    badgeColor: '#C46E52',
    calculateDate: (year, month) => getLastDayOfWeek(year, month, 3)
  },
  {
    id: 'brettspelkveld',
    title: 'Brettspelkveld',
    category: 'sosialt',
    ruleDescription: 'Siste søndag i månaden',
    time: '17:00–21:00',
    doorsOpen: '12:00',
    price: 'Gratis',
    description: 'Me har eit godt utval av brettspel for alle aldrar og smakar. Ta gjerne med eigne spel også. Finn eit ledig bord og bli med i spelet!',
    badgeColor: '#C46E52',
    calculateDate: (year, month) => getLastDayOfWeek(year, month, 0)
  }
];

const MONTH_NAMES_NO = [
  'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
];

const WEEKDAY_NAMES_NO = ['Mån', 'Tys', 'Ons', 'Tor', 'Fre', 'Lau', 'Søn'];

export const renderEventIcon = (eventId: string, className = "w-4 h-4") => {
  switch (eventId) {
    case 'strikkekafe':
      return <Coffee className={className} />;
    case 'dartkveld':
      return <Target className={className} />;
    case 'sjakksondag':
      return <Crown className={className} />;
    case 'lonningstreff':
      return <Coins className={className} />;
    case 'naeringslivsmingling':
      return <Briefcase className={className} />;
    case 'after-run':
    case 'after-run-2026':
      return <Footprints className={className} />;
    case 'kviss':
    case 'foerstejuledagskviss-2026':
    case 'mannsdagsquiz-2026':
      return <HelpCircle className={className} />;
    case 'brettspelkveld':
      return <Dices className={className} />;
    case 'husnes-jazzklubb-45aar-2026':
    case 'the-real-thing-2026':
    case 'the-real-things-2026':
    case 'moondance-2026':
    case 'torill-aurora-band-2026':
    case 'allsongbingo-2026':
    case 'pubkor-2026':
    case 'dansn-2026':
      return <Music className={className} />;
    case 'tv-aksjonen-2026':
    case 'juletradisjonar-ons-2026':
    case 'juletradisjonar-fre-2026':
    case 'juletradisjonar-lau-2026':
    case 'juletradisjonar-son-2026':
    case 'juletradisjonar-2026':
      return <Sparkles className={className} />;
    case 'hurtigsjakk-2026':
      return <Crown className={className} />;
    case 'boklansering-maria-2026':
    case 'boklansering-2026':
    case 'eit-slags-arrangement-anders-totland-2026':
      return <BookOpen className={className} />;
    default:
      return <CalendarIcon className={className} />;
  }
};

const EventsHubSection: React.FC = () => {
  const { isChristmas } = useSeason();
  const detailsRef = useRef<HTMLDivElement>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedVipps, setCopiedVipps] = useState(false);

  // Live clock: keeps today up to date automatically as time moves
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    // Check every minute to automatically grey out days as midnight passes
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const todayYear = now.getFullYear();
  const todayMonth = now.getMonth();
  const todayDate = now.getDate();
  const todayMidnight = useMemo(
    () => new Date(todayYear, todayMonth, todayDate).getTime(),
    [todayYear, todayMonth, todayDate]
  );
  const today = now;

  const [currentDate, setCurrentDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Selected day & event
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  // Combine headline program + recurring micro events for current month
  const allMonthEvents = useMemo(() => {
    const events: UnifiedCalendarEvent[] = [];

    // 1. Program Events
    INITIAL_PROGRAM_EVENTS.forEach((prog) => {
      const start = new Date(prog.startDate);
      const end = new Date(prog.endDate);
      const currentMonthStart = new Date(year, month, 1);
      const currentMonthEnd = new Date(year, month + 1, 0, 23, 59, 59);

      if (start <= currentMonthEnd && end >= currentMonthStart) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let d = 1; d <= daysInMonth; d++) {
          const dayStart = new Date(year, month, d, 0, 0, 0, 0);
          const dayEnd = new Date(year, month, d, 23, 59, 59, 999);
          if (dayEnd >= start && dayStart <= end) {
            events.push({
              id: prog.id,
              title: prog.title,
              category: prog.category || 'Kulturprogram',
              eventType: 'program',
              time: prog.time,
              doorsOpen: prog.doorsOpen || '12:00',
              status: prog.status,
              price: prog.price,
              image: prog.image,
              registrationLink: prog.registrationLink,
              buttonLabel: prog.buttonLabel,
              vippsNumber: prog.vippsNumber,
              isFull: prog.isFull,
              description: prog.description,
              badgeColor: '#C46E52',
              ruleDescription: prog.dateDisplay,
              day: d,
              date: new Date(year, month, d),
              dateString: `${d}. ${MONTH_NAMES_NO[month].toLowerCase()} ${year}`
            });
          }
        }
      }
    });

    // 2. Micro Events
    MICRO_EVENT_RULES.forEach((rule) => {
      const day = rule.calculateDate(year, month);
      if (day !== null) {
        // Enforce pub rule: Never 2 events at the same time / on the same day.
        // Program events take precedence over recurring micro-events.
        if (!rule.allowSameDayAsProgram && events.some(e => e.day === day)) {
          return;
        }
        events.push({
          id: rule.id,
          title: rule.title,
          category: rule.category === 'sosialt' ? 'Sosialt samver' : rule.category === 'konkurranse' ? 'Konkurranse' : 'Nettverk',
          eventType: 'micro',
          time: rule.time,
          doorsOpen: rule.doorsOpen || '12:00',
          price: rule.price,
          status: rule.price === 'Påmelding' ? 'Billett' : 'Gratis',
          registrationLink: rule.id === 'kviss'
            ? (year === 2026 && month === 9
                ? 'https://event.checkin.no/231733/quiz-pa-stoyperiet-onsdag-28-oktober'
                : year === 2026 && month === 10
                ? 'https://event.checkin.no/233631/quiz-pa-stoyperiet-onsdag-25-november'
                : undefined)
            : rule.registrationLink,
          registrationNote: rule.registrationNote,
          description: rule.description,
          badgeColor: rule.badgeColor,
          ruleDescription: rule.ruleDescription,
          day,
          date: new Date(year, month, day),
          dateString: `${day}. ${MONTH_NAMES_NO[month].toLowerCase()} ${year}`
        });
      }
    });

    return events.sort((a, b) => a.day - b.day);
  }, [year, month]);

  // Group events by day
  const eventsByDay = useMemo(() => {
    const map = new Map<number, UnifiedCalendarEvent[]>();
    allMonthEvents.forEach((item) => {
      const existing = map.get(item.day) || [];
      existing.push(item);
      map.set(item.day, existing);
    });
    return map;
  }, [allMonthEvents]);

  // Default selected day resolution: today if in current month, or next upcoming event day, or first event
  useEffect(() => {
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    if (isCurrentMonth) {
      // Find event today or upcoming
      const upcoming = allMonthEvents.find(e => e.day >= today.getDate());
      if (upcoming) {
        setSelectedDay(upcoming.day);
        setSelectedEventId(upcoming.id);
      } else {
        setSelectedDay(today.getDate());
        setSelectedEventId(null);
      }
    } else if (allMonthEvents.length > 0) {
      setSelectedDay(allMonthEvents[0].day);
      setSelectedEventId(allMonthEvents[0].id);
    } else {
      setSelectedDay(1);
      setSelectedEventId(null);
    }
  }, [year, month, today, allMonthEvents]);

  // Active event resolution
  const activeEvent = useMemo(() => {
    if (selectedDay !== null) {
      const events = eventsByDay.get(selectedDay);
      if (!events || events.length === 0) return null;
      if (selectedEventId) {
        const matched = events.find(e => e.id === selectedEventId);
        if (matched) return matched;
      }
      return events[0];
    }
    return null;
  }, [selectedDay, selectedEventId, eventsByDay]);

  const selectedDayEvents = useMemo(() => {
    if (selectedDay === null) return [];
    return eventsByDay.get(selectedDay) || [];
  }, [selectedDay, eventsByDay]);

  // Pub opening hours helper
  const getPubHoursForDay = (dayOfWeek: number) => {
    switch (dayOfWeek) {
      case 3: // Onsdag
        return { isOpen: true, hours: '12:00—22:00', label: 'Onsdagsopning' };
      case 5: // Fredag
        return { isOpen: true, hours: '12:00—00:00', label: 'Fredagskveld' };
      case 6: // Laurdag
        return { isOpen: true, hours: '12:00—00:00', label: 'Laurdagskveld' };
      case 0: // Søndag
        return { isOpen: true, hours: '12:00—22:00', label: 'Søndagsopning' };
      default:
        return { isOpen: false, hours: 'Stengt', label: 'Stengt (Ope ons, fre, lau, søn)' };
    }
  };

  const selectedDayInfo = useMemo(() => {
    if (selectedDay === null) return null;
    const date = new Date(year, month, selectedDay);
    const dayOfWeek = date.getDay();
    const pubStatus = getPubHoursForDay(dayOfWeek);
    const cellMidnight = new Date(year, month, selectedDay).getTime();
    const isPast = cellMidnight < todayMidnight;
    const isToday = cellMidnight === todayMidnight;
    return {
      day: selectedDay,
      date,
      dateString: `${selectedDay}. ${MONTH_NAMES_NO[month].toLowerCase()} ${year}`,
      dayName: ['Søndag', 'Måndag', 'Tysdag', 'Onsdag', 'Torsdag', 'Fredag', 'Laurdag'][dayOfWeek],
      isPast,
      isToday,
      ...pubStatus
    };
  }, [selectedDay, year, month, todayMidnight]);

  // Calendar cells matrix
  const calendarCells = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const leadingEmptyDays = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const cells: Array<{
      day: number;
      date?: Date;
      isCurrentMonth: boolean;
      isToday?: boolean;
      isPast?: boolean;
      events?: UnifiedCalendarEvent[];
      isSelected?: boolean;
      pubStatus?: { isOpen: boolean; hours: string; label: string };
    }> = [];

    // Leading days from previous month
    for (let i = leadingEmptyDays - 1; i >= 0; i--) {
      cells.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        isPast: true
      });
    }

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      const cellMidnight = cellDate.getTime();
      const isToday = cellMidnight === todayMidnight;
      const isPast = cellMidnight < todayMidnight;
      const events = eventsByDay.get(day) || [];
      const isSelected = selectedDay === day;
      const dayOfWeek = cellDate.getDay();
      const pubStatus = getPubHoursForDay(dayOfWeek);

      cells.push({
        day,
        date: cellDate,
        isCurrentMonth: true,
        isToday,
        isPast,
        events,
        isSelected,
        pubStatus
      });
    }

    // Trailing days for grid balance
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      cells.push({
        day: i,
        isCurrentMonth: false,
        isPast: false
      });
    }

    return cells;
  }, [year, month, eventsByDay, selectedDay, todayMidnight]);

  // Handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleCurrentMonth = () => {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDay(today.getDate());
  };

  // Body overflow lock when mobile modal is open
  useEffect(() => {
    if (isMobileModalOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isMobileModalOpen]);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectDay = (day: number, eventId?: string) => {
    setSelectedDay(day);
    if (eventId) {
      setSelectedEventId(eventId);
    } else {
      const events = eventsByDay.get(day);
      if (events && events.length > 0) {
        setSelectedEventId(events[0].id);
      } else {
        setSelectedEventId(null);
      }
    }
    // On tablet and mobile (< 1024px), open the card in front of the calendar
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsMobileModalOpen(true);
    }
  };

  const handleSelectAgendaEvent = (item: UnifiedCalendarEvent) => {
    setSelectedDay(item.day);
    setSelectedEventId(item.id);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsMobileModalOpen(true);
    } else if (detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const copyShareLink = () => {
    const url = window.location.origin + window.location.pathname + '#program';
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyVipps = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedVipps(true);
    setTimeout(() => setCopiedVipps(false), 2000);
  };

  const getGoogleCalendarUrl = (item: UnifiedCalendarEvent) => {
    const title = encodeURIComponent(`${item.title} – Støyperiet Pub`);
    const details = encodeURIComponent(`${item.description}\n\nStøyperiet Pub, Sentrumsvegen 41, 5460 Husnes`);
    const location = encodeURIComponent('Støyperiet Pub, Sentrumsvegen 41, 5460 Husnes');
    const hasDigits = /^\d/.test(item.time);
    const startTimeStr = hasDigits ? item.time.split('–')[0].replace(':', '').trim() : '1200';
    const endTimeStr = hasDigits && item.time.includes('–') ? item.time.split('–')[1].replace(':', '').trim() : '2200';
    const yStr = item.date.getFullYear().toString();
    const mStr = (item.date.getMonth() + 1).toString().padStart(2, '0');
    const dStr = item.day.toString().padStart(2, '0');
    const startIso = `${yStr}${mStr}${dStr}T${startTimeStr.padEnd(4, '0')}00`;
    const endIso = `${yStr}${mStr}${dStr}T${endTimeStr.padEnd(4, '0')}00`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startIso}/${endIso}`;
  };

  const handleDownloadIcs = (item: UnifiedCalendarEvent) => {
    const yStr = item.date.getFullYear().toString();
    const mStr = (item.date.getMonth() + 1).toString().padStart(2, '0');
    const dStr = item.day.toString().padStart(2, '0');
    const hasDigits = /^\d/.test(item.time);
    const startTimeStr = (hasDigits ? item.time.split('–')[0].replace(':', '').trim() : '1200').padEnd(4, '0');
    const endTimeStr = (hasDigits && item.time.includes('–') ? item.time.split('–')[1].replace(':', '').trim() : '2200').padEnd(4, '0');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Støyperiet Pub//Arrangement//NO',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:${item.title} på Støyperiet`,
      `DESCRIPTION:${item.description}`,
      `LOCATION:Støyperiet Pub\\, Sentrumsvegen 41\\, 5460 Husnes`,
      `DTSTART:${yStr}${mStr}${dStr}T${startTimeStr}00`,
      `DTEND:${yStr}${mStr}${dStr}T${endTimeStr}00`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${item.id}-stoyperiet.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderDetailsCard = (isModal = false, onClose?: () => void) => (
    <div className="space-y-4 sm:space-y-6">
      {/* Card Header: Selected Date & Pub Status */}
      <div className="border-b-2 border-white/10 pb-4 sm:pb-5 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[#C46E52] text-white px-2.5 py-1 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              {selectedDayInfo?.dayName || 'VALD DATO'}
            </span>
            {selectedDayInfo?.isToday && (
              <span className="bg-emerald-500 text-black px-2 py-0.5 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                I DAG
              </span>
            )}
            {selectedDayInfo?.isPast && (
              <span className="bg-white/10 text-white/50 px-2 py-0.5 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-white/10">
                Passert dato
              </span>
            )}
            <span className={`font-mono text-xs sm:text-sm font-bold uppercase ${
              selectedDayInfo?.isPast
                ? 'text-white/40'
                : selectedDayInfo?.isOpen ? 'text-emerald-400' : 'text-white/50'
            }`}>
              {selectedDayInfo?.isOpen 
                ? (selectedDayInfo?.isPast ? `Var ope: ${selectedDayInfo.hours}` : `Ope: ${selectedDayInfo.hours}`) 
                : 'Stengt kvardag'}
            </span>
          </div>
          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Lukk detaljar"
              className="px-3 py-1.5 bg-black/70 hover:bg-[#C46E52] border border-white/20 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <span>LUKK</span>
              <span className="text-base leading-none">✕</span>
            </button>
          )}
        </div>
        <h3 className="font-mono font-bold uppercase text-white tracking-tight text-2xl sm:text-3xl">
          {selectedDayInfo?.dateString}
        </h3>
      </div>

      {/* If day has events */}
      {activeEvent ? (
        <div className="space-y-5 sm:space-y-6">
          {/* Multiple events switcher on this day */}
          {selectedDayEvents.length > 1 && (
            <div className="bg-black/50 border border-[#C46E52]/40 p-3 sm:p-4 space-y-2.5">
              <div className="font-mono text-xs uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C46E52]"></span>
                <span>{selectedDayEvents.length} arrangement denne datoen:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedDayEvents.map((ev) => {
                  const isCurrentActive = activeEvent.id === ev.id;
                  return (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => setSelectedEventId(ev.id)}
                      className={`flex items-center gap-2 p-2.5 text-left font-mono text-xs font-bold uppercase transition-all border cursor-pointer ${
                        isCurrentActive
                          ? 'bg-[#C46E52] text-white border-[#C46E52] ring-1 ring-white/30'
                          : 'bg-white/10 text-white/90 border-white/20 hover:bg-white/20'
                      }`}
                    >
                      <div className="shrink-0">{renderEventIcon(ev.id, "w-3.5 h-3.5")}</div>
                      <span className="truncate">{ev.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Category and Title */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs sm:text-sm text-[#E3A08B] uppercase font-bold">
                // {activeEvent.category}
              </span>
              {activeEvent.status && (
                <span className={`px-2 py-0.5 font-mono text-[11px] font-bold uppercase border ${
                  activeEvent.status === 'Gratis'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                    : activeEvent.status === 'Billett'
                    ? 'bg-[#C46E52]/20 text-[#E3A08B] border-[#C46E52]'
                    : activeEvent.status === 'Utsolgt' || activeEvent.status === 'Utselt' || activeEvent.status === 'Utseld'
                    ? 'bg-red-950 text-red-300 border-red-500/30'
                    : 'bg-amber-950 text-amber-300 border-amber-500/30'
                }`}>
                  {activeEvent.status}
                </span>
              )}
            </div>
            <h4 className="font-heading uppercase text-white tracking-tight leading-tight text-2xl sm:text-3xl md:text-4xl break-words">
              {activeEvent.title}
            </h4>
          </div>


          {/* Time & Doors Box */}
          <div className="bg-black/60 border border-white/15 font-mono text-white p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Clock className="w-4 h-4 text-[#C46E52] shrink-0" />
              <span className="text-[#E3A08B] font-bold uppercase text-xs">
                START / TIDSPUNKT:
              </span>
              <span className="font-bold text-white text-sm sm:text-base">
                {/^\d/.test(activeEvent.time) ? `Kl. ${activeEvent.time}` : activeEvent.time}
              </span>
            </div>
            {activeEvent.doorsOpen && (
              <div className="flex items-center gap-1.5 text-xs text-white/75 font-mono">
                <span className="text-white/50">Dører opnar:</span>
                <span className="text-white font-bold">{activeEvent.doorsOpen}</span>
              </div>
            )}
            {activeEvent.price && (
              <span className="font-mono text-xs sm:text-sm text-white/80 bg-white/10 px-2.5 py-0.5 border border-white/10">
                {activeEvent.price}
              </span>
            )}
          </div>

          {/* Full Description - never cut off or clamped */}
          <div className="text-[#F5EBE1] text-sm sm:text-base leading-relaxed break-words whitespace-pre-line py-1">
            {activeEvent.description}
          </div>

          {/* Vipps Box if applicable */}
          {activeEvent.vippsNumber && (
            <div className="p-4 bg-[#FF5B24]/20 border-2 border-[#FF5B24] text-white space-y-2.5">
              <div className="font-mono text-xs font-bold uppercase text-[#FF855C]">Billett via Vipps:</div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="font-mono text-lg sm:text-xl font-bold">Vipps: {activeEvent.vippsNumber}</div>
                <button
                  type="button"
                  onClick={() => copyVipps(activeEvent.vippsNumber!)}
                  className="px-3.5 py-1.5 bg-[#FF5B24] hover:bg-white hover:text-black font-mono text-xs uppercase font-bold transition-all flex items-center gap-1.5 cursor-pointer text-white"
                >
                  {copiedVipps ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedVipps ? 'KOPIERT!' : 'KOPIER VIPPS'}</span>
                </button>
              </div>
            </div>
          )}

          {/* External Action Button (Facebook / Checkin / Registration) */}
          {activeEvent.registrationLink && (
            <div>
              <a
                href={activeEvent.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between w-full bg-[#C46E52] hover:bg-white hover:text-black text-white font-mono font-bold uppercase tracking-wider transition-all shadow-md p-3.5 sm:p-4 text-sm sm:text-base"
              >
                <span className="flex items-center gap-2">
                  <Ticket className="w-4 h-4" />
                  <span>{activeEvent.buttonLabel || 'Sjå billett & påmelding'}</span>
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          )}

          {/* Calendar Export Links */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-3">
            <a
              href={getGoogleCalendarUrl(activeEvent)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 bg-black/40 hover:bg-[#C46E52] border border-white/20 text-white font-mono uppercase font-bold transition-colors py-2 px-3 text-xs"
            >
              <CalendarIcon className="w-3.5 h-3.5 text-[#E3A08B]" />
              <span>Google Kalender</span>
            </a>
            <button
              type="button"
              onClick={() => handleDownloadIcs(activeEvent)}
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 bg-black/40 hover:bg-[#C46E52] border border-white/20 text-white font-mono uppercase font-bold transition-colors cursor-pointer py-2 px-3 text-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#E3A08B]" />
              <span>Last ned .ics</span>
            </button>
          </div>
        </div>
      ) : (
        /* No special event on selected day */
        <div className="space-y-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black/50 border border-white/20 flex items-center justify-center text-[#C46E52] shrink-0">
              <Coffee className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h4 className="font-heading uppercase text-white tracking-tight text-xl sm:text-2xl md:text-3xl">
              {selectedDayInfo?.isOpen ? 'VANLEG OPEN PUBKVELD' : 'STENGT DENNE DAGEN'}
            </h4>
          </div>
          <p className="text-white/90 text-sm sm:text-base leading-relaxed break-words">
            {selectedDayInfo?.isOpen 
              ? 'Det er ingen særskilte arrangement denne datoen, men dørene våre er opne! Kom innom for noko godt i glaset, brettspel og god drøs.'
              : 'Puben held stengt denne kvardagen. Våre faste opningsdagar er onsdag, fredag, laurdag og søndag. Sjå månadens hendingar i lista under!'}
          </p>

          {selectedDayInfo?.isOpen && (
            <div className="bg-black/40 border border-white/10 font-mono text-xs sm:text-sm p-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[#E3A08B] font-bold uppercase">Opningstid:</span>
                <span className="text-white font-bold">{selectedDayInfo.hours}</span>
              </div>
              <div className="text-white/60 text-xs">20+ etter kl. 19:00</div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <section 
      id="program" 
      className="bg-[#1A1A1A] text-[#C9BBAF] py-24 md:py-36 px-4 sm:px-6 relative overflow-hidden section-divider scroll-mt-24" 
      data-is-dark="true"
    >
      {/* Anchor targets for backward compatibility */}
      <div id="kalender" className="-translate-y-36 invisible pointer-events-none" />
      <div id="mikroarrangement" className="-translate-y-36 invisible pointer-events-none" />

      {/* Industrial background halftone texture */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#C46E52 2px, transparent 2px)', backgroundSize: '16px 16px' }}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12 pb-8 border-b-2 border-white/10">
          <div className="space-y-4 max-w-3xl">
            <div className="bg-[#C46E52] text-white px-4 py-1 font-mono text-[11px] uppercase tracking-widest inline-block font-bold">
              LOG_04: KALENDER & PROGRAM
            </div>
            <h2 className="font-heading text-5xl sm:text-7xl md:text-8xl uppercase leading-none text-white tracking-tighter">
              KVA SKJER PÅ <br />
              <span className="text-[#C46E52] riso-print" data-text="STØYPERIET">STØYPERIET</span>
            </h2>
            <p className="text-base sm:text-lg opacity-85 max-w-2xl leading-relaxed text-[#F5EBE1]">
              Her finn du alt som skjer på puben samla på éin stad – konsertar, quiz, dart, strikkekafé, boklansering og opningsdagar. Trykk på ein dato i kalenderen eller vel frå oversikta over hendingar under!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={copyShareLink}
              className="px-4 py-2 border border-white/20 hover:border-[#C46E52] text-white font-mono text-xs uppercase font-bold flex items-center gap-2 transition-all bg-black/40 cursor-pointer"
              title="Del kalenderlenke"
            >
              <Share2 className="w-3.5 h-3.5 text-[#C46E52]" />
              <span>{copiedLink ? 'LENKE KOPIERT!' : 'DEL LENKE'}</span>
            </button>
          </div>
        </div>

        {/* Unified Calendar & Selected Day Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* LEFT: Calendar Grid (7 cols on desktop) */}
          <div className="lg:col-span-7 bg-[#242424] border-2 border-white/10 p-4 sm:p-7 shadow-2xl relative">
            {/* Julenissehatt på øvre høgre hjørne av kalenderen */}
            {isChristmas && (
              <div 
                className="absolute -top-6 -right-3 sm:-top-8 sm:-right-5 md:-top-10 md:-right-6 z-20 pointer-events-none select-none transition-transform"
                title="God jul frå Støyperiet!"
              >
                <SantaHat className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20" />
              </div>
            )}
            
            {/* Month Navigator Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C46E52] text-white flex items-center justify-center font-bold">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#C46E52] font-bold block">
                    MÅNADSOVERSIKT
                  </span>
                  <h3 className="font-mono text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white leading-none">
                    {MONTH_NAMES_NO[month]} <span className="text-[#C46E52]">{year}</span>
                  </h3>
                </div>
              </div>

              {/* Month Navigation Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCurrentMonth}
                  className="px-3.5 py-2 font-mono text-xs uppercase font-bold border border-white/20 hover:border-[#C46E52] hover:text-[#C46E52] bg-black/30 transition-colors cursor-pointer"
                  title="Gå til noverande månad"
                >
                  I DAG
                </button>
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  aria-label="Førre månad"
                  className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-[#C46E52] hover:border-[#C46E52] hover:text-white transition-all cursor-pointer bg-black/30"
                  title="Førre månad"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  aria-label="Neste månad"
                  className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-[#C46E52] hover:border-[#C46E52] hover:text-white transition-all cursor-pointer bg-black/30"
                  title="Neste månad"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Month Selector Tabs */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
              {[
                { name: 'Oktober 2026', m: 9, y: 2026 },
                { name: 'November 2026', m: 10, y: 2026 },
                { name: 'Desember 2026', m: 11, y: 2026 },
              ].map((item) => {
                const isActive = year === item.y && month === item.m;
                return (
                  <button
                    key={`${item.y}-${item.m}`}
                    type="button"
                    onClick={() => {
                      setCurrentDate(new Date(item.y, item.m, 1));
                      setSelectedDay(null);
                      setSelectedEventId(null);
                    }}
                    className={`px-3 py-1.5 font-mono text-xs font-bold uppercase transition-all border cursor-pointer ${
                      isActive
                        ? 'bg-[#C46E52] text-white border-[#C46E52] shadow-sm'
                        : 'bg-black/40 text-white/70 border-white/15 hover:border-white/40 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
              {WEEKDAY_NAMES_NO.map((dayName, idx) => (
                <div 
                  key={idx} 
                  className={`font-mono text-[11px] sm:text-xs uppercase font-bold py-1.5 ${
                    idx === 4 || idx === 5 || idx === 6 ? 'text-[#E3A08B]' : 'opacity-60 text-white'
                  }`}
                >
                  {dayName}
                </div>
              ))}
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {calendarCells.map((cell, idx) => {
                if (!cell.isCurrentMonth) {
                  return (
                    <div 
                      key={idx} 
                      className="min-h-[72px] sm:min-h-[88px] p-1.5 sm:p-2 border border-white/5 bg-black/40 opacity-20 flex flex-col justify-between select-none"
                    >
                      <span className="font-mono text-xs text-white/40">{cell.day}</span>
                    </div>
                  );
                }

                const hasEvents = cell.events && cell.events.length > 0;
                const isSelected = selectedDay === cell.day;
                const isOpen = cell.pubStatus?.isOpen;
                const isPast = cell.isPast;
                const isToday = cell.isToday;

                return (
                  <div
                    key={idx}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectDay(cell.day)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectDay(cell.day); }}
                    className={`min-h-[72px] sm:min-h-[88px] p-1.5 sm:p-2 border transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden select-none text-left ${
                      isSelected
                        ? isPast
                          ? 'border-[#C46E52]/70 bg-[#242120] ring-1 ring-[#C46E52]/40 z-10 shadow-md'
                          : 'border-[#C46E52] bg-[#2F2926] ring-2 ring-[#C46E52] z-10 shadow-lg'
                        : isPast
                        ? 'border-white/5 bg-black/50 opacity-40 grayscale hover:opacity-75 hover:border-white/20'
                        : hasEvents
                        ? 'border-[#C46E52]/60 bg-[#2A2422] hover:border-[#C46E52] hover:bg-[#342A27]'
                        : isOpen
                        ? 'border-white/15 bg-black/40 hover:border-white/40 hover:bg-black/60'
                        : 'border-white/5 bg-black/20 opacity-60 hover:opacity-100 hover:border-white/20'
                    }`}
                  >
                    {/* Top Row: Day Number + Status Dots */}
                    <div className="flex items-center justify-between">
                      <span className={`font-mono text-xs sm:text-sm font-bold ${
                        isSelected 
                          ? isPast ? 'text-[#E3A08B]/80 font-bold' : 'text-[#E3A08B] font-black' 
                          : isToday 
                          ? 'text-white bg-[#C46E52] px-1.5 py-0.2 rounded-xs shadow-xs' 
                          : isPast
                          ? 'text-white/40'
                          : 'text-white'
                      }`}>
                        {cell.day}
                      </span>

                      {/* Pub Open indicator dot */}
                      {isOpen && (
                        <span 
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isPast ? 'bg-emerald-500/30' : 'bg-emerald-400'
                          }`} 
                          title={isPast ? 'Puben var open' : 'Puben er open i kveld'} 
                        />
                      )}
                    </div>

                    {/* Middle: Event Indicators / Badges */}
                    <div className="space-y-1 my-1">
                      {hasEvents && cell.events!.slice(0, 2).map((ev) => (
                        <div
                          key={ev.id}
                          className={`px-1 py-0.5 font-mono text-[9px] sm:text-[10px] font-bold uppercase truncate flex items-center gap-1 shadow-xs ${
                            isPast
                              ? 'bg-zinc-800 text-zinc-400 border border-zinc-700/60 line-through decoration-zinc-500/50'
                              : 'bg-[#C46E52] text-white'
                          }`}
                          title={`${ev.title} (${ev.time})${isPast ? ' – Passert' : ''}`}
                        >
                          <span className="shrink-0">{renderEventIcon(ev.id, "w-2.5 h-2.5")}</span>
                          <span className="truncate">{ev.title}</span>
                        </div>
                      ))}
                      {hasEvents && cell.events!.length > 2 && (
                        <div className={`font-mono text-[8px] font-bold text-center ${
                          isPast ? 'text-zinc-500' : 'text-[#E3A08B]'
                        }`}>
                          +{cell.events!.length - 2} meir
                        </div>
                      )}
                    </div>

                    {/* Bottom: Sub-label */}
                    <div className={`font-mono text-[8px] truncate ${isPast ? 'text-white/30' : 'text-white/50'}`}>
                      {isOpen ? cell.pubStatus?.hours : (hasEvents ? '' : 'Stengt')}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calendar Legend / Guide */}
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-white/70">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-[#C46E52] inline-block"></span>
                  <span>Arrangement</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                  <span>Puben open</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-zinc-800 border border-white/10 opacity-60 inline-block"></span>
                  <span>Passerte dagar (gråa ut)</span>
                </div>
              </div>
              <div className="text-[11px] text-[#E3A08B]">
                {allMonthEvents.length} arrangement i {MONTH_NAMES_NO[month].toLowerCase()}
              </div>
            </div>

          </div>

          {/* RIGHT: Selected Day Details Card (5 cols on desktop, hidden on tablet and mobile) */}
          <div ref={detailsRef} className="hidden lg:block lg:col-span-5 scroll-mt-28">
            <div className="bg-[#262626] border-2 border-white/15 p-6 sm:p-8 shadow-2xl relative">
              {renderDetailsCard(false)}
            </div>
          </div>

        </div>

        {/* Mobile & Tablet Modal Popup rendered via Portal to document.body */}
        {isMobileModalOpen && typeof document !== 'undefined' && createPortal(
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md animate-fade-in"
            onClick={() => setIsMobileModalOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <div 
              className="bg-[#242424] border-2 border-[#C46E52] p-5 sm:p-7 md:p-8 shadow-2xl relative w-full max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto overscroll-contain text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {renderDetailsCard(true, () => setIsMobileModalOpen(false))}

              {/* Easy-to-tap close button at the bottom for mobile/tablet */}
              <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsMobileModalOpen(false)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-black/60 hover:bg-[#C46E52] border border-white/20 hover:border-[#C46E52] text-white font-mono text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer text-center"
                >
                  LUKK VINDU ✕
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* BOTTOM: "Hendingar i denne månaden" — Full Month Chronological Agenda */}
        <div className="bg-[#242424] border-2 border-white/10 p-6 sm:p-10 shadow-2xl relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b-2 border-white/10">
            <div>
              <h3 className="font-mono text-2xl sm:text-3xl font-bold uppercase text-white tracking-tight">
                Hendingar i {MONTH_NAMES_NO[month].toLowerCase()} {year}
              </h3>
            </div>
            <span className="bg-black/60 border border-white/20 text-[#E3A08B] font-mono text-xs px-3.5 py-1.5 font-bold uppercase tracking-wider">
              {allMonthEvents.length} arrangement
            </span>
          </div>

          {allMonthEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {allMonthEvents.map((item) => {
                const isSelected = selectedDay === item.day && selectedEventId === item.id;
                const dateObj = new Date(year, month, item.day);
                const dayName = ['Søndag', 'Måndag', 'Tysdag', 'Onsdag', 'Torsdag', 'Fredag', 'Laurdag'][dateObj.getDay()];
                const isPast = dateObj.getTime() < todayMidnight;

                return (
                  <button
                    key={`${item.id}-${item.day}`}
                    type="button"
                    onClick={() => handleSelectAgendaEvent(item)}
                    className={`p-4 border-2 text-left transition-all flex items-start gap-4 group cursor-pointer ${
                      isSelected
                        ? 'bg-[#2F2926] border-[#C46E52] shadow-lg ring-2 ring-[#C46E52]/40'
                        : isPast
                        ? 'bg-black/20 border-white/5 opacity-50 grayscale hover:opacity-85 hover:border-white/20'
                        : 'bg-black/40 border-white/10 hover:border-[#C46E52] hover:bg-black/60'
                    }`}
                  >
                    {/* Date Badge */}
                    <div className={`w-14 sm:w-16 h-14 sm:h-16 flex flex-col items-center justify-center font-mono shrink-0 border ${
                      isSelected
                        ? 'bg-[#C46E52] text-white border-[#C46E52]'
                        : isPast
                        ? 'bg-[#151515] text-white/50 border-white/10'
                        : 'bg-[#1E1E1E] text-white border-white/15 group-hover:border-[#C46E52]'
                    }`}>
                      <span className="text-xl sm:text-2xl font-black leading-none">{item.day}</span>
                      <span className="text-[9px] uppercase tracking-wider opacity-80">{MONTH_NAMES_NO[month].slice(0, 3)}</span>
                    </div>

                    {/* Event Content */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] text-[#E3A08B] font-bold uppercase tracking-wider">
                          {dayName} · {/^\d/.test(item.time) ? `Kl. ${item.time}` : item.time}
                        </span>
                        {isPast ? (
                          <span className="font-mono text-[9px] px-1.5 py-0.2 uppercase font-bold bg-white/5 text-white/50 border border-white/10">
                            Passert
                          </span>
                        ) : item.status ? (
                          <span className="font-mono text-[9px] px-1.5 py-0.2 uppercase font-bold bg-white/10 text-white border border-white/10">
                            {item.status}
                          </span>
                        ) : null}
                      </div>

                      <h4 className="font-mono text-base sm:text-lg font-bold text-white tracking-tight uppercase group-hover:text-[#E3A08B] transition-colors leading-snug">
                        {item.title}
                      </h4>

                      <p className="text-xs sm:text-sm text-[#F5EBE1]/85 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="shrink-0 self-center text-white/40 group-hover:text-[#C46E52] group-hover:translate-x-1 transition-all">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <Info className="w-8 h-8 text-[#C46E52] mx-auto opacity-60" />
              <h4 className="font-mono text-lg font-bold uppercase text-white">
                Ingen særskilte arrangement lagt inn enno for {MONTH_NAMES_NO[month].toLowerCase()}
              </h4>
              <p className="text-sm text-white/70 max-w-md mx-auto">
                Puben held vanleg ope på onsdagar, fredagar, laurdagar og søndagar. Følg med for nye konsertar og hendingar!
              </p>
            </div>
          )}

          {/* Quick note at the bottom */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-white/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C46E52] inline-block"></span>
              <span>Trykk på eit arrangement eller ein dato for full info, klokkeslett og billettlenker</span>
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              className="text-[#E3A08B] hover:text-white font-bold flex items-center gap-1.5 cursor-pointer uppercase transition-colors"
            >
              <span>Sjå neste månad ({MONTH_NAMES_NO[(month + 1) % 12]})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default EventsHubSection;
