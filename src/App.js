import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, differenceInWeeks, differenceInDays, addYears, isValid } from 'date-fns';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaSun, FaMoon, FaLock, FaUnlock, FaRedo } from 'react-icons/fa';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Date-fns setup
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': require('date-fns/locale/en-US') },
});

// Styled Components
const AppContainer = styled(motion.div)`
  padding: 20px;
  background: ${props => props.dark
    ? 'linear-gradient(to bottom, #151d25, #34495e)'
    : 'linear-gradient(to bottom, #ecf0f1, #b5b5b5)'};
  color: ${props => (props.dark ? '#ecf0f1' : '#2c3e50')};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled(motion.header)`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: bold;
  width: 100%;
  max-width: 1200px;
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
  width: 100%;
  max-width: 600px;
  display: flex;
  align-items: center;
`;

const Input = styled(motion.input)`
  flex: 1;
  padding: 10px 40px 10px 10px;
  border: 1px solid ${props => (props.dark ? '#95a5a6' : '#bdc3c7')};
  border-radius: 5px;
  background: ${props => props.dark
    ? 'linear-gradient(to bottom, #34495e, #304254)'
    : '#fff'};
  color: ${props => (props.dark ? '#ecf0f1' : '#2c3e50')};
`;

const MainContent = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  gap: 20px;
`;

const NotesSection = styled.div`
  width: 300px;
  padding: 20px;
  background: ${props => props.dark
    ? 'linear-gradient(to bottom, #34495e, #385269)'
    : 'linear-gradient(to bottom, #fff, #f9f9f9)'};
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const CalendarWrapper = styled(motion.div)`
  flex: 1;
  padding: 20px;
  background: ${props => props.dark
    ? 'linear-gradient(to bottom, #34495e, #385269)'
    : 'linear-gradient(to bottom, #fff, #f9f9f9)'};
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const RightSection = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const LifeWeeksContainer = styled.div`
  padding: 20px;
  background: ${props => props.dark
    ? 'linear-gradient(to bottom, #34495e, #385269)'
    : 'linear-gradient(to bottom, #fff, #f9f9f9)'};
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ChatBox = styled.div`
  padding: 20px;
  background: ${props => props.dark
    ? 'linear-gradient(to bottom, #34495e, #385269)'
    : 'linear-gradient(to bottom, #fff, #f9f9f9)'};
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const IconButton = styled(motion.button)`
  background: none;
  border: none;
  color: ${props => (props.dark ? '#ecf0f1' : '#2c3e50')};
  cursor: pointer;
  font-size: 1.2rem;
  margin-left: 10px;
`;

const TextButton = styled(motion.button)`
  background: ${props => (props.active ? (props.dark ? '#95a5a6' : '#bdc3c7') : 'none')};
  border: 1px solid ${props => (props.dark ? '#95a5a6' : '#bdc3c7')};
  border-radius: 5px;
  padding: 5px 10px;
  margin: 5px;
  color: ${props => (props.dark ? '#ecf0f1' : '#2c3e50')};
  cursor: pointer;
`;

const LandingContainer = styled(motion.div)`
  text-align: center;
  margin-top: 20%;
`;

// Components
const Clock = ({ dark, birthday, lifespanOption }) => {
  const [timePassedDisplay, setTimePassedDisplay] = useState('');

  useEffect(() => {
    if (!birthday || !lifespanOption) {
      setTimePassedDisplay('Enter birthday and lifespan');
      return;
    }

    const timer = setInterval(() => {
      const birthdayDate = new Date(birthday);
      const now = new Date();
      const lifespanYearsOptions = { unhealthy: 65, healthy: 80, bryan: 130 };
      const expectedLifespanYears = lifespanYearsOptions[lifespanOption];

      if (!isValid(birthdayDate) || birthdayDate >= now || !expectedLifespanYears) {
        setTimePassedDisplay('Invalid date or option');
        return;
      }

      const expectedDeath = addYears(birthdayDate, expectedLifespanYears);

      if (now > expectedDeath) {
        setTimePassedDisplay('Lifespan exceeded');
        clearInterval(timer);
        return;
      }

      const yearsPassed = differenceInWeeks(now, birthdayDate) / 52;
      const expectedYears = expectedLifespanYears;

      setTimePassedDisplay(`Years Passed: ${yearsPassed.toFixed(2)} / Expected: ${expectedYears}`);

    }, 1000);

    return () => clearInterval(timer);
  }, [birthday, lifespanOption]);

  return (
    <div style={{ textAlign: 'center', fontSize: '1.2rem', color: dark ? '#ecf0f1' : '#2c3e50' }}>
      Lifespan Clock: {timePassedDisplay}
    </div>
  );
};

const LifeWeeksDisplay = ({ dark }) => {
  const [birthday, setBirthday] = useState('');
  const [lifespanOption, setLifespanOption] = useState(null);
  const [unit, setUnit] = useState('weeks');

  const lifespanYears = { unhealthy: 65, healthy: 80, bryan: 130 };
  const birthdayDate = new Date(birthday);
  const now = new Date();
  const isValidDate = isValid(birthdayDate) && birthdayDate < now;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Text copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  let content;
  if (!birthday || !lifespanOption || !isValidDate) {
    content = <p>Please enter a valid birthday and select a lifespan option.</p>;
  } else {
    const expectedDeath = addYears(birthdayDate, lifespanYears[lifespanOption]);
    const [totalUnits, passedUnits] = unit === 'weeks'
      ? [differenceInWeeks(expectedDeath, birthdayDate), differenceInWeeks(now, birthdayDate)]
      : [differenceInDays(expectedDeath, birthdayDate), differenceInDays(now, birthdayDate)];
    const [rows, cols] = unit === 'weeks' ? [lifespanYears[lifespanOption], 52] : [Math.ceil(totalUnits / 7), 7];
    const dots = Array.from({ length: totalUnits }, (_, i) => (
      <circle
        key={i}
        cx={(i % cols) * 10 + 5}
        cy={Math.floor(i / cols) * 10 + 5}
        r={3}
        fill={i < passedUnits ? (dark ? '#333' : '#ccc') : (dark ? '#aaa' : '#222')}
      />
    ));
    content = <svg width={cols * 10} height={rows * 10}>{dots}</svg>;
  }

  return (
    <LifeWeeksContainer dark={dark}>
      <h2>Life Weeks</h2>
      <input
        type="date"
        value={birthday}
        onChange={e => setBirthday(e.target.value)}
        style={{ padding: '8px', margin: '10px 0', border: '1px solid #bdc3c7', borderRadius: '5px', background: dark ? '#2c3e50' : '#fff', color: dark ? '#ecf0f1' : '#2c3e50' }}
      />
      <div>
        {['unhealthy', 'healthy', 'bryan'].map(opt => (
          <TextButton
            key={opt}
            dark={dark}
            onClick={() => {
              setLifespanOption(opt);
              if (opt === 'bryan') {
                copyToClipboard(`Wake Up; 5:00 AM-5:15 AM: Daily
                Morning Supplements; 5:15 AM-5:30 AM: Daily
                Exercise (Strength, Cardio, Flexibility); 6:00 AM-7:00 AM: Daily
                Breakfast (Vegan, Nutrient-Dense); 7:30 AM-8:00 AM: Daily
                Lunch (Vegan, Light); 10:30 AM-11:00 AM: Daily
                Evening Wind-Down; 7:30 PM-8:30 PM: Daily
                Sleep; 8:30 PM-5:00 AM: Daily`);
              }
            }}
            active={lifespanOption === opt}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {opt === 'bryan' ? 'Bryan Johnson (130 years)' : `${opt.charAt(0).toUpperCase() + opt.slice(1)} (${lifespanYears[opt]} years)`}
          </TextButton>
        ))}
      </div>
      <div>
        {['weeks', 'days'].map(u => (
          <TextButton
            key={u}
            dark={dark}
            onClick={() => setUnit(u)}
            active={unit === u}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {u.charAt(0).toUpperCase() + u.slice(1)}
          </TextButton>
        ))}
      </div>
      <div>{content}</div>
    </LifeWeeksContainer>
  );
};

// Landing Page Component
const LandingPage = () => (
  <LandingContainer
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <h1>DON'T DIE</h1>
    <Link to="/main?mode=ai">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          padding: '10px 20px',
          fontSize: '1.2rem',
          borderRadius: '5px',
          border: 'none',
          background: '#3498db',
          color: '#fff',
          cursor: 'pointer',
          margin: '10px',
        }}
      >
        Start Fresh (AI)
      </motion.button>
    </Link>
    <Link to="/import">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          padding: '10px 20px',
          fontSize: '1.2rem',
          borderRadius: '5px',
          border: 'none',
          background: '#2ecc71',
          color: '#fff',
          cursor: 'pointer',
          margin: '10px',
        }}
      >
        Import (API)
      </motion.button>
    </Link>
  </LandingContainer>
);

// Import Page Component
const ImportPage = () => (
  <LandingContainer>
    <h1>Import from Calendar</h1>
    <p>Select a calendar service to import from:</p>
    <motion.button
      onClick={() => window.location.href = '/auth/google'}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        padding: '10px 20px',
        fontSize: '1.2rem',
        borderRadius: '5px',
        border: 'none',
        background: '#e74c3c',
        color: '#fff',
        cursor: 'pointer',
        margin: '10px',
      }}
    >
      Google Calendar
    </motion.button>
    <motion.button
      onClick={() => window.location.href = '/auth/apple'}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        padding: '10px 20px',
        fontSize: '1.2rem',
        borderRadius: '5px',
        border: 'none',
        background: '#95a5a6',
        color: '#fff',
        cursor: 'pointer',
        margin: '10px',
      }}
    >
      Apple Calendar
    </motion.button>
    <motion.button
      onClick={() => window.location.href = '/auth/other'}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        padding: '10px 20px',
        fontSize: '1.2rem',
        borderRadius: '5px',
        border: 'none',
        background: '#f1c40f',
        color: '#fff',
        cursor: 'pointer',
        margin: '10px',
      }}
    >
      Other Calendar
    </motion.button>
  </LandingContainer>
);

// Main App Component
const MainApp = () => {
  const [calendarView, setCalendarView] = useState('day');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [lockedIn, setLockedIn] = useState(false);
  const [parseErrors, setParseErrors] = useState([]);
  const [lastInput, setLastInput] = useState('');
  const calendarWrapperRef = useRef(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get('mode');
  const isAIMode = mode === 'ai';

  const parseEvents = (input, referenceDate) => {
    if (!input.trim()) return;
    const eventStrings = input.split(';').map(str => str.trim());
    const newEvents = [];
    const errors = [];
    eventStrings.forEach(str => {
      const match = str.match(/^\[?(.*?)\]?\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})\s*(am|pm)$/i);
      if (match) {
        const [, title, startTime, endTime, period] = match;
        const start = parse(`${startTime} ${period}`, 'h:mm a', referenceDate);
        const end = parse(`${endTime} ${period}`, 'h:mm a', referenceDate);
        if (end < start) end.setDate(end.getDate() + 1);
        newEvents.push({ title: title.trim(), start, end });
      } else {
        errors.push(`Invalid event: ${str}`);
      }
    });
    setEvents(prev => [...prev, ...newEvents]);
    setParseErrors(errors);
  };

  const repeatEvents = () => {
    if (lastInput) {
      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 1);
      parseEvents(lastInput, nextDay);
    }
  };

  useEffect(() => {
    if (lockedIn && calendarWrapperRef.current) {
      const scrollContainer = calendarWrapperRef.current.querySelector('.rbc-time-content');
      if (scrollContainer) {
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const fraction = (now - startOfDay) / (24 * 60 * 60 * 1000);
        const scrollPosition = fraction * 800 - scrollContainer.clientHeight / 2;
        scrollContainer.scrollTop = scrollPosition;
      }
    }
  }, [lockedIn]);

  return (
    <AppContainer dark={darkMode}>
      <Header dark={darkMode} initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
        <FaCalendarAlt /> Fast Calendar
        <IconButton dark={darkMode} onClick={() => setDarkMode(!darkMode)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </IconButton>
        <IconButton dark={darkMode} onClick={() => setLockedIn(!lockedIn)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          {lockedIn ? <FaUnlock /> : <FaLock />}
        </IconButton>
      </Header>
      <InputWrapper>
        <Input
          dark={darkMode}
          placeholder="e.g., Meeting 9:00-10:00 am; Lunch 12:00-1:00 pm"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              const inputValue = e.target.value;
              parseEvents(inputValue, new Date());
              setLastInput(inputValue);
              e.target.value = '';
            }
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        />
        <IconButton dark={darkMode} onClick={repeatEvents} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <FaRedo />
        </IconButton>
        {parseErrors.length > 0 && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            {parseErrors.map((err, i) => <p key={i}>{err}</p>)}
          </div>
        )}
      </InputWrapper>
      <MainContent>
        <NotesSection dark={darkMode}>
          <h2>Notes</h2>
          <textarea
            style={{
              width: '100%',
              height: '200px',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #bdc3c7',
              background: darkMode ? '#2c3e50' : '#fff',
              color: darkMode ? '#ecf0f1' : '#2c3e50',
            }}
          />
        </NotesSection>
        <CalendarWrapper ref={calendarWrapperRef} dark={darkMode} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <Calendar
            localizer={localizer}
            events={events}
            view={calendarView}
            onView={(newView) => setCalendarView(newView)}
            date={calendarDate}
            onNavigate={(newDate) => setCalendarDate(newDate)}
            step={5}
            timeslots={12}
            views={['day', 'week', 'month']}
            style={{ height: '800px' }}
          />
        </CalendarWrapper>
        <RightSection>
          <Clock dark={darkMode} />
          <LifeWeeksDisplay dark={darkMode} />
          {isAIMode && (
            <ChatBox dark={darkMode}>
              <h2>AI Chat</h2>
              <p>AI chat box placeholder - connect to AI agent here</p>
            </ChatBox>
          )}
        </RightSection>
      </MainContent>
    </AppContainer>
  );
};

// App Component with Routing
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/main" element={<MainApp />} />
        <Route path="/import" element={<ImportPage />} />
      </Routes>
    </Router>
  );
};

export default App;