'use client';

import { useState } from 'react';
import { Calendar, Plus, X, Heart, Cake, Star, Gift } from 'lucide-react';
import { CalendarStartDropdown } from '../book/CalendarStartSelector';
import { cn } from '@/lib/utils';

interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  icon?: 'heart' | 'cake' | 'star' | 'gift' | 'none';
  recurring?: boolean;
}

interface CalendarCustomizationProps {
  startMonth?: number;
  events?: CalendarEvent[];
  onStartMonthChange?: (month: number) => void;
  onEventsChange?: (events: CalendarEvent[]) => void;
}

const EVENT_ICONS = {
  heart: { icon: Heart, label: 'Anniversary', color: 'text-pink-600' },
  cake: { icon: Cake, label: 'Birthday', color: 'text-purple-600' },
  star: { icon: Star, label: 'Special Day', color: 'text-yellow-600' },
  gift: { icon: Gift, label: 'Holiday', color: 'text-green-600' },
  none: { icon: Calendar, label: 'Event', color: 'text-gray-600' },
};

export function CalendarCustomization({
  startMonth = new Date().getMonth() + 1,
  events = [],
  onStartMonthChange,
  onEventsChange,
}: CalendarCustomizationProps) {
  const [localStartMonth, setLocalStartMonth] = useState(startMonth);
  const [localEvents, setLocalEvents] = useState<CalendarEvent[]>(events);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    icon: 'cake',
    recurring: true,
  });

  const handleStartMonthChange = (month: number) => {
    setLocalStartMonth(month);
    onStartMonthChange?.(month);
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return;

    const event: CalendarEvent = {
      id: Math.random().toString(36).substring(7),
      title: newEvent.title,
      date: newEvent.date,
      icon: (newEvent.icon as any) || 'none',
      recurring: newEvent.recurring || false,
    };

    const updatedEvents = [...localEvents, event];
    setLocalEvents(updatedEvents);
    onEventsChange?.(updatedEvents);

    setNewEvent({ title: '', icon: 'cake', recurring: true });
    setShowAddEvent(false);
  };

  const handleRemoveEvent = (id: string) => {
    const updatedEvents = localEvents.filter((e) => e.id !== id);
    setLocalEvents(updatedEvents);
    onEventsChange?.(updatedEvents);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Calendar Customization</h3>
            <p className="text-sm text-gray-600">Choose start month and add special dates</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Calendar Start Month
          </label>
          <CalendarStartDropdown value={localStartMonth} onChange={handleStartMonthChange} />
          <p className="mt-2 text-sm text-gray-600">
            💡 Start from any month - perfect for gifting from a birthday or anniversary!
          </p>
        </div>

        {localEvents.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Your Calendar Events ({localEvents.length})
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {localEvents.map((event) => {
                const IconConfig = EVENT_ICONS[event.icon || 'none'];
                const Icon = IconConfig.icon;
                return (
                  <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className={cn('p-2 bg-white rounded-lg', IconConfig.color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{event.title}</div>
                      <div className="text-sm text-gray-600">{event.date}{event.recurring && ' • Repeats yearly'}</div>
                    </div>
                    <button onClick={() => handleRemoveEvent(event.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {showAddEvent && (
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg space-y-3">
            <input type="text" value={newEvent.title || ''} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="Event Name" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            <input type="text" value={newEvent.date || ''} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} placeholder="MM-DD" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            <button onClick={handleAddEvent} className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg">
              <Plus className="w-4 h-4 inline mr-2" />Add Event
            </button>
          </div>
        )}

        {!showAddEvent && (
          <button onClick={() => setShowAddEvent(true)} className="w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-purple-400">
            <Plus className="w-5 h-5 inline mr-2" />Add Custom Event
          </button>
        )}
      </div>
    </div>
  );
}
