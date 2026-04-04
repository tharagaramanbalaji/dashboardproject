import { useState } from 'react';
import './Dashboard.css';
import SpendingChart from './SpendingChart';
import CategoryChart from './CategoryChart';
import Transactions from './Transactions';
import PortfolioWave from './PortfolioWave';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

/* ── Icons ── */
function SavingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  );
}

function ExpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function CopyIconSm() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      style={{ width: 13, height: 13 }}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

/* ── Balance card (left) ── */
function MyBalanceCard({ role, balance, index }) {
  const isViewer = role === 'viewer';
  const [copied, setCopied] = useState(false);
  const rawAccountNum = '6549  7329  9821  2472';
  const displayAccountNum = isViewer ? '****  ****  ****  2472' : rawAccountNum;

  const handleCopy = () => {
    navigator.clipboard.writeText(rawAccountNum.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.div 
      className="balance-card" 
      id="balance-card-balance"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, boxShadow: '0 12px 24px rgba(0,0,0,0.06)' }}
      custom={index}
    >
      <span className="card__label">My Balance</span>

      <div className="card__amount-row">
        <span className="card__amount">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        <span className="card__change change--up">+5.7% compare to last month</span>
      </div>

      <div className="card__account-row">
        <span className="card__account-num">{displayAccountNum}</span>
        {!isViewer && (
          <button
            className={`card__copy-btn${copied ? ' card__copy-btn--done' : ''}`}
            onClick={handleCopy}
            title={copied ? 'Copied!' : 'Copy'}
            aria-label="Copy account number"
          >
            {copied
              ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                style={{ width: 13, height: 13 }}><polyline points="20 6 9 17 4 12" /></svg>
              : <CopyIconSm />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>

      <div className="card__actions">
        <button className="btn btn--primary" id="btn-send-money" disabled={isViewer} style={isViewer ? { opacity: 0.5, cursor: 'not-allowed' } : {}} title={isViewer ? "Disabled for viewers" : ""}>Send money</button>
        <button className="btn btn--outline" id="btn-request-money" disabled={isViewer} style={isViewer ? { opacity: 0.5, cursor: 'not-allowed' } : {}} title={isViewer ? "Disabled for viewers" : ""}>Request money</button>
      </div>
    </motion.div>
  );
}

/* ── Stat card (savings / expenditure) ── */
function StatCard({ id, label, amount, change, icon, iconClass, index }) {
  return (
    <motion.div 
      className="balance-card" 
      id={`balance-card-${id}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, boxShadow: '0 12px 24px rgba(0,0,0,0.06)' }}
      custom={index}
    >
      <span className={`card__icon-bubble ${iconClass}`} aria-hidden="true">
        {icon}
      </span>

      <span className="card__label card__label--stat">{label}</span>

      <span className="card__amount card__amount--stat">${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>

      <span className={`card__change-stat ${change.up ? 'change--up' : 'change--down'}`}>
        {change.up ? '+' : ''}{change.pct}%&nbsp;
        <span className="change__sub">compared to last month</span>
      </span>
    </motion.div>
  );
}

/* ── Root ── */
export default function Dashboard({ onNavigate }) {
  const { role, metrics } = useApp();

  return (
    <section className="dashboard" aria-label="Dashboard overview">
      <motion.h1 
        className="dashboard__greeting"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        Hello! Tharagaraman
      </motion.h1>

      <div className="dashboard__cards">
        <MyBalanceCard role={role} balance={metrics.totalBal} index={1} />
        <StatCard
          id="savings"
          label="Monthly Income"
          amount={metrics.curInc}
          change={{ pct: metrics.incChange, up: metrics.incChange >= 0 }}
          icon={<SavingsIcon />}
          iconClass="icon--savings"
          index={2}
        />
        <StatCard
          id="expenditure"
          label="Monthly Expenditure"
          amount={metrics.curExp}
          change={{ pct: metrics.expChange, up: metrics.expChange >= 0 }}
          icon={<ExpIcon />}
          iconClass="icon--exp"
          index={3}
        />
        <motion.div 
           style={{ flex: 1.5, display: 'flex' }} 
           variants={cardVariants} 
           initial="hidden" 
           animate="visible" 
           custom={4}
        >
           <PortfolioWave />
        </motion.div>
      </div>

      <motion.div 
        className="dashboard__chart-row"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="dashboard__chart-main">
          <SpendingChart />
        </div>
        <div className="dashboard__chart-side">
          <CategoryChart onNavigate={onNavigate} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Transactions />
      </motion.div>
    </section>
  );
}
