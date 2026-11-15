import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Stamp from './Stamp';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Users, 
  ArrowRight, 
  Share2, 
  Check, 
  Sparkles, 
  Info,
  CalendarPlus,
  Coffee,
  Target,
  Crown,
  Coins,
  Briefcase,
  HelpCircle,
  Dices,
  Footprints,
  Music,
  X
} from 'lucide-react';
import { useSeason } from '../seasonConfig';
import SantaHat from './SantaHat';

export interface MicroEventRule {
  id: string;
  title: string;
  category: 'sosialt' | 'konkurranse' | 'nettverk' | 'kultur';
  ruleDescription: string;
  time: string;
  doorsOpen?: string;
  price: 'Gratis' | 'Påmelding' | 'Billett';
  registrationLink?: string;
  registrationNote?: string;
  description: string;
  badgeColor: string;
  calculateDate: (year: number, month: number) => number | null; // Returns day of month (1-31) or null if not in that month
}

// Helpers for calculating dates
function getFirstDayOfWeek(year: number, month: number, targetDayOfWeek: number): number {
  for (let day = 1; day <= 7; day++) {
    const d = new Date(year, month, day);
    if (d.getDay() === targetDayOfWeek) {
      return day;
    }
  }
  return 1;
}

function getNthDayOfWeek(year: number, month: number, targetDayOfWeek: number, n: number): number {
  const first = getFirstDayOfWeek(year, month, targetDayOfWeek);
  return first + (n - 1) * 7;
}

function getLastDayOfWeek(year: number, month: number, targetDayOfWeek: number): number {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = daysInMonth; day >= daysInMonth - 7; day--) {
    const d = new Date(year, month, day);
    if (d.getDay() === targetDayOfWeek) {
      return day;
    }
  }
  return daysInMonth;
}

// Calculate payday event: alternates between closest to the 12th and 20th each month.
// Must always be on a Friday (fredagar).
function calculateLonnstreff(year: number, month: number): number {
  // In November 2026: Mannsdagsquiz is on Friday Nov 20, so Lønningstreff is moved to Saturday Nov 21
  if (year === 2026 && month === 10) return 21;
  // In December 2026: Moondance concert is on Friday Dec 11, so Lønningstreff is on Friday Dec 4
  if (year === 2026 && month === 11) return 4;

  // Alternates between the 20th and 12th:
  // Human calendar: Odd months (Jan=1, Mar=3, Mai=5, Jul=7, Sep=9, Nov=11) -> target 20.
  // Even months (Feb=2, Apr=4, Jun=6, Aug=8, Okt=10, Des=12) -> target 12.
  const humanMonth = month + 1;
  const targetDay = (humanMonth % 2 === 0) ? 12 : 20;
  const d = new Date(year, month, targetDay);
  const dow = d.getDay(); // 0: Sun, 1: Mon, ..., 5: Fri, 6: Sat

  if (dow === 5) {
    return targetDay;
  } else if (dow === 6) {
    // Saturday -> Friday before (payday is Friday before weekend)
    return targetDay - 1;
  } else if (dow === 0) {
    // Sunday -> Friday before (payday is Friday before weekend)
    return targetDay - 2;
  } else {
    // Monday..Thursday -> Friday of that pay week (on or after payday)
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
    calculateDate: (year, month) => getNthDayOfWeek(year, month, 0, 1) // 1st Sunday (0)
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
    calculateDate: (year, month) => getNthDayOfWeek(year, month, 3, 1) // 1st Wednesday (3)
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
    calculateDate: (year, month) => getLastDayOfWeek(year, month, 3) // Last Wednesday (3)
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
    calculateDate: (year, month) => getLastDayOfWeek(year, month, 0) // Last Sunday (0)
  }
];

const MONTH_NAMES_NO = [
  'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
];

const WEEKDAY_NAMES_NO = ['Mån', 'Tys', 'Ons', 'Tor', 'Fre', 'Lau', 'Søn'];

export interface CalculatedEvent {
  event: MicroEventRule;
  day: number;
  date: Date;
  dateString: string;
}

// Helper to render distinct icon for each micro-event concept
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
      return <Footprints className={className} />;
    case 'kviss':
      return <HelpCircle className={className} />;
    case 'brettspelkveld':
      return <Dices className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};

const MicroEventsCalendar: React.FC = () => {
  const { isChristmas } = useSeason();
  const today = new Date();
  // Start calendar from the current month (per dags månad)
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  // Check if calendar is currently at or before the current month
  const isPastMonthBoundary = useMemo(() => {
    return (currentDate.getFullYear() < today.getFullYear()) ||
      (currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() <= today.getMonth());
  }, [currentDate, today]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Lock body scroll only when mobile modal is actively open on mobile/tablet (< 1024px)
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    if (isMobileModalOpen && isMobile) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileModalOpen]);

  // Ensure modal closes and scroll resets if user resizes to desktop width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileModalOpen) {
        setIsMobileModalOpen(false);
        document.body.style.overflow = '';
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileModalOpen]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Calculate events for current month
  const monthEvents = useMemo(() => {
    const events: CalculatedEvent[] = [];
    MICRO_EVENT_RULES.forEach((rule) => {
      const day = rule.calculateDate(year, month);
      if (day !== null) {
        const eventDate = new Date(year, month, day);
        events.push({
          event: rule,
          day,
          date: eventDate,
          dateString: `${day}. ${MONTH_NAMES_NO[month].toLowerCase()} ${year}`
        });
      }
    });
    // Sort chronologically by day
    return events.sort((a, b) => a.day - b.day);
  }, [year, month]);

  // Map of day -> events
  const eventsByDay = useMemo(() => {
    const map = new Map<number, CalculatedEvent[]>();
    monthEvents.forEach((item) => {
      const existing = map.get(item.day) || [];
      existing.push(item);
      map.set(item.day, existing);
    });
    return map;
  }, [monthEvents]);

  // Events for currently selected day (or day of active event)
  const currentSelectedDayNumber = selectedDay !== null 
    ? selectedDay 
    : (monthEvents.length > 0 ? (monthEvents.find(e => today.getFullYear() === year && today.getMonth() === month && e.day >= today.getDate())?.day || monthEvents[0]?.day) : null);

  const selectedDayEvents = useMemo(() => {
    if (currentSelectedDayNumber === null) return [];
    return eventsByDay.get(currentSelectedDayNumber) || [];
  }, [currentSelectedDayNumber, eventsByDay]);

  // Active selected event resolution:
  // If user clicked a day / event: match selectedEventId or return first event of that day
  const activeEvent = useMemo(() => {
    if (selectedDay !== null) {
      const events = eventsByDay.get(selectedDay);
      if (!events || events.length === 0) return null;
      if (selectedEventId) {
        const matched = events.find(e => e.event.id === selectedEventId);
        if (matched) return matched;
      }
      return events[0];
    }
    // Default initial selection (no click yet): next upcoming or first
    if (monthEvents.length > 0) {
      const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
      if (isCurrentMonth) {
        const upcoming = monthEvents.find(e => e.day >= today.getDate());
        if (upcoming) return upcoming;
      }
      return monthEvents[0];
    }
    return null;
  }, [selectedDay, selectedEventId, eventsByDay, monthEvents, year, month, today]);

  // Find next upcoming micro-event relative to selectedDay (or relative to today)
  const nextUpcomingEvent = useMemo(() => {
    if (monthEvents.length === 0) return null;
    
    // Reference day to find next event after
    const referenceDay = selectedDay !== null 
      ? selectedDay 
      : (today.getFullYear() === year && today.getMonth() === month ? today.getDate() : 0);
    
    // 1. Look for next event in current month after referenceDay
    const upcomingThisMonth = monthEvents.find(e => e.day > referenceDay);
    if (upcomingThisMonth) {
      return {
        ...upcomingThisMonth,
        isNextMonth: false,
        monthName: MONTH_NAMES_NO[month],
        targetYear: year,
        targetMonth: month
      };
    }
    
    // 2. If no later events in current month, calculate the first event of the next month
    const nextYear = month === 11 ? year + 1 : year;
    const nextMonth = month === 11 ? 0 : month + 1;
    
    const nextMonthEvents: CalculatedEvent[] = [];
    MICRO_EVENT_RULES.forEach((rule) => {
      const day = rule.calculateDate(nextYear, nextMonth);
      if (day !== null) {
        nextMonthEvents.push({
          event: rule,
          day,
          date: new Date(nextYear, nextMonth, day),
          dateString: `${day}. ${MONTH_NAMES_NO[nextMonth].toLowerCase()} ${nextYear}`
        });
      }
    });
    nextMonthEvents.sort((a, b) => a.day - b.day);
    
    if (nextMonthEvents.length > 0) {
      return {
        ...nextMonthEvents[0],
        isNextMonth: true,
        monthName: MONTH_NAMES_NO[nextMonth],
        targetYear: nextYear,
        targetMonth: nextMonth
      };
    }

    // Fallback to first event in current month
    return {
      ...monthEvents[0],
      isNextMonth: false,
      monthName: MONTH_NAMES_NO[month],
      targetYear: year,
      targetMonth: month
    };
  }, [monthEvents, selectedDay, year, month, today]);

  // Select day (opens modal only on mobile/tablet < 1024px; updates inline sidebar on desktop)
  const handleSelectDay = (day: number, eventId?: string) => {
    setSelectedDay(day);
    if (eventId) {
      setSelectedEventId(eventId);
    } else {
      const dayEvents = eventsByDay.get(day);
      if (dayEvents && dayEvents.length > 0) {
        setSelectedEventId(dayEvents[0].event.id);
      } else {
        setSelectedEventId(null);
      }
    }
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsMobileModalOpen(true);
    }
  };

  // Navigate to an event (handling month shift if necessary)
  const handleNavigateToEvent = (ev: { event: MicroEventRule; day: number; targetYear: number; targetMonth: number; isNextMonth: boolean } | null) => {
    if (!ev) return;
    if (ev.isNextMonth) {
      setCurrentDate(new Date(ev.targetYear, ev.targetMonth, 1));
      setSelectedDay(ev.day);
      setSelectedEventId(ev.event.id);
    } else {
      setSelectedDay(ev.day);
      setSelectedEventId(ev.event.id);
    }
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsMobileModalOpen(true);
    }
  };

  const handlePrevMonth = () => {
    if (isPastMonthBoundary) return;
    const prevMonthDate = new Date(year, month - 1, 1);
    setCurrentDate(prevMonthDate);
    // Find first event in previous month
    const prevYear = prevMonthDate.getFullYear();
    const prevMonth = prevMonthDate.getMonth();
    const firstEvent = MICRO_EVENT_RULES
      .map(r => ({ rule: r, day: r.calculateDate(prevYear, prevMonth) }))
      .filter((d): d is { rule: MicroEventRule; day: number } => d.day !== null)
      .sort((a, b) => a.day - b.day)[0];
    setSelectedDay(firstEvent?.day || 1);
    setSelectedEventId(firstEvent?.rule.id || null);
  };

  const handleNextMonth = () => {
    const nextMonthDate = new Date(year, month + 1, 1);
    setCurrentDate(nextMonthDate);
    // Find first event in next month
    const nextYear = nextMonthDate.getFullYear();
    const nextMonth = nextMonthDate.getMonth();
    const firstEvent = MICRO_EVENT_RULES
      .map(r => ({ rule: r, day: r.calculateDate(nextYear, nextMonth) }))
      .filter((d): d is { rule: MicroEventRule; day: number } => d.day !== null)
      .sort((a, b) => a.day - b.day)[0];
    setSelectedDay(firstEvent?.day || 1);
    setSelectedEventId(firstEvent?.rule.id || null);
  };

  const handleCurrentMonth = () => {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    const thisMonthEvents = MICRO_EVENT_RULES
      .map(r => ({ rule: r, day: r.calculateDate(today.getFullYear(), today.getMonth()) }))
      .filter((d): d is { rule: MicroEventRule; day: number } => d.day !== null)
      .sort((a, b) => a.day - b.day);
    const upcoming = thisMonthEvents.find(e => e.day >= today.getDate()) || thisMonthEvents[0];
    setSelectedDay(upcoming?.day || today.getDate());
    setSelectedEventId(upcoming?.rule.id || null);
  };

  // Helper to determine pub opening hours for any day of the week
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

  // Selected day info when a date without a micro-event is clicked
  const selectedDayInfo = useMemo(() => {
    if (selectedDay === null) return null;
    const date = new Date(year, month, selectedDay);
    const dayOfWeek = date.getDay();
    const pubStatus = getPubHoursForDay(dayOfWeek);
    return {
      day: selectedDay,
      date,
      dateString: `${selectedDay}. ${MONTH_NAMES_NO[month].toLowerCase()} ${year}`,
      dayName: ['Søndag', 'Måndag', 'Tysdag', 'Onsdag', 'Torsdag', 'Fredag', 'Laurdag'][dayOfWeek],
      ...pubStatus
    };
  }, [selectedDay, year, month]);

  // Build calendar matrix (Monday-based: 0=Mon, 6=Sun)
  const calendarCells = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday...
    const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Convert to Mon=0 ... Sun=6
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const cells = [];

    // Previous month filler days
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      cells.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        isPrev: true
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
      const dayEvents = eventsByDay.get(day) || [];
      const isSelected = selectedDay === day || (selectedDay === null && activeEvent?.day === day);
      const dayOfWeek = date.getDay();
      const pubStatus = getPubHoursForDay(dayOfWeek);

      cells.push({
        day,
        date,
        isCurrentMonth: true,
        isToday,
        events: dayEvents,
        isSelected,
        pubStatus
      });
    }

    // Next month filler days to complete grid (multiples of 7)
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      cells.push({
        day: i,
        isCurrentMonth: false,
        isNext: true
      });
    }

    return cells;
  }, [year, month, eventsByDay, selectedDay, activeEvent, today]);

  // Generate Google Calendar Link
  const getGoogleCalendarUrl = (item: CalculatedEvent) => {
    const title = encodeURIComponent(`${item.event.title} – Støyperiet Pub`);
    const details = encodeURIComponent(`${item.event.description}\n\nStøyperiet Pub, Sentrumsvegen 41, 5460 Husnes`);
    const location = encodeURIComponent('Støyperiet Pub, Sentrumsvegen 41, 5460 Husnes');
    
    // Parse time if possible (e.g., "19:00–21:30" or "14:00")
    const startTimeStr = item.event.time.split('–')[0].replace(':', '');
    const endTimeStr = item.event.time.includes('–') ? item.event.time.split('–')[1].replace(':', '') : '2200';
    
    const yStr = item.date.getFullYear().toString();
    const mStr = (item.date.getMonth() + 1).toString().padStart(2, '0');
    const dStr = item.day.toString().padStart(2, '0');
    
    const startIso = `${yStr}${mStr}${dStr}T${startTimeStr.padEnd(4, '0')}00`;
    const endIso = `${yStr}${mStr}${dStr}T${endTimeStr.padEnd(4, '0')}00`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startIso}/${endIso}`;
  };

  // Download .ics File
  const handleDownloadIcs = (item: CalculatedEvent) => {
    const yStr = item.date.getFullYear().toString();
    const mStr = (item.date.getMonth() + 1).toString().padStart(2, '0');
    const dStr = item.day.toString().padStart(2, '0');
    
    const startTimeStr = item.event.time.split('–')[0].replace(':', '').padEnd(4, '0');
    const endTimeStr = (item.event.time.includes('–') ? item.event.time.split('–')[1].replace(':', '') : '2200').padEnd(4, '0');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Støyperiet Pub//Mikroarrangement//NO',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:${item.event.title} på Støyperiet`,
      `DESCRIPTION:${item.event.description}`,
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
    link.setAttribute('download', `${item.event.id}-${yStr}-${mStr}-${dStr}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Reusable detail card content for both desktop sidebar and mobile pop-up modal
  const renderDetailContent = (isModal = false, onClose?: () => void) => {
    if (activeEvent) {
      return (
        <div className={`bg-[#2D2D2D] text-[#F5EBE1] ${isModal ? 'p-5 sm:p-7' : 'border-2 border-white/10 p-6 sm:p-8'} shadow-2xl relative overflow-hidden`}>
          {/* Accent top banner */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 gap-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#C46E52] uppercase tracking-wider min-w-0">
              <span className="p-1 bg-[#C46E52] text-white shrink-0">
                {renderEventIcon(activeEvent.event.id, "w-3.5 h-3.5")}
              </span>
              <span className="truncate">VALT MIKROARRANGEMENT</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="bg-[#C46E52] text-white font-mono text-[10px] px-2.5 py-1 font-bold uppercase tracking-wider">
                {activeEvent.event.price}
              </span>
              {isModal && onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-7 h-7 bg-black/70 hover:bg-[#C46E52] text-white hover:text-white border border-white/30 hover:border-[#C46E52] flex items-center justify-center transition-all cursor-pointer shadow-sm ml-1"
                  aria-label="Lukk detaljar"
                  title="Lukk (kryss ut)"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Multi-event switcher if there are multiple events on this day */}
          {selectedDayEvents.length > 1 && (
            <div className="mb-6 p-3 bg-black/60 border border-[#C46E52]/40 space-y-2">
              <div className="font-mono text-[11px] uppercase tracking-wider text-white font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C46E52]"></span>
                <span>{selectedDayEvents.length} arrangement på denne datoen:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedDayEvents.map((ev) => {
                  const isCurrentActive = activeEvent.event.id === ev.event.id;
                  return (
                    <button
                      key={ev.event.id}
                      type="button"
                      onClick={() => setSelectedEventId(ev.event.id)}
                      className={`flex items-center gap-2.5 p-2.5 text-left font-mono text-xs font-bold uppercase transition-all border cursor-pointer ${
                        isCurrentActive
                          ? 'bg-[#C46E52] text-white border-[#C46E52] shadow-lg ring-2 ring-white/30'
                          : 'bg-white/10 text-white/90 border-white/20 hover:bg-white/20 hover:text-white hover:border-white/40'
                      }`}
                    >
                      <div className={`p-1 shrink-0 ${isCurrentActive ? 'bg-black/30 text-white' : 'bg-[#C46E52] text-white'}`}>
                        {renderEventIcon(ev.event.id, "w-4 h-4")}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-white">{ev.event.title}</div>
                        <div className="text-[10px] text-white/80 font-normal">Kl. {ev.event.time.split('–')[0]}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Event Title & Date */}
          <div className="space-y-3 mb-6">
            <div className="font-mono text-sm text-[#E3A08B] font-bold uppercase tracking-widest">
              {activeEvent.dateString}
            </div>
            <h3 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold uppercase text-white tracking-tight leading-none">
              {activeEvent.event.title}
            </h3>
            <div className="inline-block bg-white/15 px-3 py-1 font-mono text-xs font-bold text-white uppercase tracking-wider border border-white/20">
              {activeEvent.event.ruleDescription}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-[#F5EBE1] leading-relaxed mb-6 font-normal">
            {activeEvent.event.description}
          </p>

          {/* Time & Doors Info */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3.5 sm:p-4 bg-black/50 border border-white/20 mb-3 font-mono text-white">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#E3A08B] font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-[#C46E52]" />
                <span>START</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-white tracking-wide">{activeEvent.event.time}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#E3A08B] font-bold uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-[#C46E52]" />
                <span>OPNINGSTID</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-white tracking-wide">Dørene opnar {activeEvent.event.doorsOpen || '12:00'}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-black/40 border border-white/15 mb-6 font-mono text-xs text-white/90">
            <span className="w-2 h-2 rounded-full bg-[#C46E52] shrink-0"></span>
            <span>Aldersgrense: <strong className="text-white">20+ etter kl. 19:00</strong> (alle velkomne før 19)</span>
          </div>

          {/* Særskild info for 30. oktober: Pubkor kl. 19:00 */}
          {month === 9 && (activeEvent.day === 30 || selectedDay === 30) && (
            <div className="p-4 bg-[#C46E52]/25 border-2 border-[#C46E52] text-white my-6 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#E3A08B] uppercase tracking-wider">
                <Music className="w-4 h-4 text-[#C46E52] shrink-0" />
                <span>VIKTIG INFO: PUBKOR KL. 19:00 (KREV PÅMELDING)</span>
              </div>
              <p className="text-xs sm:text-sm text-[#F5EBE1] leading-relaxed">
                Denne kvelden vert det <strong>Pubkor på Støyperiet</strong> saman med Kammerskoret og musikalsk leiar Hilde Svalbjørg frå kl. 19:00–21:00! Arrangementet er gratis, men krev påmelding via Checkin for å sikra seg plass.
              </p>
              <div className="pt-1">
                <a
                  href="https://event.checkin.no/230414/pubkor-paa-stoeyperiet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C46E52] hover:bg-white hover:text-[#1A1A1A] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>Meld deg på Pubkor (Gratis)</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </a>
              </div>
            </div>
          )}

          {/* Specific Quiz registration note if applicable */}
          {activeEvent.event.registrationNote && (
            <div className="p-4 bg-[#C46E52]/25 border border-[#C46E52]/60 text-white text-sm mb-6 space-y-1">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#E3A08B]">
                VIKTIG INFO OM PÅMELDING:
              </div>
              <p className="text-white/95 text-xs sm:text-sm">{activeEvent.event.registrationNote}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {/* If event has checkin registration link */}
            {activeEvent.event.registrationLink && (
              <a
                href={activeEvent.event.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between w-full bg-[#C46E52] hover:bg-white hover:text-[#1A1A1A] text-white p-4 font-mono font-bold text-sm sm:text-base uppercase tracking-wider transition-all shadow-lg"
              >
                <span>{activeEvent.event.id === 'kviss' ? 'Meld på lag' : 'Meld deg på via Checkin (Gratis)'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            )}

            {activeEvent.event.id === 'kviss' && (
              <button
                type="button"
                onClick={() => {
                  if (onClose) onClose();
                  document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center justify-between w-full border-2 border-[#C46E52] bg-black/40 hover:bg-[#C46E52]/20 text-white p-3.5 font-mono font-bold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer"
              >
                <span>Sjå Kvissliga & Ligatabell</span>
                <ArrowRight className="w-4 h-4 text-[#C46E52]" />
              </button>
            )}

            {/* Calendar Export Controls */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <a
                href={getGoogleCalendarUrl(activeEvent)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border-2 border-white/30 bg-black/40 hover:bg-[#C46E52] hover:border-[#C46E52] hover:text-white text-white p-3 font-mono text-xs uppercase font-bold transition-all text-center"
              >
                <CalendarPlus className="w-4 h-4 text-[#C46E52]" />
                <span>Google Kalender</span>
              </a>
              
              <button
                type="button"
                onClick={() => handleDownloadIcs(activeEvent)}
                className="flex items-center justify-center gap-2 border-2 border-white/30 bg-black/40 hover:bg-[#C46E52] hover:border-[#C46E52] hover:text-white text-white p-3 font-mono text-xs uppercase font-bold transition-all text-center cursor-pointer"
              >
                <CalendarIcon className="w-4 h-4 text-[#C46E52]" />
                <span>Last ned .ics</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (selectedDayInfo) {
      return (
        <div className={`bg-[#2D2D2D] text-[#F5EBE1] ${isModal ? 'p-5 sm:p-7' : 'border-2 border-white/10 p-6 sm:p-8'} shadow-2xl relative overflow-hidden space-y-6`}>
          <div className="flex items-center justify-between border-b border-white/10 pb-4 gap-2">
            <span className="font-mono text-xs font-bold text-[#E3A08B] uppercase tracking-wider truncate">
              {selectedDayInfo.dayName}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`font-mono text-[10px] px-2.5 py-1 font-bold uppercase tracking-wider ${
                selectedDayInfo.isOpen ? 'bg-green-700 text-white' : 'bg-white/20 text-white/90'
              }`}>
                {selectedDayInfo.isOpen ? 'Ope i dag' : 'Stengt'}
              </span>
              {isModal && onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-7 h-7 bg-black/70 hover:bg-[#C46E52] text-white hover:text-white border border-white/30 hover:border-[#C46E52] flex items-center justify-center transition-all cursor-pointer shadow-sm ml-1"
                  aria-label="Lukk detaljar"
                  title="Lukk (kryss ut)"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="font-mono text-sm text-[#E3A08B] font-bold uppercase tracking-widest mb-1">
              {selectedDayInfo.dateString}
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold uppercase text-white tracking-tight leading-none">
              {selectedDayInfo.isOpen ? 'Vanleg Pubkveld' : 'Ingen Arrangement'}
            </h3>
          </div>

          <p className="text-sm sm:text-base text-[#F5EBE1] leading-relaxed">
            {selectedDayInfo.isOpen 
              ? 'Det er ingen særskilte mikroarrangement denne datoen, men dørene våre er opne! Kom innom for noko godt i glaset, brettspel og god drøs.'
              : 'Puben held stengt denne kvardagen. Våre faste opningsdagar er onsdag, fredag, laurdag og søndag.'}
          </p>

          <div className="p-4 bg-black/50 border border-white/20 font-mono space-y-2 text-white">
            <div className="text-xs text-[#E3A08B] font-bold uppercase tracking-wider">Opningstid denne dagen:</div>
            <div className="text-base font-bold text-white">{selectedDayInfo.hours}</div>
            {selectedDayInfo.isOpen && (
              <div className="pt-2 border-t border-white/15 flex items-center gap-2 text-xs text-white/90">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C46E52] shrink-0"></span>
                <span>Aldersgrense: <strong className="text-white">20+ etter kl. 19:00</strong></span>
              </div>
            )}
          </div>

          {/* Særskild info for 30. oktober: Pubkor kl. 19:00 */}
          {month === 9 && selectedDayInfo.day === 30 && (
            <div className="p-4 bg-[#C46E52]/25 border-2 border-[#C46E52] text-white my-6 space-y-3 shadow-xl text-left">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#E3A08B] uppercase tracking-wider">
                <Music className="w-4 h-4 text-[#C46E52] shrink-0" />
                <span>VIKTIG INFO: PUBKOR KL. 19:00 (KREV PÅMELDING)</span>
              </div>
              <p className="text-xs sm:text-sm text-[#F5EBE1] leading-relaxed">
                Denne kvelden vert det <strong>Pubkor på Støyperiet</strong> saman med Kammerskoret og musikalsk leiar Hilde Svalbjørg frå kl. 19:00–21:00! Arrangementet er gratis, men krev påmelding via Checkin for å sikra seg plass.
              </p>
              <div className="pt-1">
                <a
                  href="https://event.checkin.no/230414/pubkor-paa-stoeyperiet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C46E52] hover:bg-white hover:text-[#1A1A1A] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>Meld deg på Pubkor (Gratis)</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </a>
              </div>
            </div>
          )}

          {nextUpcomingEvent && (
            <div className="pt-3 border-t border-white/10 space-y-2">
              <div className="font-mono text-xs text-[#E3A08B] uppercase font-bold tracking-wider flex items-center justify-between">
                <span>KOMMANDE MIKROARRANGEMENT:</span>
                {nextUpcomingEvent.isNextMonth && (
                  <span className="text-[10px] text-white/70 lowercase">({nextUpcomingEvent.monthName})</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleNavigateToEvent(nextUpcomingEvent)}
                className="w-full p-3.5 bg-black/60 hover:bg-[#C46E52]/30 border border-white/25 hover:border-[#C46E52] flex items-center justify-between text-left transition-all group cursor-pointer shadow-md text-white"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="w-7 h-7 bg-[#C46E52] text-white flex items-center justify-center shrink-0">
                    {renderEventIcon(nextUpcomingEvent.event.id, "w-4 h-4")}
                  </div>
                  <div className="font-mono text-xs truncate">
                    <span className="font-bold text-white">
                      {nextUpcomingEvent.day}. {nextUpcomingEvent.monthName.slice(0, 3)}:
                    </span>{' '}
                    <span className="text-[#E3A08B] uppercase font-bold group-hover:text-white transition-colors">
                      {nextUpcomingEvent.event.title}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#C46E52] group-hover:translate-x-1 group-hover:text-white transition-all shrink-0" />
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={`bg-[#2D2D2D] text-[#F5EBE1] ${isModal ? 'p-6' : 'border-2 border-white/10 p-8'} text-center space-y-4`}>
        <Info className="w-8 h-8 text-[#C46E52] mx-auto" />
        <h4 className="font-mono text-lg font-bold uppercase text-white">Ingen dato valt</h4>
        <p className="text-sm text-white/80">Vel ein dato i kalenderen for å sjå detaljar eller opningstider.</p>
      </div>
    );
  };

  return (
    <section id="mikroarrangement" className="bg-[#1A1A1A] text-[#C9BBAF] py-28 md:py-40 px-6 relative overflow-hidden section-divider scroll-mt-24" data-is-dark="true">
      {/* Background industrial grid & noise texture */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#C46E52 2px, transparent 2px)', backgroundSize: '16px 16px' }}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16 pb-8 border-b-2 border-white/10">
          <div className="space-y-4 max-w-3xl">
            <div className="bg-[#C46E52] text-white px-4 py-1 font-mono text-[11px] uppercase tracking-widest inline-block font-bold">
              LOG_04: MIKROARRANGEMENT
            </div>
            <h2 className="font-heading text-5xl sm:text-7xl md:text-8xl uppercase leading-none text-white tracking-tighter">
              RYTMEN PÅ <br />
              <span className="text-[#C46E52] riso-print" data-text="STØYPERIET">STØYPERIET</span>
            </h2>
            <p className="text-lg opacity-80 max-w-2xl leading-relaxed">
              Kvar månad har me faste mikroarrangement på puben, det er alt frå sjakk og strikkekafé, til den store månadsquizen og lønningstreff. Finn dine favorittar i kalenderen under.
            </p>
          </div>
        </div>

        {/* Calendar & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          
          {/* LEFT: Dynamic Calendar View (7 cols) */}
          <div className="lg:col-span-7 bg-[#242424] border-2 border-white/10 p-6 sm:p-8 shadow-2xl relative">
            {/* Julenissehatt på øvre høgre hjørne av kalenderen */}
            {isChristmas && (
              <div 
                className="absolute -top-6 -right-3 sm:-top-8 sm:-right-5 md:-top-10 md:-right-6 z-20 pointer-events-none select-none transition-transform"
                title="God jul frå Støyperiet!"
              >
                <SantaHat className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20" />
              </div>
            )}
            
            {/* Calendar Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-6 h-6 text-[#C46E52]" />
                <h3 className="font-mono text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
                  {MONTH_NAMES_NO[month]} <span className="text-[#C46E52]">{year}</span>
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCurrentMonth}
                  className="px-3 py-1.5 font-mono text-xs uppercase font-bold border border-white/20 hover:border-[#C46E52] hover:text-[#C46E52] transition-colors"
                  title="Gå til denne månaden"
                >
                  I DAG
                </button>
                <button
                  onClick={handlePrevMonth}
                  disabled={isPastMonthBoundary}
                  aria-label="Førre månad"
                  className={`w-10 h-10 border flex items-center justify-center transition-all ${
                    isPastMonthBoundary
                      ? 'border-white/10 text-white/20 cursor-not-allowed opacity-30'
                      : 'border-white/20 hover:bg-[#C46E52] hover:border-[#C46E52] hover:text-white cursor-pointer'
                  }`}
                  title={isPastMonthBoundary ? 'Du er på gjeldande månad (ingen tidlegare arrangement)' : 'Førre månad'}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextMonth}
                  aria-label="Neste månad"
                  className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-[#C46E52] hover:border-[#C46E52] hover:text-white transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
              {WEEKDAY_NAMES_NO.map((dayName, idx) => (
                <div 
                  key={idx} 
                  className={`font-mono text-xs uppercase font-bold py-2 ${
                    idx === 5 || idx === 6 ? 'text-[#C46E52]' : 'opacity-60 text-white'
                  }`}
                >
                  {dayName}
                </div>
              ))}
            </div>

            {/* Calendar Grid Days */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {calendarCells.map((cell, idx) => {
                if (!cell.isCurrentMonth) {
                  return (
                    <div 
                      key={idx} 
                      className="min-h-[56px] sm:min-h-[76px] p-1.5 sm:p-2 border border-white/5 bg-black/30 opacity-20 flex flex-col justify-between"
                    >
                      <span className="font-mono text-xs text-white/30">{cell.day}</span>
                    </div>
                  );
                }

                const hasEvents = cell.events && cell.events.length > 0;
                const isSelected = selectedDay === cell.day || (selectedDay === null && activeEvent?.day === cell.day);
                const isOpen = cell.pubStatus?.isOpen;

                return (
                  <div
                    key={idx}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectDay(cell.day)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectDay(cell.day);
                      }
                    }}
                    className={`relative w-full min-h-[56px] sm:min-h-[76px] p-1.5 sm:p-2 border text-left transition-all flex flex-col justify-between overflow-hidden group cursor-pointer select-none ${
                      isSelected 
                        ? 'border-[#C46E52] bg-[#C46E52]/20 ring-2 ring-[#C46E52] z-10 scale-[1.02]' 
                        : hasEvents
                          ? 'border-[#C46E52]/50 bg-[#2C2422] hover:border-[#C46E52] hover:bg-[#382B27]'
                          : isOpen
                            ? 'border-white/15 bg-[#242424] hover:border-white/40 hover:bg-[#2A2A2A]'
                            : 'border-white/5 bg-black/25 opacity-50 hover:opacity-80 hover:border-white/20'
                    }`}
                  >
                    {/* Top Row: Date Number and Today Badge */}
                    <div className="flex justify-between items-start w-full min-w-0">
                      <span className={`font-mono text-xs sm:text-sm font-bold ${
                        cell.isToday 
                          ? 'bg-[#C46E52] text-white px-1 sm:px-1.5 py-0.2 sm:py-0.5' 
                          : isSelected
                            ? 'text-[#C46E52]'
                            : hasEvents
                              ? 'text-white font-black'
                              : 'text-white/80'
                      }`}>
                        {cell.day}
                      </span>

                      {cell.isToday && (
                        <span className="hidden md:inline font-mono text-[8px] text-[#C46E52] uppercase font-bold tracking-wider">
                          I DAG
                        </span>
                      )}

                      {/* Small subtle indicator if regular open day */}
                      {!hasEvents && isOpen && !cell.isToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20 hidden sm:inline-block" title="Ope i dag"></span>
                      )}
                    </div>

                    {/* Bottom Row: Micro-Event Icon(s) */}
                    {(hasEvents || (month === 9 && cell.day === 30)) && (
                      <div className="mt-auto pt-1 flex flex-wrap items-center justify-end sm:justify-start gap-1">
                        {cell.events?.map((ev, evIdx) => (
                          <button
                            key={evIdx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectDay(cell.day, ev.event.id);
                            }}
                            className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center shadow-md transition-all hover:scale-110 cursor-pointer ${
                              activeEvent?.event.id === ev.event.id && selectedDay === cell.day
                                ? 'bg-white text-[#1A1A1A] ring-2 ring-[#C46E52] scale-105'
                                : 'bg-[#C46E52] text-white hover:bg-white hover:text-[#1A1A1A]'
                            }`}
                            title={`${ev.event.title} (${ev.event.time})`}
                          >
                            {renderEventIcon(ev.event.id, "w-3.5 h-3.5 sm:w-4 sm:h-4")}
                          </button>
                        ))}
                        {month === 9 && cell.day === 30 && (
                          <span
                            className="h-6 sm:h-7 px-1.5 bg-[#C46E52] text-white flex items-center gap-1 shadow-md font-mono text-[9px] font-bold uppercase tracking-tight"
                            title="Pubkor kl. 19:00 (krev påmelding)"
                          >
                            <Music className="w-3 h-3" />
                            <span className="hidden sm:inline">19:00</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Concept & Status Legend */}
            <div className="mt-6 pt-5 border-t border-white/10 space-y-4">
              {/* Discrete Icon Explanation Row */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-mono text-[#C9BBAF]">
                <span className="text-white/40 uppercase text-[10px] tracking-wider font-bold">Ikon:</span>
                {MICRO_EVENT_RULES.map((rule) => {
                  const ruleDay = rule.calculateDate(year, month);
                  if (ruleDay === null) return null;
                  const isRuleActive = activeEvent?.event.id === rule.id && (selectedDay === ruleDay || (selectedDay === null && activeEvent?.day === ruleDay));
                  return (
                    <button
                      key={rule.id}
                      type="button"
                      onClick={() => handleSelectDay(ruleDay, rule.id)}
                      className={`inline-flex items-center gap-1.5 px-2 py-1 border transition-all cursor-pointer ${
                        isRuleActive 
                          ? 'text-white bg-[#C46E52]/30 border-[#C46E52] font-bold shadow-sm' 
                          : 'text-[#C9BBAF] border-transparent hover:border-white/20 hover:text-white'
                      }`}
                      title={`Gå til ${rule.title} (${ruleDay}. ${MONTH_NAMES_NO[month]})`}
                    >
                      <span className={isRuleActive ? 'text-white' : 'text-[#C46E52]'}>
                        {renderEventIcon(rule.id, "w-3.5 h-3.5")}
                      </span>
                      <span>{rule.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Status Indicator Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-white/50 pt-3 border-t border-white/5">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-[#C46E52] inline-block"></span>
                    <span>Mikroarrangement</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-[#242424] border border-white/30 inline-block"></span>
                    <span>Ope pubkveld</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-black/40 border border-white/10 inline-block"></span>
                    <span>Stengt</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[#C46E52]">
                  <Info className="w-3.5 h-3.5" />
                  <span>Trykk på ein dato for detaljar</span>
                </div>
              </div>
            </div>
          </div>

          {/* DESKTOP RIGHT SIDEBAR (5 cols) - hidden on mobile */}
          <div className="hidden lg:block lg:col-span-5 space-y-6">
            {renderDetailContent(false)}
          </div>

        </div>

        {/* MOBILE POP-UP MODAL (Rendered to document.body via Portal to guarantee 100% viewport centering) */}
        {isMobileModalOpen && (activeEvent || selectedDayInfo) && typeof document !== 'undefined' && createPortal(
          <div 
            className="fixed inset-0 z-[9999] lg:hidden flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
            style={{ margin: 0 }}
            onClick={() => setIsMobileModalOpen(false)}
          >
            <div 
              className="relative w-full max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto overscroll-contain bg-[#2D2D2D] text-[#F5EBE1] border-2 border-[#C46E52] shadow-2xl rounded-none animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Detail Content */}
              {renderDetailContent(true, () => setIsMobileModalOpen(false))}
            </div>
          </div>,
          document.body
        )}

      </div>
    </section>
  );
};

export default MicroEventsCalendar;
