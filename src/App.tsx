
import React, { useState } from 'react';
import { ManualCaptcha } from './components/ManualCaptcha';
import { RegistrationPage } from './components/RegistrationPage';

const App: React.FC = () => {
  const [verified, setVerified] = useState(false);

  return (
    <div className="app-root">
      {!verified ? (
        <ManualCaptcha onVerified={() => setVerified(true)} />
      ) : (
        <RegistrationPage />
      )}
    </div>
  );
};

export default App;
