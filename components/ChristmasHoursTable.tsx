import React from 'react';

export interface ChristmasScheduleRow {
  date: string;
  hours: string;
  isOpen: boolean;
}

export const CHRISTMAS_SCHEDULE: ChristmasScheduleRow[] = [
  { date: '23. desember', hours: 'Stengd', isOpen: false },
  { date: '25., 26. og 27. desember', hours: '16:00–00:00', isOpen: true },
  { date: '28. og 29. desember', hours: 'Stengd', isOpen: false },
  { date: '30. desember', hours: '12:00–00:00', isOpen: true },
  { date: '31. desember', hours: 'Stengd', isOpen: false },
  { date: '1., 2. og 3. januar', hours: 'Stengd', isOpen: false },
];

interface ChristmasHoursTableProps {
  className?: string;
  showTitle?: boolean;
}

export const ChristmasHoursTable: React.FC<ChristmasHoursTableProps> = ({
  className = '',
  showTitle = true,
}) => {
  return (
    <div className={`w-full max-w-3xl font-sans text-[#1A1A1A] ${className}`}>
      {showTitle && (
        <div className="mb-6 flex items-baseline gap-2.5">
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1A1A1A] tracking-tight">
            Opningstider i jula
          </h2>
        </div>
      )}

      {/* Tabellhovud */}
      <div className="w-full border-b border-[#1A1A1A] pb-2 grid grid-cols-12 text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#1A1A1A]/60">
        <div className="col-span-7 sm:col-span-6">DATO</div>
        <div className="col-span-5 sm:col-span-6">OPNINGSTID</div>
      </div>

      {/* Rader med eksakte juleopningstider */}
      <div className="divide-y divide-[#1A1A1A]/15 border-b border-[#1A1A1A]/15">
        {CHRISTMAS_SCHEDULE.map((row, idx) => (
          <div
            key={idx}
            className={`grid grid-cols-12 py-3.5 sm:py-4 items-center text-sm sm:text-base transition-colors ${
              row.isOpen ? 'bg-[#C46E52]/5 -mx-2 px-2 rounded-xs' : ''
            }`}
          >
            <div className="col-span-7 sm:col-span-6 font-medium text-[#1A1A1A] pr-2">
              {row.date}
            </div>
            <div className="col-span-5 sm:col-span-6 flex items-center gap-2">
              <span
                className={`tracking-tight ${
                  row.isOpen
                    ? 'font-bold text-[#1A1A1A]'
                    : 'text-[#1A1A1A]/70 font-normal'
                }`}
              >
                {row.hours}
              </span>
              {row.isOpen && (
                <span className="inline-block w-2 h-2 rounded-full bg-[#C46E52] animate-pulse" title="Ope denne kvelden" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChristmasHoursTable;
