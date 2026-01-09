"use client";

interface WeekSelectorProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getSunday(monday: Date): Date {
  const d = new Date(monday);
  d.setDate(d.getDate() + 6);
  return d;
}

function getWeekNumber(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function WeekSelector({ selectedDate, onChange }: WeekSelectorProps) {
  const monday = getMonday(selectedDate);
  const sunday = getSunday(monday);
  const weekNumber = getWeekNumber(monday);
  const year = monday.getFullYear();

  const goToPreviousWeek = () => {
    const prev = new Date(monday);
    prev.setDate(prev.getDate() - 7);
    onChange(prev);
  };

  const goToNextWeek = () => {
    const next = new Date(monday);
    next.setDate(next.getDate() + 7);
    onChange(next);
  };

  const goToCurrentWeek = () => {
    onChange(new Date());
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={goToPreviousWeek}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Previous week"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div className="text-center min-w-[160px]">
        <div className="text-lg font-medium text-gray-900">
          W{weekNumber.toString().padStart(2, "0")} {year}
        </div>
        <div className="text-sm font-light text-gray-500">
          {formatDateShort(monday)} - {formatDateShort(sunday)}
        </div>
      </div>

      <button
        onClick={goToNextWeek}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Next week"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <button
        onClick={goToCurrentWeek}
        className="px-3 py-1.5 text-xs font-light text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
      >
        Today
      </button>
    </div>
  );
}
