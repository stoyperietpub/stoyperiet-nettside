// Lagar maskinlesbar informasjon om Støyperiet kvar gong nettsida blir bygd:
//  - strukturerte data (schema.org JSON-LD) for Google, Bing og KI-tenester
//  - llms.txt: ei rein tekstfil med det viktigaste, for KI-assistentar
//  - statisk HTML med programmet, for robotar som ikkje køyrer JavaScript
//  - sitemap.xml med oppdatert dato
// Alt blir henta frå data/events.ts, så programmet treng berre oppdaterast der.
//
// Merk alkohollova § 9-2: her skal det ikkje stå noko som marknadsfører alkohol.
// Vekta ligg på arrangement, kultur og møteplassen.

import { INITIAL_PROGRAM_EVENTS, MICRO_EVENT_RULES } from '../data/events';
import type { EventItem } from '../data/events';

const SITE = 'https://stoyperietpub.no';
const PUB_ID = `${SITE}/#pub`;
const ADDRESS = {
  street: 'Sentrumsvegen 41',
  postalCode: '5460',
  locality: 'Husnes',
  region: 'Kvinnherad, Vestland',
};
const EMAIL = 'post@stoyperietpub.no';
const EVENT_EMAIL = 'events@stoyperietpub.no';
const MONTHS_AHEAD = 3; // kor langt fram faste arrangement blir lista

const MONTH_NAMES = [
  'januar', 'februar', 'mars', 'april', 'mai', 'juni',
  'juli', 'august', 'september', 'oktober', 'november', 'desember',
];
const WEEKDAYS = ['sundag', 'måndag', 'tysdag', 'onsdag', 'torsdag', 'fredag', 'laurdag'];

export const DESCRIPTION =
  'Støyperiet er ein folkepub på Husnes i Kvinnherad, bygd og driven på dugnad av over 100 eldsjeler. ' +
  'Ein trygg og lett tilgjengeleg møteplass for vaksne, med konsertar, kviss, standup, boklanseringar, ' +
  'strikkekafé, sjakk, brettspel og anna som skaper kultur og fellesskap på Husnes.';

const WEEKLY_HOURS = [
  { days: ['Wednesday', 'Sunday'], opens: '12:00', closes: '22:00', text: 'Onsdag og sundag 12–22' },
  { days: ['Friday', 'Saturday'], opens: '12:00', closes: '00:00', text: 'Fredag og laurdag 12–24' },
];

// Avvikande opningstider (jul og nyttår). Lista tilsvarar components/ChristmasHoursTable.tsx.
const SPECIAL_HOURS: { date: string; opens?: string; closes?: string }[] = [
  { date: '2026-12-23' },
  { date: '2026-12-25', opens: '16:00', closes: '00:00' },
  { date: '2026-12-26', opens: '16:00', closes: '00:00' },
  { date: '2026-12-27', opens: '16:00', closes: '00:00' },
  { date: '2026-12-28' },
  { date: '2026-12-29' },
  { date: '2026-12-30', opens: '12:00', closes: '00:00' },
  { date: '2026-12-31' },
  { date: '2027-01-01' },
  { date: '2027-01-02' },
  { date: '2027-01-03' },
];

// ---------- hjelparar ----------

const pad = (n: number) => String(n).padStart(2, '0');

function lastSundayUtc(year: number, month: number): number {
  const d = new Date(Date.UTC(year, month + 1, 0));
  d.setUTCDate(d.getUTCDate() - d.getUTCDay());
  return d.getUTCDate();
}

/** Tidssone for Noreg: +02:00 om sommaren, +01:00 elles. */
function osloOffset(isoLocal: string): string {
  const [y, m, d] = isoLocal.slice(0, 10).split('-').map(Number);
  const start = Date.UTC(y, 2, lastSundayUtc(y, 2), 1);
  const end = Date.UTC(y, 9, lastSundayUtc(y, 9), 1);
  const t = Date.UTC(y, m - 1, d, 12);
  return t >= start && t < end ? '+02:00' : '+01:00';
}

const withTz = (isoLocal: string) => {
  const s = isoLocal.length === 16 ? `${isoLocal}:00` : isoLocal;
  return `${s}${osloOffset(s)}`;
};

const ymd = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

function niceDate(isoLocal: string): string {
  const [y, m, d] = isoLocal.slice(0, 10).split('-').map(Number);
  const wd = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${wd} ${d}. ${MONTH_NAMES[m - 1]} ${y}`;
}

// Gjer tekst om til éi linje, og tek bort formuleringar som peikar mot alkohol.
const clean = (s: string) =>
  s.replace(/\s*\n+\s*/g, ' ').replace(/, noko godt i glaset og/g, ' og').trim();

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function parseTimes(time: string): { start?: string; end?: string } {
  const m = time.match(/(\d{1,2})[:.](\d{2})(?:\s*[–-]\s*(\d{1,2})[:.](\d{2}))?/);
  if (!m) return {};
  return {
    start: `${pad(+m[1])}:${m[2]}`,
    end: m[3] ? `${pad(+m[3])}:${m[4]}` : undefined,
  };
}

// ---------- samle arrangementa ----------

export interface PublicEvent {
  id: string;
  name: string;
  description: string;
  start: string; // lokal ISO, utan tidssone
  end?: string;
  timeText: string;
  priceText?: string;
  price?: number;
  free: boolean;
  soldOut: boolean;
  url?: string;
  vipps?: string;
  recurring?: string;
}

function fromProgram(e: EventItem): PublicEvent {
  const soldOut = !!e.isFull || ['Utsolgt', 'Utselt', 'Utseld'].includes(e.status);
  const priceNum = e.price ? Number((e.price.match(/\d+/) || [])[0]) : undefined;
  return {
    id: e.id,
    name: e.title,
    description: clean(e.description),
    start: e.startDate.slice(0, 19),
    end: e.endDate.slice(0, 19),
    timeText: /\d/.test(e.time) ? e.time.replace(/\s*-\s*/, '–') : 'Tid kjem',
    priceText: e.status === 'Gratis' ? 'Gratis' : e.price || (e.vippsNumber ? `Billett via Vipps #${e.vippsNumber}` : undefined),
    price: e.status === 'Gratis' ? 0 : priceNum,
    free: e.status === 'Gratis',
    soldOut,
    url: e.registrationLink,
    vipps: e.vippsNumber,
  };
}

/** Alle kommande arrangement frå `now` og MONTHS_AHEAD månader fram. */
export function upcomingEvents(now: Date): PublicEvent[] {
  const todayStr = ymd(now.getFullYear(), now.getMonth(), now.getDate());
  const horizon = new Date(now.getFullYear(), now.getMonth() + MONTHS_AHEAD, 1);
  const horizonStr = ymd(horizon.getFullYear(), horizon.getMonth(), horizon.getDate());

  const program = INITIAL_PROGRAM_EVENTS
    .filter((e) => e.endDate.slice(0, 10) >= todayStr && e.startDate.slice(0, 10) < horizonStr)
    .map(fromProgram);

  // Dagar som er tekne av eit hovudarrangement (regelen: eitt arrangement per kveld)
  const takenDays = new Set<string>();
  for (const e of INITIAL_PROGRAM_EVENTS) {
    const s = new Date(e.startDate.slice(0, 10) + 'T00:00:00Z');
    const end = new Date(e.endDate.slice(0, 10) + 'T00:00:00Z');
    for (let d = s; d <= end; d = new Date(d.getTime() + 864e5)) takenDays.add(d.toISOString().slice(0, 10));
  }

  const closedDays = new Set(SPECIAL_HOURS.filter((s) => !s.opens).map((s) => s.date));

  const micro: PublicEvent[] = [];
  for (let i = 0; i < MONTHS_AHEAD; i++) {
    const first = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const y = first.getFullYear();
    const m = first.getMonth();
    for (const rule of MICRO_EVENT_RULES) {
      const day = rule.calculateDate(y, m);
      if (day === null) continue;
      const date = ymd(y, m, day);
      if (date < todayStr || takenDays.has(date) || closedDays.has(date)) continue;
      const { start, end } = parseTimes(rule.time);
      if (!start) continue;
      let endIso: string | undefined;
      if (end) {
        endIso = end === '00:00' ? `${date}T23:59:00` : `${date}T${end}:00`;
      }
      const free = rule.price === 'Gratis';
      micro.push({
        id: `${rule.id}-${date}`,
        name: rule.title,
        description: clean(rule.description),
        start: `${date}T${start}:00`,
        end: endIso,
        timeText: rule.time,
        priceText: free ? 'Gratis' : rule.registrationNote ? `Påmelding. ${rule.registrationNote.replace(/\.$/, "")}` : 'Påmelding',
        price: free ? 0 : undefined,
        free,
        soldOut: false,
        url: rule.registrationLink && rule.id !== 'kviss' ? rule.registrationLink : undefined,
        recurring: rule.ruleDescription,
      });
    }
  }

  return [...program, ...micro].sort((a, b) => a.start.localeCompare(b.start));
}

// ---------- schema.org JSON-LD ----------

export function buildJsonLd(now: Date) {
  const todayStr = ymd(now.getFullYear(), now.getMonth(), now.getDate());
  const place = {
    '@type': 'Place',
    name: 'Støyperiet',
    address: {
      '@type': 'PostalAddress',
      streetAddress: ADDRESS.street,
      postalCode: ADDRESS.postalCode,
      addressLocality: ADDRESS.locality,
      addressRegion: 'Vestland',
      addressCountry: 'NO',
    },
  };

  const pub = {
    '@type': 'BarOrPub',
    '@id': PUB_ID,
    name: 'Støyperiet',
    alternateName: ['Støyperiet Pub', 'Støyperiet folkepub', 'Støyperiet Husnes'],
    slogan: 'Fellesskap i flytande form',
    description: DESCRIPTION,
    url: `${SITE}/`,
    email: EMAIL,
    image: `${SITE}/og-image.png`,
    logo: `${SITE}/logo.png`,
    address: place.address,
    geo: { '@type': 'GeoCoordinates', latitude: 59.8583, longitude: 5.7514 },
    hasMap: 'https://www.google.com/maps/search/?api=1&query=St%C3%B8yperiet%2C%20Sentrumsvegen%2041%2C%205460%20Husnes',
    areaServed: ['Husnes', 'Kvinnherad', 'Sunnhordland', 'Hardanger'],
    knowsLanguage: ['nn', 'nb', 'en'],
    publicAccess: true,
    servesCuisine: 'Snacks',
    acceptsReservations: false,
    menu: `${SITE}/#meny`,
    openingHoursSpecification: WEEKLY_HOURS.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    specialOpeningHoursSpecification: SPECIAL_HOURS.filter((s) => s.date >= todayStr).map((s) => ({
      '@type': 'OpeningHoursSpecification',
      validFrom: s.date,
      validThrough: s.date,
      opens: s.opens ?? '00:00',
      closes: s.closes ?? '00:00',
    })),
    sameAs: [
      'https://www.facebook.com/profile.php?id=61588258673482',
      'https://www.instagram.com/stoyperietpub/',
    ],
  };

  const events = upcomingEvents(now).map((e) => {
    const ev: Record<string, unknown> = {
      '@type': 'Event',
      '@id': `${SITE}/#${e.id}`,
      name: e.name,
      description: e.description,
      startDate: withTz(e.start),
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: place,
      organizer: { '@type': 'Organization', name: 'Støyperiet', url: `${SITE}/` },
      image: `${SITE}/og-image.png`,
      inLanguage: 'nn',
      isAccessibleForFree: e.free,
      url: `${SITE}/#program`,
    };
    if (e.end) ev.endDate = withTz(e.end);
    if (e.free) {
      ev.offers = {
        '@type': 'Offer', price: 0, priceCurrency: 'NOK',
        availability: 'https://schema.org/InStock', url: e.url || `${SITE}/#program`,
      };
    } else if (e.price !== undefined || e.url || e.soldOut) {
      const offer: Record<string, unknown> = {
        '@type': 'Offer',
        priceCurrency: 'NOK',
        availability: e.soldOut ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
        url: e.url || `${SITE}/#program`,
      };
      if (e.price !== undefined) offer.price = e.price;
      ev.offers = offer;
    }
    return ev;
  });

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        url: `${SITE}/`,
        name: 'Støyperiet',
        inLanguage: 'nn',
        publisher: { '@id': PUB_ID },
      },
      pub,
      ...events,
    ],
  };
}

// ---------- llms.txt ----------

function eventLine(e: PublicEvent): string {
  const parts = [`${niceDate(e.start)}, ${e.timeText}: **${e.name}**`];
  if (e.soldOut) parts.push('(utseld)');
  else if (e.priceText) parts.push(`(${e.priceText})`);
  let line = `- ${parts.join(' ')}. ${e.description}`;
  if (e.url && !e.soldOut) line += ` Billett/påmelding: ${e.url}`;
  else if (e.vipps && !e.soldOut) line += ` Billett: Vipps til #${e.vipps}.`;
  return line;
}

export function buildLlmsTxt(now: Date): string {
  const todayStr = ymd(now.getFullYear(), now.getMonth(), now.getDate());
  const events = upcomingEvents(now);
  const program = events.filter((e) => !e.recurring);
  const recurring = events.filter((e) => e.recurring);
  const special = SPECIAL_HOURS.filter((s) => s.date >= todayStr);

  const lines: string[] = [
    '# Støyperiet',
    '',
    `> ${DESCRIPTION} Slagord: «Fellesskap i flytande form».`,
    '',
    'Støyperiet er ein folkepub: eigd av lokalsamfunnet, bygd på dugnad og driven av frivillige. ' +
      'Visjonen er «å vere ein trygg og lett tilgjengeleg møteplass for vaksne, og skape kultur og fellesskap på Husnes». ' +
      'Det er ein god stad å ta turen innom for både fastbuande, tilreisande og turistar som vil oppleve Husnes og Kvinnherad ' +
      'slik lokalfolk gjer det: på konsert, kviss, standup eller ein roleg sundag med brettspel.',
    '',
    '## Fakta',
    '',
    `- Adresse: ${ADDRESS.street}, ${ADDRESS.postalCode} ${ADDRESS.locality} (${ADDRESS.region}, Noreg)`,
    '- Opningstider: ' + WEEKLY_HOURS.map((h) => h.text).join('. ') + '. Stengt måndag, tysdag og torsdag.',
    '- Aldersgrense: 20 år etter kl. 19. Alle er velkomne før kl. 19.',
    '- Servering: drikke (også eit godt utval alkoholfritt), kaffi og snacks. Ingen kjøken.',
    '- Ingen bordbestilling. Billettar til konsertar og show blir selde via lenkja i programmet.',
    '- Språk: nynorsk/norsk, og me snakkar engelsk.',
    `- Nettside: ${SITE}/`,
    '- Instagram: https://www.instagram.com/stoyperietpub/',
    '- Facebook: https://www.facebook.com/profile.php?id=61588258673482',
    `- E-post: ${EMAIL} (arrangement og leige: ${EVENT_EMAIL})`,
    '',
  ];

  if (special.length) {
    lines.push('## Opningstider i jula', '');
    for (const s of special) {
      lines.push(`- ${niceDate(s.date)}: ${s.opens ? `${s.opens}–${s.closes === '00:00' ? '24:00' : s.closes}` : 'stengt'}`);
    }
    lines.push('');
  }

  lines.push(`## Program (oppdatert ${niceDate(todayStr)})`, '');
  if (program.length) lines.push(...program.map(eventLine));
  else lines.push('- Nytt program kjem. Sjå nettsida eller Instagram.');
  lines.push('');

  lines.push('## Faste arrangement', '');
  const seen = new Set<string>();
  for (const rule of MICRO_EVENT_RULES) {
    if (seen.has(rule.title)) continue;
    seen.add(rule.title);
    lines.push(`- **${rule.title}**: ${rule.ruleDescription}, kl. ${rule.time}. ${rule.price}. ${clean(rule.description)}`);
  }
  lines.push(
    '',
    'Regelen er eitt arrangement per kveld, så eit fast arrangement kan bli flytta når det er konsert eller show. Neste datoar:',
    '',
    ...recurring.map((e) => `- ${niceDate(e.start)}, ${e.timeText}: ${e.name}`),
    '',
    '## Om denne fila',
    '',
    `Denne fila blir laga automatisk frå programmet på ${SITE}/ kvar gong nettsida blir oppdatert. ` +
      'Ved tvil gjeld nettsida og Instagram.',
    '',
  );
  return lines.join('\n');
}

// ---------- statisk HTML (for robotar utan JavaScript) ----------

export function buildStaticHtml(now: Date): string {
  const events = upcomingEvents(now);
  const items = events
    .map((e) => {
      const status = e.soldOut ? ' – utseld' : e.priceText ? ` – ${esc(e.priceText)}` : '';
      return `<li><time datetime="${withTz(e.start)}">${esc(niceDate(e.start))}, ${esc(e.timeText)}</time>: <strong>${esc(e.name)}</strong>${status}. ${esc(e.description)}</li>`;
    })
    .join('\n          ');
  return `
      <div id="seo-fallback" style="max-width:46rem;margin:0 auto;padding:3rem 1.5rem;font-family:monospace;color:#1A1A1A;">
        <h1>Støyperiet – folkepub på Husnes</h1>
        <p>${esc(DESCRIPTION)}</p>
        <p><em>Fellesskap i flytande form.</em></p>
        <h2>Opningstider</h2>
        <p>${WEEKLY_HOURS.map((h) => esc(h.text)).join('. ')}. 20 års aldersgrense etter kl. 19.</p>
        <h2>Adresse</h2>
        <p>${ADDRESS.street}, ${ADDRESS.postalCode} ${ADDRESS.locality}, Kvinnherad</p>
        <h2>Program</h2>
        <ul>
          ${items}
        </ul>
        <p>Kontakt: <a href="mailto:${EMAIL}">${EMAIL}</a> · <a href="https://www.instagram.com/stoyperietpub/">Instagram</a></p>
      </div>`;
}

export function buildSitemap(now: Date): string {
  const d = ymd(now.getFullYear(), now.getMonth(), now.getDate());
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE}/</loc>
    <lastmod>${d}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE}/llms.txt</loc>
    <lastmod>${d}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
`;
}
