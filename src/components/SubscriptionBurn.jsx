import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './SubscriptionBurn.css';
import { useApp } from '../context/AppContext';

export default function SubscriptionBurn() {
  const { transactions: allTransactions } = useApp();

  const subData = useMemo(() => {
    // Current month focus
    const currentMonth = '2026-04';
    
    // Filter for recurring looking items - memberships, premium, subscription, hosting
    const recurringKeywords = ['subscription', 'premium', 'membership', 'hosting', 'member'];
    
    const subs = allTransactions.filter(t => {
      const name = t.name.toLowerCase();
      const monthPrefix = t.date.substring(0, 7);
      return monthPrefix === currentMonth && 
             recurringKeywords.some(key => name.includes(key)) &&
             t.amount < 0;
    });

    const totalBurn = Math.abs(subs.reduce((acc, s) => acc + s.amount, 0));
    
    // Aggregate for Pie
    const chartData = subs.map(s => ({
      name: s.name.replace(' Subscription', '').replace(' Premium', '').replace(' Membership', ''),
      value: Math.abs(s.amount),
    })).sort((a, b) => b.value - a.value);

    // Dynamic colors Red intensity
    const COLORS = ['#ef4444', '#f87171', '#fb923c', '#fca5a5', '#fee2e2'];

    return { chartData, totalBurn, COLORS };
  }, [allTransactions]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="cat-tooltip">
          <span className="cat-tooltip__name">{payload[0].name}</span>
          <span className="cat-tooltip__amount">${payload[0].value.toFixed(2)}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="ing-card" aria-label="Subscriptions recurring burn">
      <div className="sub-burn">
        <div className="sub-burn__top">
          <div className="sub-burn__ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>
          <h3 className="sub-burn__title">Silent Recurring Drain</h3>
        </div>

        <div className="sub-burn__hero">
          <div className="sub-burn__chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subData.chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="65%"
                  outerRadius="100%"
                  paddingAngle={6}
                  dataKey="value"
                  animationBegin={200}
                >
                  {subData.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={subData.COLORS[index % subData.COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="sub-burn__stats">
            <div>
              <p className="sub-burn__total-label">Monthly Burn Rate</p>
              <p className="sub-burn__total-val">${subData.totalBurn.toFixed(2)}<span> / mo</span></p>
            </div>
            
            <ul className="sub-burn__list" role="list">
              {subData.chartData.slice(0, 3).map((item, i) => (
                <li key={item.name} className="sub-burn__item">
                  <div className="sub-burn__item-info">
                    <span className="sub-burn__dot" style={{ background: subData.COLORS[i % subData.COLORS.length] }}></span>
                    {item.name}
                  </div>
                  <span className="sub-burn__item-val">${item.value.toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="sub-burn__warning">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <p>You have {subData.chartData.length} active recurring subscriptions. Review any unused memberships to recover cashflow.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
