// Programdata for Støyperiet. Brukt både av nettsida og av byggesteget
// som lagar strukturerte data (schema.org) og llms.txt for søkjemotorar og KI.
// Endrar du programmet, gjer det her.

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
  // In December 2026 every Friday is taken (juleshow 4, Moondance 11, mingling 18, førstejuledagskviss 25),
  // so Lønningstreff is on Saturday Dec 12
  if (year === 2026 && month === 11) return 12;

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
    calculateDate: (year, month) => {
      // In December 2026, Sunday 6th is the juleshow extra show, so Strikkekafé is moved to Sunday 20th
      if (year === 2026 && month === 11) return 20;
      return getNthDayOfWeek(year, month, 0, 1);
    }
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
    calculateDate: (year, month) => {
      // In December 2026, Wednesday 2nd is the juleshow, so Dartkveld is moved to Wednesday 9th
      if (year === 2026 && month === 11) return 9;
      return getNthDayOfWeek(year, month, 3, 1);
    }
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
    calculateDate: (year, month) => {
      // In October 2026, Friday 30th is dedicated to Pubkor, so mingling is on Friday 23rd
      if (year === 2026 && month === 9) return 23;
      // In November 2026, Friday 27th is the Torill Aurora Band concert, so mingling is moved to Saturday 28th
      if (year === 2026 && month === 10) return 28;
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
