import { useMemo } from 'react';
import './InsightsPage.css';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import SubscriptionBurn from './SubscriptionBurn';
import CashFlowBattery from './CashFlowBattery';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export default function InsightsPage() {
  const { transactions: allTransactions, theme } = useApp();
  const isDark = theme === 'dark';
  
  const tickColor = isDark ? '#94a3b8' : '#64748b';
  const barInactive = isDark ? '#334155' : '#cbd5e1';
  const cursorFill = isDark ? 'rgba(255, 255, 255, 0.05)' : '#f8fafc';

  // Baseline to simulate "now" based on template data
  const currentMonthFilter = '2026-04';

  const stats = useMemo(() => {
    const monthExpenses = {};
    const currCategories = {};
    let currExpenses = 0;
    let currIncome = 0;

    allTransactions.forEach(t => {
      const monthPrefix = t.date.substring(0, 7);
      if (t.amount < 0) {
        monthExpenses[monthPrefix] = (monthExpenses[monthPrefix] || 0) + Math.abs(t.amount);
      }
      if (monthPrefix === currentMonthFilter) {
        if (t.amount < 0) {
          currExpenses += Math.abs(t.amount);
          currCategories[t.category] = (currCategories[t.category] || 0) + Math.abs(t.amount);
        } else {
          currIncome += t.amount;
        }
      }
    });

    const sortedMonths = Object.keys(monthExpenses).sort().slice(-6);
    const chartData = sortedMonths.map(m => {
      const dateObj = new Date(m + '-01T00:00:00');
      return {
        name: dateObj.toLocaleDateString('en-US', { month: 'short' }),
        fullMonth: m,
        amount: monthExpenses[m]
      };
    });

    const sortedCats = Object.entries(currCategories)
      .sort((a, b) => b[1] - a[1])
      .map(([name, amount]) => ({
        name,
        amount,
        pct: currExpenses > 0 ? Math.round((amount / currExpenses) * 100) : 0
      }));

    const top1 = sortedCats[0] || { name: 'N/A', amount: 0, pct: 0 };
    const top2 = sortedCats[1] || null;

    let obs1 = "You have an excellent balance of spending across all categories right now. Keep it up!";
    if (top1.amount > 0 && currExpenses > 0) {
      if (top1.pct > 35) {
        obs1 = `${top1.name} accounts for ${top1.pct}% of total budget. Review these recent payments to find trimming opportunities.`;
      } else {
        obs1 = `Budgeting for ${top1.name} is well-controlled. Your diversification prevents over-reliance on a single category.`;
      }
    }

    const surplus = currIncome - currExpenses;
    const saveRate = currIncome > 0 ? Math.round((surplus / currIncome) * 100) : 0;
    let obs2 = "Maintain a steady 20% savings rate for long-term financial freedom.";
    if (saveRate > 40) {
      obs2 = `Exceptional savings rate of ${saveRate}%! You're in a great position to accelerate your retirement goals.`;
    } else if (saveRate > 15) {
      obs2 = `Solid ${saveRate}% savings rate. You are effectively capturing surplus capital for future growth.`;
    } else if (saveRate < 0) {
       obs2 = `Spending currently exceeds income. Focus on eliminating non-essential outflows this week.`;
    }

    let investmentPlans = [];
    if (surplus > 1000) {
      investmentPlans = [
        { id: 1, title: 'S&P 500 Index ETF', percent: 60, desc: 'High emphasis on long-term wealth compounding due to your healthy cash surplus.', color: '#16a34a' },
        { id: 2, title: 'Emergency Savings (HYSA)', percent: 25, desc: 'Bolster liquid cash reserves in a High-Yield Savings Account.', color: '#0891b2' },
        { id: 3, title: 'Speculative / Crypto', percent: 15, desc: 'A smaller riskier allocation given your comfortable margins.', color: '#ea580c' },
      ];
    } else if (surplus > 0) {
      investmentPlans = [
        { id: 1, title: 'Emergency Savings', percent: 70, desc: 'Build your cash buffer immediately as your surplus is moderate.', color: '#16a34a' },
        { id: 2, title: 'Bonds / Fixed Income', percent: 30, desc: 'Low volatility assets to slowly grow your excess funds securely.', color: '#0891b2' },
      ];
    } else {
      investmentPlans = [
        { id: 1, title: 'Debt Reduction', percent: 80, desc: 'Focus heavily on paying down high-interest liabilities first.', color: '#ef4444' },
        { id: 2, title: 'Emergency Buffer', percent: 20, desc: 'Try to save a small portion to avoid acquiring new debt.', color: '#16a34a' },
      ];
    }

    return { chartData, top1, top2, obs1, obs2, investmentPlans };
  }, [allTransactions]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="ing-chart-tt">
          <p className="ing-tt-label">{payload[0].payload.name} Spending</p>
          <p className="ing-tt-val">${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      className="insights-pg"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.div className="insights-header" variants={item}>
        <h1 className="insights-title">Financial Insights</h1>
        <p className="insights-sub">Deep dive into your spending patterns and strategic investing</p>
      </motion.div>

      <div className="ing-grid">
        
        {/* Row 1 Left: Monthly Trend (Span 2) */}
        <motion.div className="ing-card ing-card--span2" variants={item} whileHover={{ y: -5 }}>
          <div className="ing-card__top">
             <div className="ing-ico-wrap ing-ico-wrap--blue">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <line x1="18" y1="20" x2="18" y2="10" />
                 <line x1="12" y1="20" x2="12" y2="4" />
                 <line x1="6" y1="20" x2="6" y2="14" />
               </svg>
             </div>
             <h3 className="ing-card__title">Monthly Expenditure Trend</h3>
          </div>
          
          <div className="ing-chart-box">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stats.chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: isDark ? '#94a3b8' : '#64748b', fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }} tickFormatter={(val) => `$${val}`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {stats.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fullMonth === currentMonthFilter ? '#16a34a' : (isDark ? '#334155' : '#cbd5e1')} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Row 1 Right: Net Cash Flow Battery (Span 1) */}
        <motion.div variants={item} whileHover={{ y: -5 }}>
          <CashFlowBattery />
        </motion.div>

        {/* COMBINED HIGHLIGHT CARD (Span 2) */}
        <motion.div className="ing-card ing-card--span2 ing-card--combined" variants={item} whileHover={{ y: -5 }}>
          <div className="ing-card__top">
            <div className="ing-ico-wrap ing-ico-wrap--orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h3 className="ing-card__title">Expense Intensity Analysis</h3>
          </div>
          
          <div className="combined-content">
            <div className="combined-hero">
              <div className="hero-primary">
                <h2 className="combined-hero__cat">{stats.top1.name}</h2>
                <div className="combined-hero__stats">
                  <div className="combined-stat">
                    <span className="combined-stat__val">${stats.top1.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    <span className="combined-stat__label">Total Spent</span>
                  </div>
                  <div className="combined-stat">
                    <span className="combined-stat__val combined-stat__val--pct">{stats.top1.pct}%</span>
                    <span className="combined-stat__label">of budget</span>
                  </div>
                </div>
              </div>
              
              {stats.top2 && (
                <div className="hero-secondary">
                  <span className="secondary-label">Runner Up: {stats.top2.name}</span>
                  <div className="secondary-stats">
                    <span className="secondary-val">${stats.top2.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    <span className="secondary-pct">{stats.top2.pct}%</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="combined-observations">
              <div className="combined-obs">
                <div className="observer-tag observer-tag--purple">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                  Spending Velocity
                </div>
                <p className="combined-obs__text">{stats.obs1}</p>
              </div>
              
              <div className="combined-obs">
                <div className="observer-tag observer-tag--green">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                  </svg>
                  Capital Retention
                </div>
                <p className="combined-obs__text">{stats.obs2}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subscription Burn Rate - Pie Chart */}
        <motion.div variants={item} whileHover={{ y: -5 }}>
           <SubscriptionBurn />
        </motion.div>

        {/* Full width Investment Priorities */}
        <motion.div className="ing-card ing-card--span3" variants={item} whileHover={{ y: -3 }}>
          <div className="ing-card__top">
             <div className="ing-ico-wrap ing-ico-wrap--green">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
               </svg>
             </div>
             <h3 className="ing-card__title">Recommended Investment Priorities</h3>
          </div>
          
          <div className="ing-plans">
            {stats.investmentPlans.map(plan => (
              <div key={plan.id} className="ing-plan">
                <div className="ing-plan__head">
                  <span className="ing-plan__title">{plan.title}</span>
                  <span className="ing-plan__pct" style={{ color: plan.color }}>{plan.percent}%</span>
                </div>
                <div className="ing-plan__track">
                  <div className="ing-plan__fill" style={{ width: `${plan.percent}%`, background: plan.color }}></div>
                </div>
                <p className="ing-plan__desc">{plan.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
