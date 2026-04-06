import { useState } from 'react';
import './Header.css';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { role, setRole, theme, toggleTheme } = useApp();
  const [hasNotif, setHasNotif] = useState(true);
  const [query, setQuery] = useState('');

  const toggleRole = () =>
    setRole((prev) => (prev === 'admin' ? 'viewer' : 'admin'));

  return (
    <header className="header">
      {/* ── Left: Logo + Title ── */}
      <div className="header__brand" onClick={() => window.location.reload()} style={{ cursor: 'pointer' }}>
        <div className="header__logo-ico">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" 
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
            <path d="M12 18V6" />
          </svg>
        </div>
        <span className="header__title">TrackMint</span>
      </div>

      {/* ── Centre: Search Bar ── */}
      <div className="header__search">
        <svg
          className="search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search"
        />
      </div>

      {/* ── Right: Role Toggle + Bell ── */}
      <div className="header__actions">
        {/* Role Toggle */}
        <div className="role-toggle" title="Switch role">
          <span className={`role-label ${role === 'viewer' ? 'role-label--active' : ''}`}>
            Viewer
          </span>

          <button
            className={`toggle-track ${role === 'admin' ? 'toggle-track--admin' : ''}`}
            onClick={toggleRole}
            aria-label="Toggle admin / viewer role"
          >
            <span className="toggle-thumb" />
          </button>

          <span className={`role-label ${role === 'admin' ? 'role-label--active' : ''}`}>
            Admin
          </span>
        </div>

        {/* Role Badge */}
        <span className={`role-badge role-badge--${role}`}>
          {role === 'admin' ? '⚙ Admin' : '👁 Viewer'}
        </span>

        {/* Notification Bell */}
        <button
          className="notif-btn"
          aria-label="Notifications"
          onClick={() => setHasNotif(false)}
          title="Notifications"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="notif-icon"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {hasNotif && <span className="notif-dot" aria-hidden="true" />}
        </button>

        {/* Theme Toggle */}
        <button
          className="theme-toggle-btn"
          aria-label="Toggle theme"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="theme-icon">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="theme-icon">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}