/**
 * SESONG- OG DATOSTYRING FOR STØYPERIET
 * 
 * Dette oppsettet isolerer all julepynt og sesongfunksjonalitet frå den vanlege
 * opphavlege koden og arrangement-databasen.
 * 
 * Korleis dette vernar koden din:
 * 1. Du kan redigere arrangement i november i EventsHubSection.tsx heilt utan risiko.
 * 2. Julepynten aktiverast AUTOMATISK først 1. desember (2026-12-01).
 * 3. Du kan teste og førehandsvise julepynten kva tid som helst via '?jul=test' eller
 *    testknappen i footeren/kontrollpanelet.
 * 4. Endringar oppdaterer heile sida augneblinkleg via global hending og minnelagring.
 */

import { useState, useEffect } from 'react';

export const SEASON_EVENT_NAME = 'stoyperiet-season-change';
const STORAGE_KEY = 'stoyperiet_jul_preview';

export interface SeasonConfig {
  /**
   * 'auto': Følgjer reell dato automatisk (jul 1.–31. desember).
   * 'manual_off': Jul er heilt slått av uansett dato.
   * 'manual_on': Jul er slått på heile tida.
   */
  mode: 'auto' | 'manual_off' | 'manual_on';
  
  /** Første dag julepynt skal visast (format YYYY-MM-DD) */
  christmasStartDate: string;
  
  /** Siste dag julepynt skal visast (format YYYY-MM-DD) */
  christmasEndDate: string;
}

export const SEASON_SETTINGS: SeasonConfig = {
  mode: 'auto',
  christmasStartDate: '2026-12-01',
  christmasEndDate: '2027-01-03',
};

export interface SeasonStatus {
  isChristmas: boolean;
  isPreview: boolean;
}

/**
 * Sjekkar om jula er aktiv basert på URL-parameter, lokal lagring eller reell dato
 */
export function checkIsChristmas(
  config: SeasonConfig = SEASON_SETTINGS,
  customDate: Date = new Date()
): SeasonStatus {
  if (typeof window !== 'undefined') {
    // 1. Sjekk URL-parameter (?jul=test, ?jul=1, ?jul=av, etc.)
    try {
      const params = new URLSearchParams(window.location.search);
      const julParam = params.get('jul')?.toLowerCase();

      if (julParam === 'test' || julParam === 'preview' || julParam === '1' || julParam === 'ja' || julParam === 'on') {
        return { isChristmas: true, isPreview: true };
      }
      if (julParam === 'av' || julParam === 'off' || julParam === '0' || julParam === 'nei') {
        return { isChristmas: false, isPreview: false };
      }
    } catch {
      // Ignorer URL-feil
    }

    // 2. Sjekk localStorage for førehandsvising som overlever sidelasting
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'true') {
        return { isChristmas: true, isPreview: true };
      }
      if (stored === 'false') {
        return { isChristmas: false, isPreview: false };
      }
    } catch {
      // Ignorer restriksjonar i lokale rammer
    }
  }

  // 3. Manuell overstyring i konfigurasjonen
  if (config.mode === 'manual_on') {
    return { isChristmas: true, isPreview: false };
  }
  if (config.mode === 'manual_off') {
    return { isChristmas: false, isPreview: false };
  }

  // 4. 'auto': Samanlikn dagens dato med juleperioden (1. desember t.o.m 3. januar)
  const month = customDate.getMonth() + 1;
  const day = customDate.getDate();
  const isChristmasSeasonAnnual = (month === 12) || (month === 1 && day <= 3);

  const year = customDate.getFullYear();
  const monthStr = String(month).padStart(2, '0');
  const dayStr = String(day).padStart(2, '0');
  const currentDateStr = `${year}-${monthStr}-${dayStr}`;

  const isActive = isChristmasSeasonAnnual || (currentDateStr >= config.christmasStartDate && currentDateStr <= config.christmasEndDate);

  return { isChristmas: isActive, isPreview: false };
}

/**
 * Slår førehandsvising av/på globalt og varslar alle lyttande komponentar
 */
export function toggleSeasonPreview(enable?: boolean): SeasonStatus {
  if (typeof window === 'undefined') {
    return { isChristmas: false, isPreview: false };
  }

  const current = checkIsChristmas();
  const nextPreviewState = enable !== undefined ? enable : !current.isChristmas;

  // 1. Oppdater localStorage
  try {
    if (nextPreviewState) {
      localStorage.setItem(STORAGE_KEY, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignorer lagringsrestriksjonar
  }

  // 2. Oppdater URL utan omlasting
  try {
    const url = new URL(window.location.href);
    if (nextPreviewState) {
      url.searchParams.set('jul', 'test');
    } else {
      url.searchParams.delete('jul');
    }
    window.history.replaceState({}, '', url.toString());
  } catch {
    // Ignorer URL-feil
  }

  // 3. Send global varsling slik at alle useSeason()-komponentar oppdaterer seg med ein gong!
  try {
    window.dispatchEvent(new CustomEvent(SEASON_EVENT_NAME, { detail: { isPreview: nextPreviewState } }));
  } catch {
    // Ignorer
  }

  return checkIsChristmas();
}

/**
 * React-hook for enkel og synkronisert tilkopling i alle komponentar
 */
export function useSeason() {
  const [seasonState, setSeasonState] = useState<SeasonStatus>(() => checkIsChristmas());

  useEffect(() => {
    const handleSeasonChange = () => {
      setSeasonState(checkIsChristmas());
    };

    // Lytt på vår globale custom event for umiddelbar respons
    window.addEventListener(SEASON_EVENT_NAME, handleSeasonChange);
    // Lytt på popstate (dersom brukaren trykker tilbake/fram i nettlesaren)
    window.addEventListener('popstate', handleSeasonChange);
    // Lytt på endringar frå andre faner
    window.addEventListener('storage', handleSeasonChange);

    // Sjekk kvar time for datoskifte (t.d. midnatt 1. desember)
    const interval = setInterval(handleSeasonChange, 60 * 60 * 1000);

    return () => {
      window.removeEventListener(SEASON_EVENT_NAME, handleSeasonChange);
      window.removeEventListener('popstate', handleSeasonChange);
      window.removeEventListener('storage', handleSeasonChange);
      clearInterval(interval);
    };
  }, []);

  const togglePreview = (enable?: boolean) => {
    const next = toggleSeasonPreview(enable);
    setSeasonState(next);
  };

  return {
    isChristmas: seasonState.isChristmas,
    isPreview: seasonState.isPreview,
    togglePreview,
    config: SEASON_SETTINGS,
  };
}
