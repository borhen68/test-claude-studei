'use client';

import { useState } from 'react';
import { Calendar, Plus, X, Check, Repeat, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomEvent {
  id?: string;
  date: string; // YYYY-MM-DD
  title: string;
  color?: string;
  recurring?: boolean;
}

interface DateMarkerProps {
  bookId: string;
  year: number;
  month: number; // 1-12
  events?: CustomEvent[];
  onSave?: (events: CustomEvent[]) => void;
}

const EVENT_COLORS = [
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Green', value: '#22C55E' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#A855F7' },
  { name: 'Pink', value: '#EC4899' },
];

export function DateMarker({ bookId, year, month, events = [], onSave }: DateMarkerProps) {
  const [localEvents, setLocalEvents] = useState<CustomEvent[]>(events);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<CustomEvent>({
    date: '',
    title: '',
    color: EVENT_COLORS[0].value,
    recurring: false,
  });

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // 0 = Sunday

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setNewEvent({
      date: dateStr,
      title: '',
      color: EVENT_COLORS[0].value,
      recurring: false,
    });
    setShowAddEvent(true);
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) return;

    const eventToAdd = {
      ...newEvent,
      id: `evt-${Date.now()}`,
    };

    const updated = [...localEvents, eventToAdd];
    setLocalEvents(updated);
    setShowAddEvent(false);
    setNewEvent({
      date: '',
      title: '',
      color: EVENT_COLORS[0].value,
      recurring: false,
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    const updated = localEvents.filter((e) => e.id !== eventId);
    setLocalEvents(updated);
  };

  const handleSave = async () => {
    // Save to backend
    await fetch(`/api/books/${bookId}/customize`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customEvents: localEvents,
      }),
    });

    onSave?.(localEvents);
  };

  const getEventsForDate = (day: number): CustomEvent[] => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return localEvents.filter((e) => e.date === dateStr);
  };

  // Generate calendar grid
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Mark Important Dates</h3>
              <p className="text-sm text-gray-600">
                Add birthdays, anniversaries, and special events
              </p>
            </div>
          </div>

          <div className="text-sm font-medium text-gray-700">
            {new Date(year, month - 1).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dayEvents = getEventsForDate(day);
            const hasEvents = dayEvents.length > 0;

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={cn(
                  'aspect-square relative rounded-lg border-2 transition-all hover:border-orange-400 hover:shadow-md',
                  hasEvents
                    ? 'border-orange-300 bg-orange-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                )}
              >
                <div className="absolute top-1 left-1 right-1 text-sm font-semibold text-gray-700">
                  {day}
                </div>

                {/* Event Dots */}
                {hasEvents && (
                  <div className="absolute bottom-1 left-1 right-1 flex gap-0.5 justify-center flex-wrap">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: event.color }}
                        title={event.title}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">Add Event</h4>
              <button
                onClick={() => setShowAddEvent(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Event Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Name
              </label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="e.g., Mom's Birthday, Anniversary"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Event Color */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Palette className="w-3 h-3" />
                Color
              </label>
              <div className="flex gap-2">
                {EVENT_COLORS.map((colorOption) => (
                  <button
                    key={colorOption.value}
                    onClick={() => setNewEvent({ ...newEvent, color: colorOption.value })}
                    className={cn(
                      'w-8 h-8 rounded-full border-2 transition-all',
                      newEvent.color === colorOption.value
                        ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2'
                        : 'border-gray-300 hover:border-gray-400'
                    )}
                    style={{ backgroundColor: colorOption.value }}
                    title={colorOption.name}
                  />
                ))}
              </div>
            </div>

            {/* Recurring */}
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={newEvent.recurring}
                onChange={(e) => setNewEvent({ ...newEvent, recurring: e.target.checked })}
                className="w-4 h-4 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
              />
              <Repeat className="w-4 h-4" />
              <span>Repeat every year</span>
            </label>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddEvent}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                <Check className="w-4 h-4" />
                Add Event
              </button>
              
              <button
                onClick={() => setShowAddEvent(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event List */}
      {localEvents.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Your Events</h4>
          <div className="space-y-2">
            {localEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: event.color }}
                />
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{event.title}</div>
                  <div className="text-xs text-gray-600">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                    })}
                    {event.recurring && ' • Repeats yearly'}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteEvent(event.id!)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-colors font-semibold shadow-lg"
        >
          <Check className="w-4 h-4" />
          Save Events to Calendar
        </button>
      </div>
    </div>
  );
}
