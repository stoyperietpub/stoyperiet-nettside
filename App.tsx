
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import DugnadSection from './components/DugnadSection';
import PubInfoList from './components/PubInfoList';
import EventsHubSection from './components/EventsHubSection';
import QuizSection from './components/QuizSection';
import JobSection from './components/JobSection';
import Footer from './components/Footer';
import ChristmasOverlay from './components/ChristmasOverlay';
import JuleprogramSection from './components/JuleprogramSection';
import ScrollEffects from './components/ScrollEffects';
import { useSeason } from './seasonConfig';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { isChristmas } = useSeason();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#C9BBAF] z-[100] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-[#C46E52] overprint opacity-20 -rotate-3 translate-y-[-20%]"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-[#BCC2C7] overprint opacity-20 rotate-3 translate-y-[20%]"></div>
        <h1 className="font-mono text-7xl md:text-9xl text-[#2D2D2D] animate-pulse uppercase tracking-tighter relative z-10 font-bold">
          STØY-<br/>PERIET
        </h1>
        <div className="font-mono text-[10px] uppercase tracking-[1em] mt-8 animate-bounce text-[#2D2D2D]">LOADING_LITHO_SYSTEM</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen selection:bg-[#C46E52] selection:text-white relative">
      <ChristmasOverlay />
      <ScrollEffects />
      <Header />
      <main>
        <Hero />
        <JuleprogramSection />
        <JobSection />
        <Marquee christmas={isChristmas} text={isChristmas
          ? "JULESHOW • MOONDANCE • ALLSONGBINGO • FØRSTEJULEDAGSKVISS • STENGT 24. – ME ÒG HAR FAMILIE •"
          : "109 ELDSJELER • LOKAL DUGNAD • STØYPERIET • 20+ ETTER KL. 19:00 • GODT SELSKAP • MUSIKK •"} />
        <DugnadSection />
        <PubInfoList />
        <EventsHubSection />
        <QuizSection />
        <Marquee christmas={isChristmas} text={isChristmas
          ? "GOD JUL • FELLESSKAP I FLYTANDE FORM • VARMT INNE, VÅTT UTE • GODT NYTT ÅR • STØYPERIET •"
          : "KRAFT • TRADISJON • STØYPERIET • BRYGGEVART • ELDSJELER • GOD SNACKS • KULTUR •"} reverse />
      </main>
      <Footer />
    </div>
  );
};

export default App;
