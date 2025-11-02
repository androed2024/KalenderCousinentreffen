import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import './NameEntry.css';

interface NameEntryProps {
  onNameSubmit: (name: string) => void;
  showTitle?: boolean;
}

// Cousin names
const COUSIN_NAMES = [
  'Wolfi',
  'Peter',
  'Robert',
  'Tobias',
  'Andreas',
  'Special guest'
];

const NameEntry = ({ onNameSubmit, showTitle = true }: NameEntryProps) => {
  const [selectedName, setSelectedName] = useState<string>('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!selectedName) {
      setError('Bitte wähle deinen Namen aus');
      return;
    }
    
    onNameSubmit(selectedName);
  };

  return (
    <motion.div
      className="name-entry-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {showTitle && (
        <motion.h1
          className="title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Cousinentreffen
        </motion.h1>
      )}

      <motion.div
        className="name-form-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: showTitle ? 1.0 : 0.3, duration: 0.6 }}
      >
        <form onSubmit={handleSubmit} className="name-form">
          <label className="name-label">
            Wer bist du?
          </label>
          
          <div className="radio-buttons-container">
            {COUSIN_NAMES.map((name) => (
              <motion.label
                key={name}
                className={`radio-button-label ${selectedName === name ? 'selected' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <input
                  type="radio"
                  name="cousin-name"
                  value={name}
                  checked={selectedName === name}
                  onChange={(e) => {
                    setSelectedName(e.target.value);
                    setError('');
                  }}
                  className="radio-input"
                />
                <span className="radio-custom"></span>
                <span className="radio-text">{name}</span>
              </motion.label>
            ))}
          </div>
          
          {error && (
            <motion.p
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.p>
          )}
          
          <motion.button
            type="submit"
            className="submit-button"
            disabled={!selectedName}
            whileHover={selectedName ? { scale: 1.05 } : {}}
            whileTap={selectedName ? { scale: 0.95 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            Weiter zum Kalender
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default NameEntry;
