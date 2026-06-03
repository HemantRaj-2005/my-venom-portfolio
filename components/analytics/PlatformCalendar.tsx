"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from "lucide-react";

interface PlatformCalendarProps {
  data: { date: string; count: number }[];
  title: string;
  variant: "github" | "dsa";
  selectedDate?: string;
  onDateSelect?: (date: string) => void;
}


export default function PlatformCalendar({
  data,
  title,
  variant,
  selectedDate,
  onDateSelect,
}: PlatformCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedYear, setSelectedYear] = useState<number>(getYear(new Date()));

  // Filter data for selected year
  const yearData = data.filter(item => {
    const year = new Date(item.date).getFullYear();
    return year === selectedYear;
  });

  // Create lookup for faster access
  const dateLookup = yearData.reduce((acc, item) => {
    acc[item.date] = item.count;
    return acc;
  }, {} as Record<string, number>);

  const selectedDateObj = selectedDate ? new Date(selectedDate) : undefined;

  const selectedDateData = selectedDate ? dateLookup[selectedDate] || 0 : 0;

  return (
    <div className="space-y-4 bg-zinc-950/50 border border-zinc-900 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">{title} {selectedYear}</h3>
        </div>

        {/* Year Selector */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-zinc-200 font-mono"
        >
          {Array.from({ length: 10 }, (_, i) => selectedYear - 5 + i).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Calendar */}
      <div className="border border-zinc-900 rounded-lg">
        <Calendar
          mode="single"
          selected={selectedDateObj}
          onSelect={(date) => {
            if (date instanceof Date) {
              onDateSelect?.(format(date, 'yyyy-MM-dd'));
            }
          }}
          className="p-2"
        />
      </div>

      {/* Daily Summary */}
      {selectedDate && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 mt-3">
          <h4 className="text-xs font-mono uppercase text-cyan-400 mb-2">
            {format(new Date(selectedDate), 'MMMM d, yyyy')}
          </h4>
          <div className="flex justify-between items-center">
            <span className="text-xs text-zinc-300 font-medium">
              {variant === "github" ? "Commits" : "Problems solved"}
            </span>
            <span className={`text-xs font-bold ${
              variant === "github" ? "text-green-400" : "text-blue-400"
            }`}>
              {selectedDateData}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}