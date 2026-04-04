import { useState } from 'react';
import { useApp } from './context/AppContext';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import TransactionsPage from './components/TransactionsPage';
import InsightsPage from './components/InsightsPage';
import HelpPage from './components/HelpPage';
import SettingsPage from './components/SettingsPage';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';

const pageVariants = {
  initial: { opacity: 0, scale: 0.99, translateY: 5 },
  animate: { opacity: 1, scale: 1, translateY: 0 },
  exit: { opacity: 0, scale: 0.99, translateY: -5 }
};

const pageTransition = {
  type: 'spring',
  stiffness: 400,
  damping: 30
};

function Toast({ message, type }) {
  if (!message) return null;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      className={`toast-notification toast--${type}`}
    >
      <div className="toast-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <span className="toast-msg">{message}</span>
    </motion.div>
  );
}

function App() {
  const [page, setPage] = useState('overview');
  const { toast } = useApp();

  return (
    <>
      <Header />
      <Navbar activePage={page} onNavigate={setPage} />
      <main style={{ display: 'block', width: '100%', boxSizing: 'border-box' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            {page === 'overview' && <Dashboard onNavigate={setPage} />}
            {page === 'transactions' && <TransactionsPage />}
            {page === 'insights' && <InsightsPage />}
            {page === 'help' && <HelpPage />}
            {page === 'settings' && <SettingsPage />}
          </motion.div>
        </AnimatePresence>
      </main>
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>
    </>
  );
}

export default App;
