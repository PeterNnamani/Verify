
import React, { useState } from 'react';
import { CaptchaPage } from './components/CaptchaPage';
import { RegistrationPage } from './components/RegistrationPage';

const App: React.FC = () => {
  const [verified, setVerified] = useState(false);

  return (
    <div className="app-root">
      {!verified ? (
        <CaptchaPage onVerified={() => setVerified(true)} />
      ) : (
        <RegistrationPage />
      )}
    </div>
  );
};

export default App;
