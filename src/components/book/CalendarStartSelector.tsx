'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';

interface CalendarStartSelectorProps {
  initialMonth?: number;
  onMonthChange?: (month: number) => void;
  disabled?: boolean;
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function CalendarStartSelector({
  initialMonth = new Date().getMonth() + 1,
  onMonthChange,
  disabled = false,
}: CalendarStartSelectorProps) {
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);

  const handleChange = (month: number) => {
    setSelectedMonth(month);
    onMonthChange?.(month);
  };

  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-5 h-5 text-purple-600" />
        <label className="font-semibold text-gray-900">
          Calendar Start Month
        </label>
      </div>

      <select
        value={selectedMonth}
        onChange={(e) => handleChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {MONTHS.map((month, index) => {
          const monthValue = index + 1;
          const isCurrent = monthValue === currentMonth;
          
          return (
            <option key={monthValue} value={monthValue}>
              {month} {isCurrent && '(Current Month)'}
            </option>
          );
        })}
      </select>

      <p className="mt-2 text-sm text-gray-600">
        Your calendar will start from <strong>{MONTHS[selectedMonth - 1]}</strong>.
        Perfect for gifting — start from a birthday or anniversary month!
      </p>

      {selectedMonth !== currentMonth && (
        <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-sm text-purple-800">
            💡 <strong>Tip:</strong> Starting from {MONTHS[selectedMonth - 1]} is great for:
            {selectedMonth === 12 && ' holiday gifts, New Year planning'}
            {selectedMonth === 1 && ' New Year resolutions, fresh starts'}
            {selectedMonth === 6 && ' summer memories, vacation planning'}
            {![12, 1, 6].includes(selectedMonth) && ' special occasions and milestones'}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Compact version for use in forms
 */
export function CalendarStartDropdown({
  value,
  onChange,
  disabled = false,
}: {
  value: number;
  onChange: (month: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Start from:
      </label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
      >
        {MONTHS.map((month, index) => (
          <option key={index + 1} value={index + 1}>
            {month}
          </option>
        ))}
      </select>
    </div>
  );
}
