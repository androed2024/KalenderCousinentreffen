# Frontend - Cousinentreffen Doodle Clone

Modern React + TypeScript frontend for the Doodle Clone meeting planner, featuring a Matrix-style intro and beautiful calendar interface.

## 📋 Requirements

- Node.js v18 or higher
- npm

## 🚀 Installation

```bash
npm install
```

## 🏃 Running the App

### Development mode
```bash
npm run dev
```

The app will start on `http://localhost:5173`

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## 🎨 Features

### 🎬 Screen Flow

1. **Matrix Animation** (3.5 seconds)
   - Green falling characters animation
   - Matrix-style effect

2. **Title Screen** (2 seconds)
   - "Cousinentreffen" title with gradient
   - Smooth fade-in animation

3. **Name Entry**
   - User enters their name
   - Form validation (2-30 characters)
   - Smooth transitions

4. **Calendar View**
   - Monthly calendar grid
   - German locale (de-DE)
   - Berlin timezone (Europe/Berlin)
   - Interactive date selection
   - User availability badges
   - Month navigation

### 🗓️ Calendar Features

- **Current month view** with previous/next navigation
- **Week starts on Monday** (German standard)
- **German day names** (Mo, Di, Mi, Do, Fr, Sa, So)
- **Today indicator** with special styling
- **User availability markers**
  - Green indicator for current user's availability
  - Colored dots for all users on each date
- **Hover effects** on interactive elements
- **Responsive design** for mobile and desktop

### 🎨 Design System

- **Dark theme** with gradient accents
- **Color palette**:
  - Primary: `#00ff41` (Matrix green)
  - Accent: `#00d4aa` (Teal)
  - 10 distinct user colors for badges
- **Smooth animations** using Framer Motion
- **Custom scrollbars** matching the theme
- **Modern typography** with system fonts

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── MatrixAnimation.tsx    # Matrix intro animation
│   │   ├── MatrixAnimation.css
│   │   ├── NameEntry.tsx          # Name input screen
│   │   ├── NameEntry.css
│   │   ├── Calendar.tsx           # Main calendar component
│   │   ├── Calendar.css
│   │   ├── MonthNavigation.tsx    # Month nav controls
│   │   ├── MonthNavigation.css
│   │   ├── DayCell.tsx            # Individual day cell
│   │   └── DayCell.css
│   ├── api/
│   │   └── client.ts              # API client (axios)
│   ├── types/
│   │   └── index.ts               # TypeScript types
│   ├── styles/
│   │   └── global.css             # Global styles
│   ├── App.tsx                    # Main app component
│   ├── App.css
│   └── main.tsx                   # Entry point
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 🔧 Configuration

### API Endpoint

The API base URL is configured in `src/api/client.ts`:

```typescript
const API_BASE_URL = 'http://localhost:3000/api';
```

If your backend runs on a different port, update this value.

### Timezone

The app uses Berlin timezone by default, configured in `src/components/Calendar.tsx`:

```typescript
const TIMEZONE = 'Europe/Berlin';
```

### User Colors

User colors can be customized in `src/components/Calendar.tsx`:

```typescript
const USER_COLORS = [
  '#ff6b6b', // red
  '#4ecdc4', // teal
  // ... add more colors
];
```

### Matrix Animation Duration

Adjust the duration in `src/App.tsx`:

```typescript
<MatrixAnimation onComplete={handleMatrixComplete} duration={3500} />
```

## 🛠️ Technologies

### Core
- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server

### Libraries
- **framer-motion**: Smooth animations and transitions
- **date-fns**: Date manipulation and formatting
- **date-fns-tz**: Timezone support
- **axios**: HTTP client for API calls

### Development
- **@vitejs/plugin-react**: React support for Vite
- **TypeScript**: Type checking

## 🎯 Component Overview

### MatrixAnimation
Canvas-based Matrix rain effect with falling green characters. Auto-completes after specified duration.

### NameEntry
Form for entering user name with validation:
- Minimum 2 characters
- Maximum 30 characters
- Smooth transitions and animations

### Calendar
Main calendar component features:
- Month view with navigation
- German locale and Berlin timezone
- Availability tracking
- User legend with colors
- Auto-refresh every 10 seconds

### DayCell
Individual calendar day cell:
- Shows date number
- Displays user badges (colored dots)
- Indicates current user's availability
- Hover and click animations
- Today indicator

### MonthNavigation
Navigation controls:
- Previous/Next month buttons
- Current month/year display
- Animated transitions

## 🎨 Styling

The app uses CSS Modules and CSS Variables for theming:

### CSS Variables (defined in global.css)
```css
--color-bg: #0a0a0a
--color-primary: #00ff41
--color-accent: #00d4aa
--transition-normal: 0.3s ease
--border-radius: 8px
```

### Responsive Breakpoints
- Desktop: Default
- Tablet: `@media (max-width: 768px)`
- Mobile: `@media (max-width: 480px)`

## 🐛 Troubleshooting

### Port already in use
If port 5173 is in use, Vite will automatically try the next available port. Check the terminal output for the actual port.

### Backend connection errors
Make sure the backend is running on `http://localhost:3000`. Check the browser console for detailed error messages.

### TypeScript errors
Run type checking:
```bash
npx tsc --noEmit
```

### Date/timezone issues
The app uses `date-fns-tz` for timezone handling. Make sure dates are formatted correctly in ISO format (YYYY-MM-DD).

## 🚀 Performance

- **Lazy loading** for optimal bundle size
- **Optimistic updates** for instant UI feedback
- **Auto-refresh** every 10 seconds to sync with other users
- **Memoization** with useMemo for expensive calculations
- **Framer Motion** animations for smooth 60fps experience

## 📝 License

MIT

