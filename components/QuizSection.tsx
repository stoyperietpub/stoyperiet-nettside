import React from 'react';
import Stamp from './Stamp';
import { ArrowRight, Calendar, Clock, Trophy, Users, Award } from 'lucide-react';

interface QuizTeamStanding {
  teamName: string;
  rank: number;
  points: number;
  isShared?: boolean;
}

const QUIZ_STANDINGS: QuizTeamStanding[] = [
  {
    teamName: 'First Class Leftovers',
    rank: 1,
    points: 5,
    isShared: true,
  },
  {
    teamName: 'Me kan betre',
    rank: 1,
    points: 5,
    isShared: true,
  },
  {
    teamName: 'Team quizeladdane',
    rank: 1,
    points: 5,
    isShared: true,
  },
  {
    teamName: 'Valen Badstulaug',
    rank: 4,
    points: 4,
  },
  {
    teamName: 'Kristoffer Tuftas venner',
    rank: 5,
    points: 3,
    isShared: true,
  },
  {
    teamName: 'Plussminusvariantane',
    rank: 5,
    points: 3,
    isShared: true,
  },
  {
    teamName: 'Dei som burde visst betre',
    rank: 7,
    points: 1,
    isShared: true,
  },
  {
    teamName: 'Lått og løye',
    rank: 7,
    points: 1,
    isShared: true,
  },
];

const QuizSection: React.FC = () => {
  const checkinLink = "https://event.checkin.no/233631/quiz-pa-stoyperiet-onsdag-25-november";

  return (
    <section id="quiz" className="bg-[#1A1A1A] text-[#C9BBAF] py-28 md:py-44 px-6 relative overflow-hidden section-divider scroll-mt-24" data-is-dark="true">
      {/* Background halftone & noise details */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#C46E52 2px, transparent 2px)', backgroundSize: '16px 16px' }}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16 pb-8 border-b-2 border-white/10">
          <div className="space-y-4 max-w-3xl">
            <div className="bg-[#C46E52] text-white px-4 py-1 font-mono text-[11px] uppercase tracking-widest inline-block font-bold">
              LOG_05: STØYPERIET KVISSLIGA
            </div>
            <h2 className="font-heading text-6xl sm:text-7xl md:text-9xl uppercase leading-none text-white tracking-tighter">
              KVISS-<br /><span className="text-[#C46E52] riso-print" data-text="LIGAEN">LIGAEN</span>
            </h2>
            <p className="text-lg opacity-80 max-w-2xl leading-relaxed">
              Månadsquizen på Støyperiet er no blitt til liga! Saml laget ditt kvar siste onsdag i månaden, sank poeng og kjemp om kven som stikk av med samanlagtsigeren, heider og ære.
            </p>
          </div>

          <div className="flex-shrink-0 self-start lg:self-center">
            <Stamp text="KL 19:00" color="rust" />
          </div>
        </div>

        {/* Main Content Grid: Registration + League Standings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Quiz Info & Registration (6 cols) */}
          <div className="lg:col-span-6 bg-[#2D2D2D] border-2 border-white/10 p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 bg-[#C46E52] text-white font-mono text-[10px] px-4 py-1 uppercase tracking-widest font-bold">
              KVAR SISTE ONSDAG I MÅNADEN
            </div>

            <div className="space-y-6 pt-4">
              <div className="space-y-3">
                <span className="font-mono text-xs uppercase tracking-widest text-[#C46E52] font-bold block">
                  PÅMELDING & PRAKTISK INFO
                </span>
                <h3 className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase leading-tight">
                  Saml laget ditt og bli med i kampen!
                </h3>
                <p className="text-base opacity-80 leading-relaxed">
                  Kvar siste onsdag i månaden inviterer me til fast kviss på Støyperiet. Me garanterer god stemning, varierte oppgåver og kniving i toppen av ligatabellen.
                </p>
              </div>

              {/* Key info badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-y border-white/10">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#C46E52] flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-mono text-xs uppercase opacity-50 block">QUIZSTART</span>
                    <span className="font-mono font-bold text-white text-base sm:text-lg">Kl. 19:00</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#C46E52] flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-mono text-xs uppercase opacity-50 block">PÅMELDING OPNAR</span>
                    <span className="font-mono font-bold text-white text-base sm:text-lg">1. i månaden kl. 18:00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action / CTA Box */}
            <div className="mt-8 bg-[#C9BBAF] text-[#2D2D2D] p-6 sm:p-8 space-y-5 relative border-2 border-[#1A1A1A] shadow-xl">
              <div className="flex items-center justify-between border-b border-[#2D2D2D]/20 pb-3">
                <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
                  <Users className="w-4 h-4 text-[#C46E52]" />
                  <span>PÅMELDING AV LAG</span>
                </div>
                <span className="bg-[#2D2D2D] text-white font-mono text-[10px] px-2.5 py-0.5 font-bold uppercase">
                  CHECKIN
                </span>
              </div>

              <div className="space-y-1.5">
                <p className="font-mono text-sm sm:text-base uppercase font-bold text-[#C46E52]">
                  SISTE ONSDAG I MÅNADEN KL. 19:00
                </p>
                <p className="text-sm opacity-85 leading-snug">
                  Sikra plass til laget ditt på neste runde i kvissligaen ved å melda dykk på via Checkin.
                </p>
              </div>

              <div className="pt-1">
                <a
                  href={checkinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between w-full bg-[#C46E52] hover:bg-[#1A1A1A] text-white p-4 font-mono font-bold text-sm sm:text-base uppercase tracking-wider transition-all shadow-lg"
                >
                  <span>Meld på lag</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: League Standings / Leaderboard (6 cols) */}
          <div className="lg:col-span-6 bg-[#242424] border-2 border-white/10 p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div>
              {/* Leaderboard Header */}
              <div className="flex items-center justify-between border-b-2 border-white/15 pb-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#C46E52] text-white flex items-center justify-center shadow-md shrink-0">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#C46E52] font-bold block">
                      OVERSIKT OVER LAG OG PLASSERING
                    </span>
                    <h3 className="font-mono text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
                      LIGATABELL
                    </h3>
                  </div>
                </div>

                <span className="bg-black/50 border border-white/15 text-[#C9BBAF] font-mono text-[10px] px-3 py-1 font-bold uppercase tracking-wider">
                  ALLE MED POENG (8 LAG)
                </span>
              </div>

              {/* Standings List */}
              <div className="space-y-3">
                {QUIZ_STANDINGS.map((team) => {
                  const isFirst = team.rank === 1;
                  return (
                    <div
                      key={team.teamName}
                      className={`group relative p-3.5 sm:p-4 border-2 transition-all flex items-center justify-between gap-4 ${
                        isFirst
                          ? 'bg-[#2D2D2D] border-[#C46E52] shadow-lg'
                          : 'bg-black/30 border-white/15 hover:border-white/30'
                      }`}
                    >
                      {/* Left: Rank Badge & Team Name */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-10 h-10 flex flex-col items-center justify-center font-mono font-bold shrink-0 border ${
                            isFirst
                              ? 'bg-[#C46E52] text-white border-[#C46E52]'
                              : 'bg-[#2D2D2D] text-[#C9BBAF] border-white/20'
                          }`}
                        >
                          <span className="text-base leading-none tabular-nums">#{team.rank}</span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-[9px] uppercase tracking-widest text-[#C46E52] font-bold">
                              {team.isShared ? `DELT ${team.rank}. PLASS` : `${team.rank}. PLASS`}
                            </span>
                          </div>
                          <h4 className="font-mono text-base sm:text-lg font-bold text-white tracking-tight truncate">
                            {team.teamName}
                          </h4>
                        </div>
                      </div>

                      {/* Right: Points Badge */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div
                          className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 font-mono font-bold uppercase tracking-wider border ${
                            isFirst
                              ? 'bg-[#C46E52] text-white border-[#C46E52] shadow-sm'
                              : team.points >= 3
                              ? 'bg-white/10 text-white border-white/20'
                              : 'bg-white/5 text-[#C9BBAF] border-white/10'
                          }`}
                        >
                          {isFirst ? (
                            <Trophy className="w-3.5 h-3.5 text-white shrink-0" />
                          ) : (
                            <Award className="w-3.5 h-3.5 text-[#C46E52] shrink-0" />
                          )}
                          <span className="font-black text-base sm:text-lg leading-none text-white">{team.points}</span>
                          <span className="text-[10px] sm:text-xs opacity-90 font-mono">POENG</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer note inside Leaderboard box */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-white/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C46E52] inline-block"></span>
                <span>Tabellen vert oppdatert etter kvar månadsquiz</span>
              </div>
              <span className="text-[#C46E52] font-bold uppercase">SESONG 2026</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default QuizSection;

