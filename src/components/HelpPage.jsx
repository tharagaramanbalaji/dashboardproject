export default function HelpPage() {
  return (
    <div style={{ padding: '28px', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '8px', fontWeight: 700 }}>Help & Support</h1>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '24px' }}>How can we help you today?</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
        <div style={{ padding: '20px', border: '1px solid var(--border-dim)', borderRadius: '12px', background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: 'var(--text-main)' }}>How do I add a new transaction?</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
            Navigate to the Transactions tab using the navigation bar. Click the green "Add transaction" button in the top right corner. Note: Only Admin users have permission to add or edit transactions.
          </p>
        </div>
        
        <div style={{ padding: '20px', border: '1px solid var(--border-dim)', borderRadius: '12px', background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: 'var(--text-main)' }}>How do I export my financial data?</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
            The Export feature is currently under active development. Once released, you will be able to export your monthly reports directly from the Report tab via CSV or PDF.
          </p>
        </div>

        <div style={{ padding: '20px', border: '1px solid var(--border-dim)', borderRadius: '12px', background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: 'var(--text-main)' }}>Need to talk to support?</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
            You can reach our customer success team 24/7 by emailing <strong style={{color: 'var(--text-main)'}}>support@zrovyn.com</strong> or calling our toll-free line at <strong style={{color: 'var(--text-main)'}}>1-800-456-7890</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
