import { motion } from 'framer-motion';
import './DayCell.css';

interface DayCellProps {
  date: Date;
  dateString: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  users: string[];
  currentUser: string;
  isUserAvailable: boolean;
  onToggle: (dateString: string) => void;
  getUserColor: (userName: string) => string;
}

const DayCell = ({
  date,
  dateString,
  isCurrentMonth,
  isToday,
  users,
  isUserAvailable,
  onToggle,
  getUserColor,
}: DayCellProps) => {
  const day = date.getDate();

  const handleClick = () => {
    if (isCurrentMonth) {
      onToggle(dateString);
    }
  };

  return (
    <motion.div
      className={`day-cell ${isCurrentMonth ? 'current-month' : 'other-month'} ${
        isToday ? 'today' : ''
      } ${isUserAvailable ? 'user-available' : ''}`}
      onClick={handleClick}
      whileHover={isCurrentMonth ? { scale: 1.05, y: -2 } : {}}
      whileTap={isCurrentMonth ? { scale: 0.95 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <div className="day-number">{day}</div>
      
      {isCurrentMonth && users.length > 0 && (
        <div className="user-badges">
          {users.map((userName, index) => (
            <motion.div
              key={userName}
              className="user-badge"
              style={{ backgroundColor: getUserColor(userName) }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 }}
              title={userName}
            />
          ))}
        </div>
      )}
      
      {isUserAvailable && (
        <motion.div
          className="user-indicator"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        />
      )}
    </motion.div>
  );
};

export default DayCell;
