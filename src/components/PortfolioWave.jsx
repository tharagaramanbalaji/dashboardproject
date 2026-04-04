import { useState } from 'react';
import './PortfolioWave.css';

export default function PortfolioWave() {
  const [isBoosting, setIsBoosting] = useState(false);

  const handleBoost = () => {
    setIsBoosting(true);
    setTimeout(() => setIsBoosting(false), 2400); // 2.4s pulse
  };

  return (
    <div className={`portfolio-wave${isBoosting ? ' is-boosting' : ''}`} aria-label="Portfolio activity pulse">
      <button 
        className={`portfolio-wave__boost${isBoosting ? ' portfolio-wave__boost--active' : ''}`}
        onClick={handleBoost}
        disabled={isBoosting}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12 }}>
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
        </svg>
        {isBoosting ? 'Pulse Active' : 'Boost Pulse'}
      </button>

      <div className="portfolio-wave__header">
        <span className="portfolio-wave__label">Portfolio Pulse</span>
        <span className="portfolio-wave__status">Dynamic Activity</span>
      </div>

      <div className="wave-container">
        <svg className="wave-svg" viewBox="0 0 100 20" preserveAspectRatio="none">
          <path
            className="wave-path"
            d="M 0 10 Q 5 7, 10 10 T 20 10 T 30 10 T 40 10 T 50 10 T 60 10 T 70 10 T 80 10 T 90 10 T 100 10 V 20 H 0 Z"
          />
          <path
            className="wave-path wave-path--2"
            d="M 0 10 Q 5 12, 10 10 T 20 10 T 30 10 T 40 10 T 50 10 T 60 10 T 70 10 T 80 10 T 90 10 T 100 10 V 20 H 0 Z"
          />
          <path
            className="wave-path wave-path--3"
            d="M 0 10 Q 5 8, 10 10 T 20 10 T 30 10 T 40 10 T 50 10 T 60 10 T 70 10 T 80 10 T 90 10 T 100 10 V 20 H 0 Z"
          />
        </svg>
      </div>

      <div className="wave-content">
        <span className="wave-value">{isBoosting ? 'Synchronizing State...' : 'Live Syncing'}</span>
      </div>
    </div>
  );
}
