import React, { useState } from 'react';

import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Login from './components/Login';
import Welcome from './components/Welcome';
import Sidebar from './components/Sidebar';
import ComposeMail from './components/ComposeMail';

const App = () => {

  const [screen, setScreen] = useState('signup');

  const isMailbox =
    screen === 'welcome' ||
    screen === 'compose';

  return (
    <>
      <Navbar
        screen={screen}
        setScreen={setScreen}
      />

      {screen === 'signup' && (
        <Signup setScreen={setScreen} />
      )}

      {screen === 'login' && (
        <Login setScreen={setScreen} />
      )}

      {isMailbox && (
        <div className="mailbox-layout">

          <Sidebar
            onCompose={() =>
              setScreen('compose')
            }
          />

          <main className="mailbox-content">

            {screen === 'welcome' && (
              <Welcome
                setScreen={setScreen}
              />
            )}

            {screen === 'compose' && (
              <ComposeMail
                onClose={() =>
                  setScreen('welcome')
                }
              />
            )}

          </main>

        </div>
      )}
    </>
  );
};

export default App;