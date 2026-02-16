'use client';

import { useState } from 'react';
import { Schedule } from '@/types/saas';

interface CalendarViewProps {
    schedules: Schedule[];
}

export default function CalendarView({ schedules }: CalendarViewProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const days = [];
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    // Empty slots for start of month
    for (let i = 0; i < startDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-14 sm:h-20 border-b border-r border-slate-50 bg-slate-50/30"></div>);
    }

    // Days with schedules
    for (let d = 1; d <= totalDays; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const daySchedules = schedules.filter(s => s.event_date === dateStr);
        const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();

        days.push(
            <div key={d} className={`h-14 sm:h-20 border-b border-r border-slate-100 p-1 relative hover:bg-slate-50 transition-colors ${isToday ? 'bg-emerald-50/50' : ''}`}>
                <span className={`text-[10px] font-bold ${isToday ? 'text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md' : 'text-slate-400'}`}>{d}</span>
                {daySchedules.map((s, i) => (
                    <div key={i} className="mt-1 px-1.5 py-0.5 bg-[var(--color-primary)] text-white text-[8px] font-black rounded truncate shadow-sm uppercase tracking-tighter" title={s.khatib_name}>
                        {s.khatib_name}
                    </div>
                ))}
            </div>
        );
    }

    const nextMonth = () => setCurrentMonth(new Date(year, month + 1));
    const prevMonth = () => setCurrentMonth(new Date(year, month - 1));

    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-black text-[var(--color-text-primary)] uppercase tracking-widest text-sm">
                    {monthNames[month]} {year}
                </h3>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 transition-colors">←</button>
                    <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 transition-colors">→</button>
                </div>
            </div>
            <div className="grid grid-cols-7 text-center">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d, i) => (
                    <div key={i} className="py-2 text-[10px] font-black uppercase text-slate-400 border-b border-r border-slate-100 bg-slate-50/30">{d}</div>
                ))}
                {days}
            </div>
        </div>
    );
}
