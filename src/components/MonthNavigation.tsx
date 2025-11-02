import { motion } from 'framer-motion';
import './MonthNavigation.css';

interface MonthNavigationProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const MonthNavigation = ({
  currentMonth,
  onPrevMonth,
  onNextMonth,
}: MonthNavigationProps) => {
  const monthName = currentMonth.toLocaleDateString('de-DE', { 
    month: 'long', 
    year: 'numeric' 
  });

  const displayName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  return (
    <div className="month-navigation">
      <motion.button
        className="nav-button"
        onClick={onPrevMonth}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        ←
      </motion.button>

      <motion.h2
        className="month-title"
        key={displayName}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {displayName}
      </motion.h2>

      <motion.button
        className="nav-button"
        onClick={onNextMonth}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        →
      </motion.button>
    </div>
  );
};

export default MonthNavigation;
