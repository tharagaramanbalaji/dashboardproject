import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const AppContext = createContext();
const STORAGE_KEY = 'finance_transactions_v3';

export const INITIAL_TRANSACTIONS = [
  // --- April 2026 (Rich Activity) ---
  { id: 31, name: 'Starbucks Coffee',      category: 'Food & Health', date: '2026-04-12', amount: -6.50,   method: 'Apple Pay',    status: 'Success' },
  { id: 32, name: 'Uber to Office',        category: 'Utilities',     date: '2026-04-12', amount: -18.40,  method: 'Debit card',   status: 'Success' },
  { id: 33, name: 'Sweetgreen Salad',      category: 'Food & Health', date: '2026-04-13', amount: -14.90,  method: 'Credit card',  status: 'Success' },
  { id: 34, name: 'Steam Sale - Games',    category: 'Entertainment', date: '2026-04-14', amount: -54.99,  method: 'PayPal',       status: 'Success' },
  { id: 35, name: 'Dividend Payout',       category: 'Income',        date: '2026-04-14', amount: 42.50,   method: 'Wire transfer', status: 'Success' },
  { id: 1,  name: 'Netflix Subscription',  category: 'Platform',      date: '2026-04-01', amount: -15.99,  method: 'Debit card',   status: 'Success' },
  { id: 2,  name: 'Salary Deposit',        category: 'Income',        date: '2026-04-01', amount: 8120.50, method: 'Wire transfer', status: 'Success' },
  { id: 36, name: 'Morning Joe Coffee',    category: 'Food & Health', date: '2026-04-02', amount: -4.50,   method: 'Debit card',   status: 'Success' },
  { id: 3,  name: 'Whole Foods Market',    category: 'Food & Health', date: '2026-04-02', amount: -134.20, method: 'Credit card',  status: 'Success' },
  { id: 4,  name: 'AWS Hosting',           category: 'Platform',      date: '2026-04-03', amount: -52.00,  method: 'Debit card',   status: 'Pending' },
  { id: 37, name: 'Hulu Premium',          category: 'Platform',      date: '2026-04-03', amount: -10.99,  method: 'Credit card',  status: 'Success' },
  { id: 5,  name: 'Nike Store',            category: 'Shopping',      date: '2026-04-04', amount: -189.00, method: 'Credit card',  status: 'Success' },
  { id: 38, name: 'Gas Station Fuel',      category: 'Utilities',     date: '2026-04-04', amount: -45.00,  method: 'Debit card',   status: 'Success' },
  { id: 6,  name: 'Freelance Payment',     category: 'Income',        date: '2026-04-05', amount: 1200.00, method: 'Wire transfer', status: 'Success' },
  { id: 39, name: 'Trader Joes',           category: 'Food & Health', date: '2026-04-06', amount: -76.80,  method: 'Debit card',   status: 'Success' },
  { id: 7,  name: 'Electricity Bill',      category: 'Utilities',     date: '2026-04-06', amount: -98.40,  method: 'Debit card',   status: 'Success' },
  { id: 8,  name: 'Spotify Premium',       category: 'Platform',      date: '2026-04-07', amount: -9.99,   method: 'Debit card',   status: 'Success' },
  { id: 40, name: 'Side Gig - Design',     category: 'Income',        date: '2026-04-07', amount: 350.00,  method: 'PayPal',       status: 'Success' },
  { id: 9,  name: 'Gym Membership',        category: 'Food & Health', date: '2026-04-08', amount: -45.00,  method: 'Debit card',   status: 'Success' },
  { id: 10, name: 'Cinema Tickets',        category: 'Entertainment', date: '2026-04-09', amount: -32.00,  method: 'Credit card',  status: 'Success' },
  { id: 11, name: 'Amazon Purchase',       category: 'Shopping',      date: '2026-04-10', amount: -249.00, method: 'Credit card',  status: 'Success' },
  { id: 12, name: 'Uber Ride',             category: 'Utilities',     date: '2026-04-11', amount: -22.50,  method: 'Debit card',   status: 'Success' },
  { id: 41, name: 'Dinner at Nobu',        category: 'Food & Health', date: '2026-04-11', amount: -245.00, method: 'Credit card',  status: 'Success' },
  // --- March 2026 ---
  { id: 13, name: 'Salary Deposit',        category: 'Income',        date: '2026-03-01', amount: 8120.50, method: 'Wire transfer', status: 'Success' },
  { id: 14, name: 'Rent Payment',          category: 'Utilities',     date: '2026-03-02', amount: -1500.00, method: 'Wire transfer', status: 'Success' },
  { id: 15, name: 'Grocery Store',         category: 'Food & Health', date: '2026-03-05', amount: -210.30, method: 'Debit card',   status: 'Success' },
  { id: 16, name: 'Zara Shopping',         category: 'Shopping',      date: '2026-03-10', amount: -211.50, method: 'Credit card',  status: 'Failed' },
  { id: 17, name: 'Freelance Payment',     category: 'Income',        date: '2026-03-15', amount: 950.00,  method: 'Wire transfer', status: 'Success' },
  { id: 18, name: 'Electric Bill',         category: 'Utilities',     date: '2026-03-20', amount: -88.00,  method: 'Debit card',   status: 'Success' },
  // --- Old Data ---
  { id: 19, name: 'Salary Deposit',        category: 'Income',        date: '2026-02-01', amount: 8120.50, method: 'Wire transfer', status: 'Success' },
  { id: 20, name: 'Valentine Dinner',      category: 'Food & Health', date: '2026-02-14', amount: -185.00, method: 'Credit card',  status: 'Success' },
  { id: 21, name: 'Book Purchase',         category: 'Shopping',      date: '2026-02-18', amount: -34.99,  method: 'Debit card',   status: 'Success' },
  { id: 23, name: 'Salary Deposit',        category: 'Income',        date: '2026-01-01', amount: 8120.50, method: 'Wire transfer', status: 'Success' },
];

export function AppProvider({ children }) {
  // --- User / Auth State ---
  const [role, setRole] = useState('admin');

  // --- Theme State ---
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('app_theme');
    if (saved) return saved;
    // Auto-detect system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Sync theme to root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
  }, [theme]);


  // --- Transactions State ---
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_TRANSACTIONS;
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  // Actions
  const addTransaction = (txn) => {
    const newTxn = { ...txn, id: Date.now() };
    setTransactions(prev => [newTxn, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const saveTransactions = (newTxns) => {
    setTransactions(newTxns);
  };

  // --- Derived State (Performance focus) ---
  const metrics = useMemo(() => {
    const curMonth = '2026-04';
    const prevMonth = '2026-03';
    
    let curExp = 0, curInc = 0;
    let preExp = 0, preInc = 0;
    let totalBal = 0;

    transactions.forEach(t => {
      totalBal += t.amount;
      const m = t.date.substring(0, 7);
      if (m === curMonth) {
        if (t.amount < 0) curExp += Math.abs(t.amount);
        else curInc += t.amount;
      } else if (m === prevMonth) {
        if (t.amount < 0) preExp += Math.abs(t.amount);
        else preInc += t.amount;
      }
    });

    const expChange = preExp ? Math.round(((curExp - preExp) / preExp) * 100) : 0;
    const incChange = preInc ? Math.round(((curInc - preInc) / preInc) * 100) : 0;

    return { totalBal, curExp, curInc, expChange, incChange };
  }, [transactions]);

  const value = {
    role,
    setRole,
    transactions,
    metrics,
    addTransaction,
    deleteTransaction,
    saveTransactions,
    theme,
    toggleTheme
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
