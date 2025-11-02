import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import type { Availability } from '../types';
import './Celebration.css';
import './Summary.css';

interface CelebrationProps {
  onComplete?: () => void;
  userName: string;
  availabilities: Availability[];
}

const Celebration = ({ onComplete, userName: _userName, availabilities }: CelebrationProps) => {
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    // Play celebration sound using Web Audio API
    const playSound = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Create a more complex celebration sound
        const sounds = [
          { freq: 523.25, time: 0 },     // C5
          { freq: 659.25, time: 0.15 },  // E5
          { freq: 783.99, time: 0.3 },   // G5
          { freq: 1046.50, time: 0.5 },  // C6
        ];

        sounds.forEach(({ freq, time }) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = freq;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0, audioContext.currentTime + time);
          gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + time + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + time + 0.3);
          
          oscillator.start(audioContext.currentTime + time);
          oscillator.stop(audioContext.currentTime + time + 0.3);
        });

        // Add some white noise for "clapping" effect
        const bufferSize = audioContext.sampleRate * 0.5;
        const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = audioContext.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        const noiseGain = audioContext.createGain();
        whiteNoise.connect(noiseGain);
        noiseGain.connect(audioContext.destination);
        
        noiseGain.gain.setValueAtTime(0, audioContext.currentTime);
        noiseGain.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        whiteNoise.start(audioContext.currentTime);
        whiteNoise.stop(audioContext.currentTime + 0.2);
      } catch (err) {
        console.log('Audio play failed:', err);
      }
    };

    playSound();

    // Show summary content after 2 seconds
    const timer = setTimeout(() => {
      setShowSummary(true);
      // Don't call onComplete - stay on this page
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

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

  // Generate explosion particles
  const particles = Array.from({ length: 50 }, (_, i) => i);

  return (
    <motion.div
      className="celebration-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="celebration-content-wrapper">
        {/* Main "Juhu" text with explosion effect */}
        <motion.h1
          className="celebration-title"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.5, 1.2, 1],
            opacity: [0, 1, 1, 1],
            rotate: [0, 360, 0]
          }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut"
          }}
        >
          Juhu
        </motion.h1>
        
        {/* Explosion particles radiating outward */}
        <div className="explosion-particles">
          {particles.map((particle) => {
            const angle = (particle / particles.length) * 360;
            const distance = 200 + Math.random() * 100;
            const delay = Math.random() * 0.3;
            
            return (
              <motion.div
                key={particle}
                className="particle"
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 1,
                  opacity: 1 
                }}
                animate={{
                  x: Math.cos((angle * Math.PI) / 180) * distance,
                  y: Math.sin((angle * Math.PI) / 180) * distance,
                  scale: [1, 1.5, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 1.2,
                  delay: delay,
                  ease: "easeOut"
                }}
              >
                {['🎉', '✨', '🌟', '💥', '🎊'][particle % 5]}
              </motion.div>
            );
          })}
        </div>

        {/* Secondary explosion circles */}
        <motion.div
          className="explosion-circle"
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ 
            scale: [0, 2, 3],
            opacity: [0.8, 0.4, 0]
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut"
          }}
        />
        <motion.div
          className="explosion-circle"
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ 
            scale: [0, 1.5, 2.5],
            opacity: [0.6, 0.3, 0]
          }}
          transition={{
            duration: 1.2,
            delay: 0.2,
            ease: "easeOut"
          }}
        />

        {/* Summary content - appears after explosion */}
        {showSummary && (
          <motion.div
            className="celebration-summary-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.h2
              className="celebration-summary-title"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            >
              Ready for Rocking - Cousinentreffen.
            </motion.h2>

            {/* Participants who have entered */}
            {participantsWithEntry.length > 0 && (
              <motion.div
                className="participants-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="participants-list">
                  {participantsWithEntry.map((participant, index) => (
                    <motion.div
                      key={participant.name}
                      className="participant-entry"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
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

            {/* Common available dates */}
            <motion.div
              className="common-dates-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="section-title">Folgende Tage sind möglich:</h3>
              
              {commonAvailableDates.length > 0 ? (
                <>
                  {novemberDates.length > 0 && (
                    <div className="month-group">
                      <h4 className="month-header">November</h4>
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
                      <h4 className="month-header">Dezember</h4>
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
                  transition={{ delay: 0.9 }}
                >
                  Es gibt noch keine Tage, an denen alle Teilnehmer Zeit haben.
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Celebration;
