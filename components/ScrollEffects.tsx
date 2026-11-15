import React, { useEffect } from 'react';

/**
 * Roleg rørsle når ein skrollar:
 * 1. Innhaldet i kvar seksjon glir mjukt inn når det kjem til syne (litt forskyvd).
 * 2. Ein tynn koparstrek øvst viser kor langt ned på sida ein er.
 * Slår seg av for dei som har valt «redusert rørsle» i systemet sitt.
 */
const ScrollEffects: React.FC = () => {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Framdriftsstrek
    const bar = document.getElementById('scroll-progress');
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        if (bar) bar.style.transform = `scaleX(${p})`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (reduce || !('IntersectionObserver' in window)) {
      return () => window.removeEventListener('scroll', onScroll);
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    const tag = () => {
      const blocks = document.querySelectorAll<HTMLElement>(
        'main section:not(#heim) > div > *:not(.reveal):not([id]), footer > div > *:not(.reveal):not([id])'
      );
      blocks.forEach((el) => {
        const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
        const i = Math.min(siblings.indexOf(el), 4);
        el.classList.add('reveal');
        el.style.transitionDelay = `${i * 90}ms`;
        // Det som alt er på skjermen, skal ikkje blinke
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.9 && r.bottom > 0) el.classList.add('is-visible');
        else io.observe(el);
      });
    };
    tag();
    // Seksjonar som kjem til seinare (t.d. julemodus) blir òg med
    const mo = new MutationObserver(() => tag());
    const main = document.querySelector('main');
    if (main) mo.observe(main, { childList: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <div
        id="scroll-progress"
        aria-hidden="true"
        className="fixed top-0 left-0 w-full h-[3px] bg-[#C46E52] origin-left z-[200] pointer-events-none"
        style={{ transform: 'scaleX(0)' }}
      />
      <style>{`
        .reveal {
          opacity: 0;
          translate: 0 28px;
          transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1), translate 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .reveal.is-visible {
          opacity: 1;
          translate: 0 0;
        }
        html { scroll-behavior: smooth; }
        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1; translate: 0 0; transition: none; }
          html { scroll-behavior: auto; }
        }
      `}</style>
    </>
  );
};

export default ScrollEffects;
