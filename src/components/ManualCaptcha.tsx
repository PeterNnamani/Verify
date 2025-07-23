import React, { useState } from 'react';
import './CaptchaPage.css';

// Google reCAPTCHA logo SVG
const RecaptchaLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" style={{ marginRight: 8 }}>
    <g>
      <circle cx="16" cy="16" r="16" fill="#f9f9f9" />
      <path d="M16 6a10 10 0 0 1 9.95 9.1h-2.02A8 8 0 1 0 24 18h-3v2h6v-6h-2v2.08A10 10 0 1 1 16 6z" fill="#4285f4" />
      <path d="M16 26a10 10 0 0 1-9.95-9.1h2.02A8 8 0 1 0 8 14h3v-2H5v6h2v-2.08A10 10 0 1 1 16 26z" fill="#34a853" />
    </g>
  </svg>
);

export const ManualCaptcha: React.FC<{ onVerified: () => void }> = ({ onVerified }) => {
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  // No challenge, just loader and tick
  const [verified, setVerified] = useState(false);

  const handleBoxClick = () => {
    if (verified) return;
    setClicked(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVerified(true);
      setTimeout(() => onVerified(), 600);
    }, 1200);
  };


  return (
    <div className="captcha-container">
      <div
        className={`captcha-box manual-captcha${verified ? ' verified' : ''}`}
        style={{ cursor: verified ? 'default' : 'pointer', minWidth: 320, minHeight: 120, boxShadow: '0 2px 8px rgba(60,64,67,.15)' }}
        onClick={handleBoxClick}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <RecaptchaLogo />
          <span style={{ fontWeight: 500, fontSize: 18, color: '#222' }}>Verify you’re not a robot</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <div className={`checkbox-fake${verified ? ' checked' : ''}`} style={{ marginRight: 10 }} />
          {!clicked && !verified && <span style={{ color: '#555' }}>Click the box to continue</span>}
        </div>
        {loading && (
          <div className="recaptcha-loader" style={{ margin: '20px auto' }} />
        )}
        {/* No challenge step, just loader and tick */}
        {verified && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <div className="checkbox-fake checked" />
            <span style={{ color: 'green', fontWeight: 600 }}>Verified</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 18, fontSize: 12, color: '#888', justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" style={{ marginRight: 2 }}><circle cx="8" cy="8" r="8" fill="#4285f4" /></svg>
            <span>reCAPTCHA</span>
          </span>
          <span>Privacy - Terms</span>
        </div>
      </div>
    </div>
  );
};
