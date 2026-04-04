import { useApp } from '../context/AppContext';
import './SettingsPage.css';

export default function SettingsPage() {
  const { role } = useApp();
  
  return (
    <div className="settings-pg">
      <h1 className="settings-title">Settings</h1>
      <p className="settings-sub">Manage your dashboard preferences and account</p>

      <div className="settings-content">

        {/* Profile Card */}
        <div className="settings-card">
          <h3 className="settings-card__title">Profile Setup</h3>
          <div className="settings-form">
            <label className="settings-label">
              Display Name
              <input type="text" value="Tharagaraman" readOnly className="settings-input" />
            </label>
            <label className="settings-label">
              Email Address
              <input type="email" value="[EMAIL_ADDRESS]" readOnly className="settings-input" />
            </label>
            <label className="settings-label">
              Current Role
              <span className={`settings-badge settings-badge--${role}`}>
                {role}
              </span>
            </label>
          </div>
        </div>

        {/* Preferences Card */}
        <div className="settings-card">
          <h3 className="settings-card__title">Preferences</h3>

          <div className="settings-row">
            <div>
              <div className="settings-row__label">Push Notifications</div>
              <div className="settings-row__sub">Receive alerts for suspicious activities</div>
            </div>
            <div style={{ width: '44px', height: '24px', background: '#cbd5e1', borderRadius: '99px', position: 'relative', cursor: 'not-allowed', opacity: 0.6 }}>
              <div style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: '3px' }} />
            </div>
          </div>

          <div className="settings-row settings-row--no-border">
            <div>
              <div className="settings-row__label">Email Weekly Reports</div>
              <div className="settings-row__sub">A summary of your spending habits</div>
            </div>
            <div style={{ width: '44px', height: '24px', background: 'var(--primary)', borderRadius: '99px', position: 'relative', cursor: 'not-allowed', opacity: 0.6 }}>
              <div style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', right: '3px' }} />
            </div>
          </div>
        </div>

        {/* Reset Card */}
        <div className="settings-card settings-card--danger">
          <h3 className="settings-card__title settings-card__title--danger">Danger Zone</h3>
          <p className="settings-desc--danger">
            Reset all dashboard data to initial defaults. This will permanently delete your custom transactions.
          </p>
          <button
            className="settings-btn--reset"
            onClick={() => {
              if (window.confirm('Are you sure? This will delete all custom transactions and reset to defaults.')) {
                localStorage.removeItem('finance_transactions_v3');
                window.location.reload();
              }
            }}
          >
            Reset All Dashboard Data
          </button>
        </div>

      </div>
    </div>
  );
}
