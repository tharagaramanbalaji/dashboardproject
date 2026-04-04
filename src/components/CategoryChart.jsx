import { useMemo } from 'react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
  PolarAngleAxis,
} from 'recharts';
import './CategoryChart.css';
import { useApp } from '../context/AppContext';

const COLORS = {
  'Food & Health': '#06b6d4',
  'Shopping': '#f97316',
  'Platform': '#ef4444',
  'Entertainment': '#16a34a',
  'Utilities': '#64748b',
};

/* Custom tooltip */
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="cat-tooltip">
      <span className="cat-tooltip__name">{d.name}</span>
      <span className="cat-tooltip__amount">${d.amount.toFixed(2)}</span>
    </div>
  );
}

export default function CategoryChart({ onNavigate }) {
  const { transactions: allTransactions, theme } = useApp();
  const isDark = theme === 'dark';

  const chartData = useMemo(() => {
    const curMonth = '2026-04';
    const cats = {};
    let totalAmt = 0;

    allTransactions.forEach(t => {
      if (t.date.startsWith(curMonth) && t.amount < 0) {
        cats[t.category] = (cats[t.category] || 0) + Math.abs(t.amount);
        totalAmt += Math.abs(t.amount);
      }
    });

    const data = Object.entries(cats).map(([name, amount]) => ({
      name,
      amount,
      value: totalAmt ? Math.round((amount / totalAmt) * 100) : 0,
      fill: COLORS[name] || '#cbd5e1',
    })).sort((a, b) => a.value - b.value).slice(0, 5);

    return { data, totalAmt };
  }, [allTransactions]);

  const [intPart, decPart] = chartData.totalAmt.toLocaleString(undefined, { minimumFractionDigits: 2 }).split('.');

  return (
    <div className="cat-card" aria-label="Expenditure by category">
      <div className="cat-card__content">

        {/* Left Side: Text and Legend */}
        <div className="cat-card__left">
          <div>
            <h2 className="cat-card__title">Spending Breakdown</h2>
            <p className="cat-card__sub">Monthly expenditure by category</p>
          </div>

          <div className="cat-card__total">
            <span className="cat-card__total-label">Total Expenditure</span>
            <span className="cat-card__total-amount">${intPart}<span>.{decPart}</span></span>
          </div>

          <ul className="cat-legend" role="list">
            {chartData.data.map((c) => (
              <li key={c.name} className="cat-legend__row">
                <span className="cat-legend__dot" style={{ background: c.fill }} />
                <span className="cat-legend__name">{c.name}</span>
                <span className="cat-legend__pct">{c.value}%</span>
              </li>
            ))}
          </ul>

          <button className="cat-btn" onClick={() => onNavigate && onNavigate('insights')}>
            View more insights
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 13, height: 13 }}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>

        {/* Right Side: Chart */}
        <div className="cat-card__right">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="30%"
              outerRadius="100%"
              data={chartData.data}
              startAngle={90}
              endAngle={-270}
              barSize={7}
              barGap={30}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar
                background={{ fill: isDark ? '#334155' : '#f1f5f9' }}
                dataKey="value"
                cornerRadius={6}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
