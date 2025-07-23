import React, { useState, useCallback } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import './CaptchaPage.css';

export const CaptchaPage: React.FC<{ onVerified: () => void }> = ({ onVerified }) => {
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('http://localhost:3001/verify-captcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ token }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (!data) {
        throw new Error('No data received from server');
      }
      
      return data.success;
    } catch (error) {
      console.error('CAPTCHA verification error:', error);
      throw new Error('Server connection failed. Please try again.');
    }
  };

  const handleCaptchaChange = useCallback(async (token: string | null) => {
    if (token) {
      setVerifying(true);
      setError('');
      try {
        const isValid = await verifyToken(token);
        if (isValid) {
          onVerified();
        } else {
          setError('CAPTCHA verification failed. Please try again.');
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Verification error. Please try again.');
        }
        console.error('Error:', error);
      } finally {
        setVerifying(false);
      }
    } else {
      setError('Please complete the CAPTCHA verification.');
    }
  }, [onVerified]);

  return (
    <div className="captcha-container">
      <div className="captcha-box">
        <h2>Verify you're not a robot</h2>
        <div className="recaptcha-wrapper">
          <ReCAPTCHA
            sitekey="6LfQUIsrAAAAAObkdu5PnyEdKhe8jdjZciMUz4Se"
            onChange={handleCaptchaChange}
            theme="light"
            size="normal"
          />
        </div>
        {verifying && <div className="verifying">Verifying...</div>}
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
};
