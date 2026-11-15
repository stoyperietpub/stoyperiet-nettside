
import React, { useState } from 'react';

interface MenuItem {
  name: string;
  price: string;
}

interface InfoItemProps {
  title: string;
  desc: string;
  num: string;
  items: MenuItem[];
  isOpen: boolean;
  onClick: () => void;
}

const InfoItem: React.FC<InfoItemProps> = ({ title, desc, num, items, isOpen, onClick }) => (
  <div className={`group relative border-b-2 border-[#2D2D2D] transition-all duration-300 ${isOpen ? 'bg-white/40' : 'hover:bg-white/20'}`}>
    <button 
      onClick={onClick}
      className="flex w-full text-left items-center py-8 px-6 md:px-10 focus:outline-none"
    >
      <div className="flex-1">
        <div className="flex items-center gap-6">
          <span className="font-mono text-[11px] font-bold text-[#C46E52]">{num}</span>
          <h3 className="font-mono text-2xl md:text-3xl group-hover:text-[#C46E52] transition-colors font-bold uppercase tracking-tight">{title}</h3>
        </div>
      </div>
      <div className={`w-10 h-10 border-2 border-[#2D2D2D] flex items-center justify-center font-bold text-xl transition-all duration-300 ${isOpen ? 'bg-[#2D2D2D] text-white rotate-45' : 'group-hover:bg-[#C46E52] group-hover:border-[#C46E52] group-hover:text-white'}`}>
        +
      </div>
    </button>

    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
      <div className="px-6 md:px-10 pb-12">
        <p className="text-sm font-medium mb-8 opacity-70 max-w-2xl">
          {desc}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-1 md:gap-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center border-b border-[#2D2D2D]/10 py-4 md:py-3 gap-4">
              <span className="font-bold text-sm uppercase tracking-tight leading-tight">{item.name}</span>
              <span className="font-mono text-[11px] font-bold bg-[#2D2D2D] text-white px-2 py-0.5 whitespace-nowrap">{item.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const PubInfoList: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const menuData = [
    {
      num: "01",
      title: "PÅ TAPP",
      desc: "Øl og sider på tapp.",
      items: [
        { name: "Frydenlund Pilsner", price: "109,- / 149,-" },
        { name: "Schous Pilsner (0.4L)", price: "119,-" },
        { name: "Frydenlund Juicy IPA", price: "119,- / 159,-" },
        { name: "Brooklyn Stonewall IPA", price: "119,- / 159,-" },
        { name: "Crowmoor Apple Cider (0.4L)", price: "139,-" }
      ]
    },
    {
      num: "02",
      title: "ØL PÅ FLASKE & BOKS",
      desc: "Øl på flaske og boks.",
      items: [
        { name: "Carlsberg Pilsner", price: "109,-" },
        { name: "Brooklyn Lager", price: "139,-" },
        { name: "1664 Blanc", price: "129,-" },
        { name: "Hansa Pilsner (Boks)", price: "119,-" },
        { name: "Guinness (Boks)", price: "139,-" },
        { name: "Schous Pilsner Lite", price: "129,-" }
      ]
    },
    {
      num: "03",
      title: "VIN & BOBLER",
      desc: "Raudvin, kvitvin, rosévin og musserande vin. Glas eller flaske.",
      items: [
        { name: "Husets Raudvin (GLAS/FL)", price: "119,- / 479,-" },
        { name: "Barbera d'Asti (FL)", price: "699,-" },
        { name: "Husets Kvitvin (GLAS/FL)", price: "119,- / 499,-" },
        { name: "Soalheiro Alvarinho (FL)", price: "699,-" },
        { name: "Husets Rosé (GLAS/FL)", price: "119,- / 499,-" },
        { name: "Knewitz rosé trocken 2024 (FL)", price: "699,-" },
        { name: "Husets Bobler (GLAS/FL)", price: "129,- / 549,-" },
        { name: "Crémant d'Alsace (FL)", price: "639,-" },
        { name: "Castellblanc Cava Organic Brut Nature flaske", price: "499,-" },
        { name: "Marcel pierre brut champagne (FL)", price: "999,-" }
      ]
    },
    {
      num: "04",
      title: "FRÅ HARDANGER",
      desc: "Lokale og friske smakar direkte frå fagre Hardanger.",
      items: [
        { name: "Fjåg Eplesider (Glas/FL)", price: "109,- / 419,-" },
        { name: "Kjørbar Harding Alkoholfri Sider (FL)", price: "189,-" },
        { name: "Eplejuice frå hardanger", price: "79,-" }
      ]
    },
    {
      num: "05",
      title: "DRINKAR",
      desc: "Klassiske drinkar.",
      items: [
        { name: "Gin & Tonic", price: "139,-" },
        { name: "Aperol Spritz", price: "139,-" }
      ]
    },
    {
      num: "06",
      title: "SØTT & FRISKT",
      desc: "Cider, rusbrus og seltzers.",
      items: [
        { name: "Hard Seltzer Fersken/Lime", price: "109,-" },
        { name: "Sommersby Cider (Pære / Grapefrukt Lite)", price: "109,-" },
        { name: "Breezer Lime", price: "109,-" },
        { name: "Bulmers Red Berries & Lime 50 CL", price: "159,-" },
        { name: "Ginger Joe Original", price: "109,-" }
      ]
    },
    {
      num: "07",
      title: "ALKOHOLFRITT",
      desc: "Gode alternativ utan alkohol. Brus, kaffi og alkoholfritt øl.",
      items: [
        { name: "Sparkling Grapefruit", price: "49,-" },
        { name: "Munkholm radler bringebær & sitron", price: "69,-" },
        { name: "Solo / Farris / 7up / Pepsi Max / Coca Cola", price: "49,-" },
        { name: "Brus frå Safteriet (Kirsebær / Hylleblomst & Sitron)", price: "79,-" },
        { name: "Ginger Joe Alkoholfri Ingefærøl", price: "79,-" },
        { name: "Löfbergs Lila Iskaffe (Salted Caramel / Espresso + Milk)", price: "59,-" },
        { name: "Carlsberg Non-Alc", price: "59,-" },
        { name: "Svart Traktekaffi", price: "39,-" }
      ]
    },
    {
      num: "08",
      title: "BRENNEVIN & LIKØR",
      desc: "Brennevin og likør.",
      items: [
        { name: "Konjakk / Whisky / Akevitt", price: "119,-" },
        { name: "Gammel Reserve Akevitt 4 CL", price: "119,-" },
        { name: "Baileys", price: "99,-" }
      ]
    },
    {
      num: "09",
      title: "PORTVIN",
      desc: "Klassisk og fyldig portvin.",
      items: [
        { name: "Fiin gammel portvin 8 cl", price: "109,-" }
      ]
    },
    {
      num: "10",
      title: "SNACKS",
      desc: "Noko salt å bite i attåt drikka.",
      items: [
        { name: "Chips (Sørlandschips)", price: "49,-" },
        { name: "Nøtter", price: "39,-" }
      ]
    }
  ];

  return (
    <section id="meny" className="py-24 md:py-48 px-6 bg-[#C9BBAF] relative section-divider scroll-mt-24">
      <div className="max-w-5xl mx-auto">
        <div className="mb-20">
          <div className="inline-block bg-[#2D2D2D] text-white px-3 py-1 font-mono text-[10px] uppercase mb-4">
            LOG_03_MENU
          </div>
          <h2 className="font-heading text-6xl md:text-8xl text-[#2D2D2D] leading-[0.9]">
            DRIKKE<br/><span className="text-[#C46E52]">LISTA</span>
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <span className="inline-flex items-center gap-2 bg-[#2D2D2D] text-white px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C46E52]"></span>
              20+ ALDERSGRENSE ETTER KL. 19:00
            </span>
            <span className="font-mono text-xs text-[#2D2D2D]/70 uppercase tracking-wide">
              (Alle aldrar velkomne før kl. 19:00)
            </span>
          </div>
        </div>

        <div className="border-t-2 border-[#2D2D2D]">
          {menuData.map((category, index) => (
            <InfoItem 
              key={category.num}
              num={category.num} 
              title={category.title} 
              desc={category.desc}
              items={category.items}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* Feedback Button */}
        <div className="mt-16 flex justify-center">
          <a 
            href="https://forms.gle/dhDn5eDLUfYJTbSn8"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-[#2D2D2D] text-[#2D2D2D] font-mono text-sm md:text-base font-bold uppercase transition-all hover:bg-[#2D2D2D] hover:text-white"
          >
            <span>Saknar du noko i menyen?</span>
            <span className="text-xl transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default PubInfoList;
