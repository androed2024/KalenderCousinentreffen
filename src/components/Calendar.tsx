import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import MonthNavigation from './MonthNavigation';
import DayCell from './DayCell';
import type { Availability } from '../types';
import './Calendar.css';

interface CalendarProps {
  userName: string;
  availabilities: Availability[];
  onToggleAvailability: (date: string) => void;
  onSave?: () => void;
}

const TIMEZONE = 'Europe/Berlin';

const USER_COLORS = [
  '#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd93d', '#a29bfe',
  '#fd79a8', '#fdcb6e', '#6c5ce7', '#00b894', '#e17055',
];

const Calendar = ({ userName, availabilities, onToggleAvailability, onSave }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return utcToZonedTime(now, TIMEZONE);
  });

  const [userColorMap, setUserColorMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const uniqueUsers = Array.from(new Set(availabilities.map(a => a.user_name)));
    const newColorMap = new Map<string, string>();
    
    uniqueUsers.forEach((user, index) => {
      newColorMap.set(user, USER_COLORS[index % USER_COLORS.length]);
    });
    
    setUserColorMap(newColorMap);
  }, [availabilities]);

  const getUserColor = (userName: string): string => {
    return userColorMap.get(userName) || USER_COLORS[0];
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const today = useMemo(() => utcToZonedTime(new Date(), TIMEZONE), []);

  const availabilityByDate = useMemo(() => {
    const map = new Map<string, string[]>();
    availabilities.forEach(avail => {
      if (!map.has(avail.date)) {
        map.set(avail.date, []);
      }
      map.get(avail.date)!.push(avail.user_name);
    });
    return map;
  }, [availabilities]);

  const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  return (
    <motion.div
      className="calendar-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Save Button - at the very top */}
      {onSave && (
        <motion.div
          className="calendar-save-section"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <button
            className="save-button"
            onClick={onSave}
          >
            Save
          </button>
        </motion.div>
      )}

      <div className="calendar-header">
        <h1 className="calendar-title">Hallo, {userName}! 👋</h1>
        <p className="calendar-subtitle">Wähle die Tage aus, an denen du verfügbar bist</p>
      </div>

      <MonthNavigation
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />

      <div className="calendar-grid-container">
        <div className="weekday-headers">
          {weekDays.map(day => (
            <div key={day} className="weekday-header">{day}</div>
          ))}
        </div>

        <div className="calendar-grid">
          {calendarDays.map(day => {
            const dateString = format(day, 'yyyy-MM-dd');
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            const isToday = isSameDay(day, today);
            const users = availabilityByDate.get(dateString) || [];
            const isUserAvailable = users.includes(userName);

            return (
              <DayCell
                key={dateString}
                date={day}
                dateString={dateString}
                isCurrentMonth={isCurrentMonth}
                isToday={isToday}
                users={users}
                currentUser={userName}
                isUserAvailable={isUserAvailable}
                onToggle={onToggleAvailability}
                getUserColor={getUserColor}
              />
            );
          })}
        </div>
      </div>

      {userColorMap.size > 0 && (
        <motion.div
          className="calendar-legend"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="legend-title">Teilnehmer</h3>
          <div className="legend-items">
            {Array.from(userColorMap.entries()).map(([user, color]) => (
              <div key={user} className="legend-item">
                <div className="legend-color" style={{ backgroundColor: color }} />
                <span className="legend-name">{user}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Calendar;
