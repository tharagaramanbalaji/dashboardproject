import './Transactions.css';
import { useApp } from '../context/AppContext';

const CATEGORY_COLORS = {
  'Income':        { bg: '#f0fdf4', color: '#16a34a' },
  'Platform':      { bg: '#fff1f2', color: '#e11d48' },
  'Food & Health': { bg: '#ecfeff', color: '#0891b2' },
  'Shopping':      { bg: '#fff7ed', color: '#ea580c' },
  'Entertainment': { bg: '#f0fdf4', color: '#15803d' },
  'Utilities':     { bg: '#f8fafc', color: '#475569' },
};

function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Transactions({ onNavigate }) {
  const { transactions: allTransactions } = useApp();
  
  const recentTransactions = [...allTransactions]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
    .slice(0, 10);

  return (
    <div className="txn-card" aria-label="Recent transactions">
      <div className="txn-card__header">
        <div>
          <h2 className="txn-card__title">Last 10 Transactions</h2>
          <p className="txn-card__sub">Your most recent activity</p>
        </div>
        <span className="txn-card__count">{allTransactions.length} entries</span>
      </div>

      <div className="txn-table-head">
        <span>Description</span>
        <span>Category</span>
        <span>Date</span>
        <span className="txn-col--right">Amount</span>
      </div>

      <ul className="txn-list" role="list">
        {recentTransactions.map((t) => {
          const cat = CATEGORY_COLORS[t.category] || CATEGORY_COLORS['Utilities'];
          const isCredit = t.amount > 0;
          return (
            <li key={t.id} className="txn-row">
              <span className="txn-row__name">{t.name}</span>

              <span className="txn-row__cat" style={{ background: cat.bg, color: cat.color }}>
                {t.category}
              </span>

              <span className="txn-row__date">{fmtDate(t.date)}</span>

              <span className={`txn-row__amount ${isCredit ? 'txn-row__amount--credit' : 'txn-row__amount--debit'}`}>
                {isCredit ? '+' : '−'}${Math.abs(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </li>
          );
        })}
        {recentTransactions.length === 0 && (
          <p className="txn-empty">No transactions yet.</p>
        )}
      </ul>

      <div className="txn-card__footer">
        <button 
          id="btn-view-all-txn" 
          className="txn-view-all" 
          onClick={() => onNavigate && onNavigate('transactions')}
        >
          View all transactions
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
}
