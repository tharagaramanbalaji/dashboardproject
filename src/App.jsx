import { useState } from 'react';
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

function App() {
  const [page, setPage] = useState('overview');

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
    </>
  );
}

export default App;
