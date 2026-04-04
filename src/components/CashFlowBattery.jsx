import { useMemo } from 'react';
import './CashFlowBattery.css';
import { useApp } from '../context/AppContext';

export default function CashFlowBattery() {
  const { transactions: allTransactions } = useApp();
  
  const metrics = useMemo(() => {
    const curMonth = '2026-04';
    let incTotal = 0;
    let expTotal = 0;

    allTransactions.forEach(t => {
      if (t.date.startsWith(curMonth)) {
        if (t.amount > 0) incTotal += t.amount;
        else expTotal += Math.abs(t.amount);
      }
    });

    const net = incTotal - expTotal;
    const savePct = incTotal > 0 ? Math.round((net / incTotal) * 100) : 0;
    const expPct = incTotal > 0 ? Math.round((expTotal / incTotal) * 100) : 0;

    return { net, savePct, expPct, isPositive: net > 0 };
  }, [allTransactions]);

  return (
    <div className="ing-card ing-card--tall" aria-label="Cash Flow Battery">
      <div className="cf-battery">
        <div className="cf-battery__top">
          <div className="ing-ico-wrap ing-ico-wrap--blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
              <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
              <line x1="22" y1="11" x2="22" y2="13" />
            </svg>
          </div>
          <h3 className="cf-battery__title">Net Cash Flow</h3>
        </div>

        <div className="cf-battery__body">
          <div className="battery-shell">
            {/* Net Savings Fill (Bottom) */}
            <div className="battery-fill battery-fill--savings" style={{ height: `${metrics.savePct}%` }}></div>
            {/* Expense Fill (Middle) */}
            <div className="battery-fill battery-fill--expense" style={{ height: `${metrics.expPct}%` }}></div>
          </div>

          <div className="cf-battery__info">
            <span className="cf-battery__net">
              {metrics.isPositive ? '+' : '-'}${Math.abs(metrics.net).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="cf-battery__pct" style={{ color: metrics.isPositive ? '#16a34a' : '#ef4444', background: metrics.isPositive ? '#f0fdf4' : '#fef2f2' }}>
              {metrics.savePct}% Savings Charge
            </span>
          </div>

          <div className="cf-battery__legend">
            <div><span className="legend-dot" style={{ background: '#16a34a' }}></span><span className="legend-text">Savings</span></div>
            <div><span className="legend-dot" style={{ background: '#ef4444' }}></span><span className="legend-text">Drain</span></div>
          </div>
        </div>

        <p className="ing-card__desc">
          {metrics.isPositive 
            ? `Excellent pulse! You are saving ${metrics.savePct}% of your total income so far this month.`
            : `Warning! You are currently spending more than you earn. Draining reserves!`}
        </p>
      </div>
    </div>
  );
}
