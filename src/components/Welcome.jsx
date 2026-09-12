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
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="welcome-area">

      <div className="welcome-card">

        <h1>Welcome to your mail box</h1>

        <p>
          You have successfully logged in.
        </p>

        <Button
          className="compose-main-button"
          onClick={() => setScreen('compose')}
        >
          Compose Mail
        </Button>

        <Button
          className="logout-button mt-3"
          onClick={handleLogout}
        >
          Logout
        </Button>

      </div>

    </div>
  );
};

export default Welcome;