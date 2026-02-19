'use client';

import { useState } from 'react';
import { Calendar, Clock, Plus, Trash2 } from 'lucide-react';

interface Event {
  _id: string;
  id: string;
  title: string;
  startTime: number;
  endTime?: number;
  source: 'google' | 'cron' | 'manual';
  description?: string;
}

interface CalendarViewProps {
  events: Event[];
}

export default function CalendarView({ events }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getSourceBadge = (source: string) => {
    const styles: Record<string, string> = {
      google: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      cron: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      manual: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    };
    const icons: Record<string, string> = {
      google: '📧',
      cron: '⏰',
      manual: '📝',
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[source]}`}>
        <span className="mr-1">{icons[source]}</span>
        {source}
      </span>
    );
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
    });
  };

  const formatDuration = (start: number, end?: number) => {
    if (!end) return 'Без конца';
    const duration = end - start;
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    if (hours > 0) {
      return `${hours}ч ${minutes}м`;
    }
    return `${minutes}м`;
  };

  // Группировка событий по дням
  const eventsByDay = events.reduce((acc, event) => {
    const date = new Date(event.startTime).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const sortedDays = Object.keys(eventsByDay).sort();

  return (
    <div className="space-y-4">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Календарь
        </h3>
        <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-1" />
          Добавить
        </button>
      </div>

      {/* Список событий */}
      <div className="space-y-6">
        {sortedDays.map(day => (
          <div key={day}>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 sticky top-0 bg-gray-50 dark:bg-gray-900 py-2">
              {formatDate(new Date(day).getTime())}
            </h4>
            <div className="space-y-2">
              {eventsByDay[day].map(event => (
                <div
                  key={event._id}
                  className="flex items-start justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {event.title}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTime(event.startTime)}
                          {event.endTime && (
                            <>
                              {' - '}
                              {formatTime(event.endTime)}
                              <span className="ml-2">
                                ({formatDuration(event.startTime, event.endTime)})
                              </span>
                            </>
                          )}
                        </div>
                        {getSourceBadge(event.source)}
                      </div>
                      {event.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Нет событий
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
