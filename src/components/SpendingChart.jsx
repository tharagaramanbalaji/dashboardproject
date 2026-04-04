import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import './SpendingChart.css';
import { useApp } from '../context/AppContext';

/* ── Custom tooltip ── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__month">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="chart-tooltip__row">
          <span
            className="chart-tooltip__dot"
            style={{ background: p.color || (p.name === 'Total income' ? '#16a34a' : '#f97316') }}
          />
          <span className="chart-tooltip__label">{p.name}</span>
          <span className="chart-tooltip__value">
            ${p.value.toLocaleString(undefined, { minimumFractionDigits: 0 })}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Legend ── */
function CustomLegend() {
  return (
    <div className="chart-legend">
      <span className="legend-item">
        <span className="legend-dot legend-dot--income" />
        Total income
      </span>
      <span className="legend-item">
        <span className="legend-dot legend-dot--expenses" />
        Total expenses
      </span>
    </div>
  );
}

export default function SpendingChart() {
  const { transactions: allTransactions, theme } = useApp();
  const isDark = theme === 'dark';
  const [period, setPeriod] = useState('Monthly');

  const gridColor = isDark ? '#334155' : '#f1f5f9';
  const tickColor = isDark ? '#94a3b8' : '#64748b';
  const cursorColor = isDark ? '#475569' : '#cbd5e1';

  const chartData = useMemo(() => {
    // Collect all unique months in 2026
    const monthsMap = {};
    const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // We want to show Jan-Dec but only Jan-Apr have data
    // Initialize Jan-Apr
    ['01', '02', '03', '04'].forEach((m, idx) => {
      monthsMap[`2026-${m}`] = { month: monthsOrder[idx], income: 0, expenses: 0 };
    });

    allTransactions.forEach(t => {
      const parts = t.date.split('-');
      const mKey = `${parts[0]}-${parts[1]}`;
      if (monthsMap[mKey]) {
        if (t.amount > 0) {
          monthsMap[mKey].income += t.amount;
        } else {
          monthsMap[mKey].expenses += Math.abs(t.amount);
        }
      }
    });

    return Object.values(monthsMap);
  }, [allTransactions]);

  return (
    <div className="chart-card" aria-label="Statistics chart">
      {/* Header */}
      <div className="chart-card__header">
        <h2 className="chart-card__title">Statistics</h2>
        <button className="chart-period-btn" id="chart-period-toggle"
          onClick={() => setPeriod((p) => (p === 'Monthly' ? 'Weekly' : 'Monthly'))}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {period}
        </button>
      </div>

      {/* Legend */}
      <CustomLegend />

      {/* Chart */}
      <div className="chart-card__body">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke={gridColor}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: tickColor, fontFamily: 'Inter, sans-serif' }}
              axisLine={false}
              tickLine={false}
              interval={0}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis hide={true} />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: cursorColor, strokeWidth: 1.5, strokeDasharray: '4 4' }} 
            />
            <Line
              type="monotone"
              dataKey="income"
              name="Total income"
              stroke="#16a34a"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#16a34a', stroke: '#fff', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              name="Total expenses"
              stroke="#f97316"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#f97316', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
