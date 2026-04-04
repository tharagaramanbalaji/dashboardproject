import { useState, useMemo } from 'react';
import './TransactionsPage.css';
import { useApp } from '../context/AppContext';

const CATEGORIES = ['All', 'Income', 'Platform', 'Food & Health', 'Shopping', 'Entertainment', 'Utilities'];
const STATUSES = ['Success', 'Pending', 'Failed'];

const CAT_COLORS = {
  'Income':        { bg: '#f0fdf4', color: '#16a34a' },
  'Platform':      { bg: '#fff1f2', color: '#e11d48' },
  'Food & Health': { bg: '#ecfeff', color: '#0891b2' },
  'Shopping':      { bg: '#fff7ed', color: '#ea580c' },
  'Entertainment': { bg: '#f0fdf4', color: '#15803d' },
  'Utilities':     { bg: '#f8fafc', color: '#475569' },
};

const STATUS_COLORS = {
  Success: '#16a34a',
  Pending: '#f59e0b',
  Failed:  '#ef4444',
};

/* ── Helpers ── */
function fmtDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtAmount(amt) {
  const sign = amt >= 0 ? '+' : '−';
  return `${sign} $${Math.abs(amt).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function TransactionsPage() {
  const { role, transactions: allTransactions, saveTransactions, deleteTransaction } = useApp();
  const isAdmin = role === 'admin';

  const [month, setMonth] = useState('2026-04');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [selected, setSelected] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTxn, setEditTxn] = useState(null);
  const [formData, setFormData] = useState({
    name: '', category: 'Utilities', date: '2026-04-12', amount: '', method: 'Debit card', status: 'Success'
  });

  /* Filtered & sorted */
  const transactions = useMemo(() => {
    let list = allTransactions.filter((t) => t.date.startsWith(month));

    if (catFilter !== 'All') {
      list = list.filter((t) => t.category === catFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
         (t) =>
           t.name.toLowerCase().includes(q) ||
           t.category.toLowerCase().includes(q)
       );
    }

    list = [...list].sort((a, b) => {
      if (sortBy === 'newest') return b.date.localeCompare(a.date) || b.id - a.id;
      if (sortBy === 'oldest') return a.date.localeCompare(b.date) || a.id - b.id;
      if (sortBy === 'highest') return Math.abs(b.amount) - Math.abs(a.amount);
      if (sortBy === 'lowest')  return Math.abs(a.amount) - Math.abs(b.amount);
      return 0;
    });

    return list;
  }, [allTransactions, month, catFilter, search, sortBy]);

  const openAddModal = () => {
    setEditTxn(null);
    setFormData({ name: '', category: 'Utilities', date: '2026-04-12', amount: '', method: 'Debit card', status: 'Success' });
    setIsModalOpen(true);
  };

  const openEditModal = () => {
    if (!selected) return;
    setEditTxn(selected.id);
    setFormData({
      name: selected.name,
      category: selected.category,
      date: selected.date,
      amount: selected.amount,
      method: selected.method,
      status: selected.status
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditTxn(null);
  };

  const handleSaveTxn = (e) => {
    e.preventDefault();
    let parsedAmount = Math.abs(parseFloat(formData.amount) || 0);
    if (formData.category !== 'Income') {
      parsedAmount = -parsedAmount;
    }

    const newTxn = {
      ...formData,
      amount: parsedAmount,
    };

    if (editTxn) {
      newTxn.id = editTxn;
      const updated = allTransactions.map(t => t.id === editTxn ? newTxn : t);
      saveTransactions(updated);
      setSelected(newTxn);
    } else {
      newTxn.id = Date.now();
       saveTransactions([newTxn, ...allTransactions]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
      if (selected?.id === id) setSelected(null);
    }
  };

  return (
    <div className="txnp">
      <div className="txnp__list-panel">
        <div className="txnp__top">
          <h2 className="txnp__title">All Transactions</h2>
          {isAdmin && (
            <button className="txnp__add-btn" id="btn-add-txn" onClick={openAddModal}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add transaction
            </button>
          )}
        </div>

        <div className="txnp__toolbar">
          <div className="txnp__search-wrap">
            <svg className="txnp__search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="txnp__search"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search transactions"
            />
          </div>

          <select className="txnp__select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest</option>
            <option value="lowest">Lowest</option>
          </select>

          <select className="txnp__select" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c === 'All' ? 'All categories' : c}</option>
            ))}
          </select>

          <input 
            type="month"
            className="txnp__select txnp__select--month" 
            value={month}
            onChange={(e) => { setMonth(e.target.value); setSelected(null); }}
          />
        </div>

        <div className="txnp__col-head">
          <span>Description</span>
          <span>Category</span>
          <span>Date</span>
          <span className="txnp__col-r">Amount</span>
          <span className="txnp__col-r">Status</span>
        </div>

        {transactions.length === 0 ? (
          <p className="txnp__empty">No transactions found.</p>
        ) : (
          <ul className="txnp__rows" role="list">
            {transactions.map((t) => {
              const cat = CAT_COLORS[t.category] || CAT_COLORS['Utilities'];
              const isCredit = t.amount >= 0;
              const isActive = selected?.id === t.id;
              return (
                <li
                  key={t.id}
                  className={`txnp__row${isActive ? ' txnp__row--active' : ''}`}
                  onClick={() => setSelected(t)}
                  tabIndex={0}
                  role="button"
                >
                  <span className="txnp__row-name">{t.name}</span>
                  <span className="txnp__row-cat" style={{ background: cat.bg, color: cat.color }}>
                    {t.category}
                  </span>
                  <span className="txnp__row-date">{fmtDate(t.date)}</span>
                  <span className={`txnp__row-amt ${isCredit ? 'amt--up' : 'amt--dn'}`}>
                    {fmtAmount(t.amount)}
                  </span>
                  <span className="txnp__row-status" style={{ color: STATUS_COLORS[t.status] }}>
                    {t.status}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        <p className="txnp__count">{transactions.length} transaction{transactions.length !== 1 && 's'}</p>
      </div>

      <div className={`txnp__detail-panel${selected ? ' txnp__detail-panel--open' : ''}`}>
        {selected ? (
          <>
            <div className="txnp__detail-top">
              <h2 className="txnp__detail-title">Transaction details</h2>
              <button className="txnp__detail-close" onClick={() => setSelected(null)} aria-label="Close details">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="txnp__detail-hero">
              <span className="txnp__detail-cat-pill" style={{ background: (CAT_COLORS[selected.category] || CAT_COLORS['Utilities']).bg, color: (CAT_COLORS[selected.category] || CAT_COLORS['Utilities']).color }}>
                {selected.category}
              </span>
              <span className={`txnp__detail-amount ${selected.amount >= 0 ? 'amt--up' : 'amt--dn'}`}>
                {fmtAmount(selected.amount)}
              </span>
            </div>

            <div className="txnp__detail-fields">
              <div className="txnp__detail-field">
                <span className="field-label">Status</span>
                <span className="field-value" style={{ color: STATUS_COLORS[selected.status] }}>
                  ● {selected.status}
                </span>
              </div>
              <div className="txnp__detail-field">
                <span className="field-label">Date</span>
                <span className="field-value">{fmtDate(selected.date)}</span>
              </div>
              <div className="txnp__detail-field">
                <span className="field-label">Payment method</span>
                <span className="field-value">{selected.method}</span>
              </div>
            </div>

            {isAdmin && (
              <div className="txnp__detail-actions">
                <button className="txnp__edit-btn" onClick={openEditModal}>
                  Edit
                </button>
                <button className="txnp__del-btn--large" onClick={() => handleDelete(selected.id)}>
                  Delete
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="txnp__detail-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <p>Select a transaction to view details</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="txnp-modal-overlay" onClick={closeModal}>
          <div className="txnp-modal" onClick={e => e.stopPropagation()}>
            <div className="txnp-modal__top">
              <h3>{editTxn ? 'Edit Transaction' : 'New Transaction'}</h3>
              <button onClick={closeModal} className="txnp-modal__close">✕</button>
            </div>
            <form onSubmit={handleSaveTxn} className="txnp-modal__form">
              <label>
                Description
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </label>
              <div className="txnp-modal__row">
                <label>
                  Category
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
                <label>
                  Date
                  <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </label>
              </div>
              <div className="txnp-modal__row">
                <label>
                  Amount
                  <input type="number" step="0.01" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                </label>
                <label>
                  Status
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
              </div>
              <label>
                Payment Method
                <input type="text" required value={formData.method} onChange={e => setFormData({...formData, method: e.target.value})} />
              </label>
              <div className="txnp-modal__actions">
                <button type="button" onClick={closeModal} className="txnp-modal__cancel">Cancel</button>
                <button type="submit" className="txnp-modal__save">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
