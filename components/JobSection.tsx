import React, { useState } from 'react';
import { 
  Briefcase, 
  Clock, 
  Calendar, 
  Mail, 
  Phone, 
  FileDown, 
  CheckCircle2, 
  Check, 
  Copy, 
  Users, 
  ShieldCheck, 
  Compass, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

const JobSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const email = "asmund.lilleaas@hotmail.com";
  const phone = "481 60 801";
  const pdfUrl = "/assets/aistudio/stillingsutlysing-dagleg-leiar-A4_f9f6e4bd.pdf";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section id="stilling" className="relative bg-[#202020] text-[#F4EBD9] py-24 sm:py-32 px-6 overflow-hidden border-t-4 border-[#C46E52]">
      {/* Bakgrunnsmønster i industriell risostil */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(white 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}
      ></div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-16 sm:space-y-20">
        
        {/* Header / Stempel & Tittel */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 bg-[#C46E52] text-white font-mono text-xs sm:text-sm font-bold px-3 py-1 uppercase tracking-widest shadow-md">
                <Briefcase className="w-4 h-4" />
                LEDIG STILLING
              </span>
              <span className="font-mono text-xs sm:text-sm text-[#E3A08B] font-bold uppercase tracking-wider">
                FOLKEPUB // HUSNES
              </span>
            </div>

            <div className="flex items-center gap-2 bg-[#141414] border border-[#C46E52]/60 px-3.5 py-1.5 font-mono text-xs sm:text-sm font-bold text-[#E3A08B]">
              <Calendar className="w-4 h-4 text-[#C46E52]" />
              <span>SØK INNAN: 25. NOVEMBER</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="font-mono text-xs sm:text-sm text-[#999] uppercase tracking-[0.3em] font-semibold">
              STØYPERIET PUB AS SØKJER
            </div>
            <div className="flex flex-wrap items-baseline gap-4 sm:gap-6">
              <h2 className="font-heading text-5xl sm:text-7xl md:text-8xl text-white tracking-tight uppercase leading-[0.88]">
                DAGLEG LEIAR
              </h2>
              <span className="inline-block px-4 py-1.5 bg-[#C46E52] text-white font-mono font-bold text-2xl sm:text-4xl shadow-[4px_4px_0px_#000]">
                20 %
              </span>
            </div>
            <p className="font-mono text-lg sm:text-2xl text-[#E3A08B] font-bold tracking-tight italic pt-1">
              «Ansvarleg på papiret. Støttespelar i praksis.»
            </p>
          </div>

          <div className="bg-[#181818] border-l-4 border-[#C46E52] p-5 sm:p-7 text-base sm:text-lg leading-relaxed text-[#D9D2C9] space-y-4 max-w-4xl">
            <p>
              Støyperiet er ein frivillig driven folkepub der det daglege arbeidet vert gjort av sjølvstendige arbeidsgrupper. 
              Som dagleg leiar har du det formelle ansvaret og det endelege ordet når situasjonen krev det, 
              men du skal <strong>rettleie, ikkje detaljstyre</strong>. 
              Du passar på at konseptet held seg, og at den frivillige innsatsen varer over tid.
            </p>
            <p className="font-serif italic text-lg sm:text-xl text-white/90 border-t border-white/10 pt-3">
              «Å vere ein trygg og lett tilgjengeleg møteplass for vaksne, og skape kultur og fellesskap på Husnes.»
            </p>
          </div>
        </div>

        {/* Dei 3 ansvarsområda */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* 1. Rettleiing */}
          <div className="bg-[#1A1A1A] border-2 border-white/10 p-6 sm:p-8 flex flex-col justify-between hover:border-[#C46E52]/60 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#C46E52]/20 border border-[#C46E52] flex items-center justify-center text-[#E3A08B]">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-mono font-bold text-xl uppercase tracking-wider text-white">
                RETTLEIING
              </h3>
              <ul className="space-y-3 font-mono text-xs sm:text-sm text-[#C9BBAF]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C46E52] mt-0.5 font-bold">–</span>
                  <span>Sjå til at gruppene fungerer og kjenner rammene sine</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C46E52] mt-0.5 font-bold">–</span>
                  <span>Støtte gruppene så konseptet og visjonen vert nådd</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C46E52] mt-0.5 font-bold">–</span>
                  <span>Passe på at ingen frivillige eller aksjonærar slit seg ut</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C46E52] mt-0.5 font-bold">–</span>
                  <span>Vere tilgjengeleg på telefon når noko uventa skjer</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 2. Profil og kontakt */}
          <div className="bg-[#1A1A1A] border-2 border-white/10 p-6 sm:p-8 flex flex-col justify-between hover:border-[#C46E52]/60 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#C46E52]/20 border border-[#C46E52] flex items-center justify-center text-[#E3A08B]">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-mono font-bold text-xl uppercase tracking-wider text-white">
                PROFIL OG KONTAKT
              </h3>
              <ul className="space-y-3 font-mono text-xs sm:text-sm text-[#C9BBAF]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C46E52] mt-0.5 font-bold">–</span>
                  <span>Vere puben sitt ansikt utad og ta praten med media</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C46E52] mt-0.5 font-bold">–</span>
                  <span>Halde god dialog med eksterne samarbeidspartnarar</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C46E52] mt-0.5 font-bold">–</span>
                  <span>Kvalitet framfor kvantitet, frå tilbod til atmosfære</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C46E52] mt-0.5 font-bold">–</span>
                  <span>Vere eit «ja-menneske» som likevel vernar om konseptet</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 3. Formelt ansvar */}
          <div className="bg-[#1A1A1A] border-2 border-white/10 p-6 sm:p-8 flex flex-col justify-between hover:border-[#C46E52]/60 transition-colors">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#C46E52]/20 border border-[#C46E52] flex items-center justify-center text-[#E3A08B]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-mono font-bold text-xl uppercase tracking-wider text-white">
                FORMELT ANSVAR
              </h3>
              <ul className="space-y-3 font-mono text-xs sm:text-sm text-[#C9BBAF]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C46E52] mt-0.5 font-bold">–</span>
                  <span>Ta det endelege valet når situasjonen krev det</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C46E52] mt-0.5 font-bold">–</span>
                  <span>Sjå til at rutinar for skjenkekontroll, brann og politi vert følgde</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C46E52] mt-0.5 font-bold">–</span>
                  <span>Rapportere til styret og følgje opp budsjettet</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C46E52] mt-0.5 font-bold">–</span>
                  <span>Ha, eller vere klar til å ta, etablerings- og kunnskapsprøven</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Organisering: Det praktiske har me folk til */}
        <div className="bg-[#D9D2C9] text-[#1A1A1A] p-6 sm:p-10 border-2 border-[#1A1A1A] shadow-[12px_12px_0px_#C46E52]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#C46E52]">
                ORGANISERING OG DRIFT
              </span>
              <h3 className="font-heading text-3xl sm:text-4xl uppercase tracking-tight leading-tight">
                Det praktiske har me folk til.
              </h3>
              <p className="font-mono text-sm sm:text-base leading-relaxed text-[#2D2D2D]">
                Fire sjølvstendige arbeidsgrupper og ein koordineringsansvarleg tek den daglege drifta. 
                Du sørgjer for at dei har det dei treng for å lukkast.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs sm:text-sm font-bold uppercase">
              <div className="p-3.5 bg-[#1A1A1A] text-white border border-black/20 flex items-center gap-2.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#C46E52]"></span>
                <span>TEKNISK AVDELING</span>
              </div>
              <div className="p-3.5 bg-[#1A1A1A] text-white border border-black/20 flex items-center gap-2.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#C46E52]"></span>
                <span>REINHALD OG TRIVSEL</span>
              </div>
              <div className="p-3.5 bg-[#1A1A1A] text-white border border-black/20 flex items-center gap-2.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#C46E52]"></span>
                <span>BARDRIFT</span>
              </div>
              <div className="p-3.5 bg-[#1A1A1A] text-white border border-black/20 flex items-center gap-2.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#C46E52]"></span>
                <span>EVENT OG MARKNADSFØRING</span>
              </div>
              <div className="sm:col-span-2 p-3.5 bg-[#C46E52] text-white flex items-center justify-center gap-2 tracking-wider shadow-sm">
                <Users className="w-4 h-4" />
                <span>+ KOORDINERINGSANSVARLEG</span>
              </div>
            </div>
          </div>
        </div>

        {/* Me tilbyr & Du er */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#181818] border border-white/15 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-[#E3A08B]">
              <Sparkles className="w-5 h-5 text-[#C46E52]" />
              <h4 className="font-mono font-bold text-lg uppercase tracking-wider text-white">
                ME TILBYR
              </h4>
            </div>
            <ul className="space-y-3 font-mono text-sm text-[#C9BBAF]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C46E52] shrink-0 mt-0.5" />
                <span>Fast honorar for ansvaret og tilgjengelegheita</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C46E52] shrink-0 mt-0.5" />
                <span>Fleksibel arbeidstid, du rapporterer til styret</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C46E52] shrink-0 mt-0.5" />
                <span>Ein gjeng engasjerte frivillige som allereie veit kva dei gjer</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#181818] border border-white/15 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-[#E3A08B]">
              <Users className="w-5 h-5 text-[#C46E52]" />
              <h4 className="font-mono font-bold text-lg uppercase tracking-wider text-white">
                DU ER
              </h4>
            </div>
            <ul className="space-y-3 font-mono text-sm text-[#C9BBAF]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C46E52] shrink-0 mt-0.5" />
                <span>Trygg på å ta avgjerder, men liker å gje andre ansvar</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C46E52] shrink-0 mt-0.5" />
                <span>Oppteken av fellesskap og kultur på Husnes</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C46E52] shrink-0 mt-0.5" />
                <span>Ein blid motivator, og det smittar over på andre</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Boks / Søk innan */}
        <div className="bg-gradient-to-br from-[#261E1A] to-[#171717] border-2 border-[#C46E52] p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#E3A08B] font-bold">
                SØKNADSFRIST
              </span>
              <div className="font-heading text-4xl sm:text-5xl text-white tracking-tight uppercase mt-1">
                25. NOVEMBER
              </div>
              <p className="font-mono text-xs sm:text-sm text-[#C9BBAF] mt-1">
                Send ein kort søknad med informasjon om deg sjølv og din motivasjon.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 bg-[#1A1A1A] hover:bg-black text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider border border-white/20 transition-all shadow-md cursor-pointer"
                title="Opne full stillingsutlysing i PDF-format"
              >
                <FileDown className="w-4 h-4 text-[#C46E52]" />
                <span>SJÅ UTLYSINGA (PDF)</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>

              <a
                href={`mailto:${email}?subject=S%C3%B8knad%20dagleg%20leiar%20-%20St%C3%B8yperiet`}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#C46E52] hover:bg-[#A85339] text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>SEND SØKNAD NO</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Kontaktperson detaljar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs sm:text-sm">
            {/* E-post */}
            <div className="bg-[#1A1A1A] p-4 border border-white/10 space-y-1.5">
              <div className="text-[#999] uppercase text-[11px] font-bold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#C46E52]" />
                <span>SØKNAD SENDES TIL</span>
              </div>
              <div className="text-white font-bold break-all flex items-center justify-between gap-2">
                <span>{email}</span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-1 hover:text-[#C46E52] transition-colors cursor-pointer shrink-0"
                  title="Kopier e-postadresse"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/60" />}
                </button>
              </div>
            </div>

            {/* Spørsmål / Telefon */}
            <div className="bg-[#1A1A1A] p-4 border border-white/10 space-y-1.5">
              <div className="text-[#999] uppercase text-[11px] font-bold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#C46E52]" />
                <span>SPØRSMÅL OM STILLINGA?</span>
              </div>
              <div className="text-white font-bold">
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-[#C46E52] transition-colors">
                  Ring Åsmund Lilleaas på {phone}
                </a>
              </div>
            </div>

            {/* Stad */}
            <div className="bg-[#1A1A1A] p-4 border border-white/10 space-y-1.5 sm:col-span-2 lg:col-span-1">
              <div className="text-[#999] uppercase text-[11px] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C46E52]"></span>
                <span>STAD</span>
              </div>
              <div className="text-white font-bold">
                Sentrumsvegen 41, Husnes
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default JobSection;
