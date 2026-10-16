import React from 'react';
import { Button } from 'react-bootstrap';
import { signOut } from 'firebase/auth';

import { auth } from '../firebase';

const Welcome = ({ setScreen }) => {

  const handleLogout = async () => {
    try {
      await signOut(auth);

      localStorage.removeItem('idToken');

      setScreen('login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCompose = () => {
    setScreen('compose');
  };

  return (
    <div className="welcome-page">

      <div className="welcome-box">

        <div className="welcome-icon">
          📧
        </div>

        <h1>
          Welcome to your Mailbox
        </h1>

        <p>
          You have successfully logged in.
        </p>

        <div className="welcome-actions">

          <Button
            variant="primary"
            onClick={handleCompose}
          >
            ✎ Compose Mail
          </Button>

          <Button
            variant="outline-secondary"
            onClick={handleLogout}
          >
            Logout
          </Button>

        </div>

      </div>

    </div>
  );
};

export default Welcome;