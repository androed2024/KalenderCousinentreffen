import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MatrixAnimation from './components/MatrixAnimation';
import NameEntry from './components/NameEntry';
import Calendar from './components/Calendar';
import Celebration from './components/Celebration';
import Summary from './components/Summary';
import { availabilityApi } from './api/client';
import type { AppScreen, Availability } from './types';
import './App.css';

function App() {
  const [screen, setScreen] = useState<AppScreen>('matrix');
  const [userName, setUserName] = useState<string>('');
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Log to confirm new version is loaded
  useEffect(() => {
    console.log('🎬 Matrix Animation App v2.0 - Starting with matrix screen, current screen:', screen);
    // Force screen to matrix on mount
    setScreen('matrix');
  }, []);

  // Fetch availabilities from backend
  const fetchAvailabilities = useCallback(async () => {
    try {
      setLoading(true);
      const data = await availabilityApi.getAll();
      setAvailabilities(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching availabilities:', err);
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        setError('Backend-Verbindung fehlgeschlagen. Stelle sicher, dass der Backend-Server auf http://localhost:3000 läuft.');
      } else {
        setError(`Fehler beim Laden der Verfügbarkeiten: ${err.message || 'Unbekannter Fehler'}`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load of availabilities when entering calendar
  useEffect(() => {
    if (screen === 'calendar') {
      fetchAvailabilities();
      
      // Refresh every 10 seconds to show updates from other users
      const interval = setInterval(fetchAvailabilities, 10000);
      return () => clearInterval(interval);
    }
  }, [screen, fetchAvailabilities]);

  // Matrix animation complete
  const handleMatrixComplete = () => {
    console.log('🎬 Matrix animation complete, transitioning to title');
    setScreen('title');
    setTimeout(() => {
      console.log('🎬 Title complete, transitioning to name entry');
      setScreen('nameEntry');
    }, 2000);
  };

  // Name submitted
  const handleNameSubmit = (name: string) => {
    setUserName(name);
    setScreen('calendar');
  };

  // Toggle availability
  const handleToggleAvailability = async (date: string) => {
    if (!userName) return;

    try {
      // Optimistic update
      const existingIndex = availabilities.findIndex(
        a => a.user_name === userName && a.date === date
      );

      let newAvailabilities: Availability[];
      if (existingIndex !== -1) {
        // Remove availability
        newAvailabilities = availabilities.filter((_, i) => i !== existingIndex);
      } else {
        // Add availability
        const newAvailability: Availability = {
          id: Date.now(), // temporary ID
          user_name: userName,
          date,
          available: true,
          created_at: new Date().toISOString(),
        };
        newAvailabilities = [...availabilities, newAvailability];
      }

      setAvailabilities(newAvailabilities);

      // Send to backend
      await availabilityApi.toggle({ userName, date, available: true });

      // Refresh to get accurate data
      await fetchAvailabilities();
    } catch (err) {
      console.error('Error toggling availability:', err);
      setError('Fehler beim Speichern der Verfügbarkeit');
      // Revert on error
      await fetchAvailabilities();
    }
  };

  // Handle save button
  const handleSave = async () => {
    // Refresh availabilities before showing celebration to ensure we have latest data
    await fetchAvailabilities();
    setScreen('celebration');
  };

  // Handle celebration complete
  const handleCelebrationComplete = () => {
    setScreen('summary');
  };

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {screen === 'matrix' && (
          <motion.div
            key="matrix"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000 }}
          >
            <MatrixAnimation onComplete={handleMatrixComplete} />
          </motion.div>
        )}

        {screen === 'title' && (
          <motion.div
            key="title"
            className="title-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="main-title">Cousinentreffen</h1>
          </motion.div>
        )}

        {screen === 'nameEntry' && (
          <motion.div
            key="nameEntry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <NameEntry onNameSubmit={handleNameSubmit} showTitle={false} />
          </motion.div>
        )}

        {screen === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Calendar
              userName={userName}
              availabilities={availabilities}
              onToggleAvailability={handleToggleAvailability}
              onSave={handleSave}
            />
          </motion.div>
        )}

        {screen === 'celebration' && (
          <motion.div
            key="celebration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Celebration 
              userName={userName} 
              availabilities={availabilities} 
            />
          </motion.div>
        )}

        {screen === 'summary' && (
          <motion.div
            key="summary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Summary userName={userName} availabilities={availabilities} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error notification */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="error-notification"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <p>{error}</p>
            <button onClick={() => setError(null)}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading indicator */}
      {loading && screen === 'calendar' && (
        <div className="loading-indicator">
          <div className="spinner" />
        </div>
      )}
    </div>
  );
}

export default App;
