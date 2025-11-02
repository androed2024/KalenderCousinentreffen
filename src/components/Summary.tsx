import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import type { Availability } from '../types';
import './Summary.css';

interface SummaryProps {
  userName: string;
  availabilities: Availability[];
}

const Summary = ({ userName: _userName, availabilities }: SummaryProps) => {
  // Get unique users who have entered data, with their number of available days
  const participantsWithEntry = useMemo(() => {
    const userDaysMap = new Map<string, number>();
    
    availabilities.forEach(avail => {
      const currentCount = userDaysMap.get(avail.user_name) || 0;
      userDaysMap.set(avail.user_name, currentCount + 1);
    });
    
    return Array.from(userDaysMap.entries()).map(([name, daysCount]) => ({
      name,
      daysCount
    }));
  }, [availabilities]);

  // Get all unique users
  const allUsers = useMemo(() => {
    return Array.from(new Set(availabilities.map(a => a.user_name)));
  }, [availabilities]);

  // Find dates in November and December where everyone is available
  const commonAvailableDates = useMemo(() => {
    if (allUsers.length === 0) return [];
    
    const currentYear = new Date().getFullYear();
    const november = startOfMonth(new Date(currentYear, 10, 1)); // Month 10 = November
    const december = endOfMonth(new Date(currentYear, 11, 1)); // Month 11 = December
    
    const dateRange = eachDayOfInterval({ start: november, end: december });
    
    // Group availabilities by date
    const availabilityByDate = new Map<string, Set<string>>();
    availabilities.forEach(avail => {
      if (!availabilityByDate.has(avail.date)) {
        availabilityByDate.set(avail.date, new Set());
      }
      availabilityByDate.get(avail.date)!.add(avail.user_name);
    });
    
    // Find dates where all users are available
    const commonDates: string[] = [];
    dateRange.forEach(date => {
      const dateString = format(date, 'yyyy-MM-dd');
      const usersOnDate = availabilityByDate.get(dateString) || new Set();
      
      // Check if all users have marked this date as available
      const allAvailable = allUsers.every(user => usersOnDate.has(user));
      
      if (allAvailable) {
        commonDates.push(dateString);
      }
    });
    
    return commonDates;
  }, [availabilities, allUsers]);

  // Separate dates by month
  const novemberDates = useMemo(() => {
    return commonAvailableDates.filter(date => {
      const d = parseISO(date);
      return d.getMonth() === 10; // November is month 10
    });
  }, [commonAvailableDates]);

  const decemberDates = useMemo(() => {
    return commonAvailableDates.filter(date => {
      const d = parseISO(date);
      return d.getMonth() === 11; // December is month 11
    });
  }, [commonAvailableDates]);

  return (
    <motion.div
      className="summary-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="summary-container"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <motion.div
          className="summary-content"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h1
            className="summary-title"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '2rem' }}
          >
            Ready for Rocking - Cousinentreffen.
          </motion.h1>

          {/* Participants who have entered */}
          {participantsWithEntry.length > 0 && (
            <motion.div
              className="participants-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="participants-list">
                {participantsWithEntry.map((participant, index) => (
                  <motion.div
                    key={participant.name}
                    className="participant-entry"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <span className="participant-name">{participant.name}</span>
                    <span className="participant-date">
                      Tage verfügbar: {participant.daysCount}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Common available dates - moved to bottom */}
          <motion.div
            className="common-dates-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="section-title">Folgende Tage sind möglich:</h2>
            
            {commonAvailableDates.length > 0 ? (
              <>
                {novemberDates.length > 0 && (
                  <div className="month-group">
                    <h3 className="month-header">November</h3>
                    <div className="dates-row">
                      {novemberDates.map(date => {
                        const d = parseISO(date);
                        return (
                          <div key={date} className="date-box">
                            <span className="date-day">{format(d, 'd')}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {decemberDates.length > 0 && (
                  <div className="month-group">
                    <h3 className="month-header">Dezember</h3>
                    <div className="dates-row">
                      {decemberDates.map(date => {
                        const d = parseISO(date);
                        return (
                          <div key={date} className="date-box">
                            <span className="date-day">{format(d, 'd')}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <motion.p
                className="no-common-dates"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Es gibt noch keine Tage, an denen alle Teilnehmer Zeit haben.
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Summary;
