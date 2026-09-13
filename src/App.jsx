import React, { useState } from 'react';
import Inbox from './components/Inbox';

import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Login from './components/Login';
import Welcome from './components/Welcome';
import Sidebar from './components/Sidebar';
import ComposeMail from './components/ComposeMail';

const App = () => {

  const [screen, setScreen] = useState('signup');

  const [unreadCount, setUnreadCount] = useState(0);

  const isMailbox =
    screen === 'welcome' ||
    screen === 'compose' ||
    screen === 'inbox' ||
    screen === 'sent';

  const handleCompose = () => {
    setScreen('compose');
  };

  const handleInbox = () => {
    setScreen('inbox');
  };

  const handleSent = () => {
    setScreen('sent');
  };

  return (
    <>
      <Navbar
        screen={screen}
        setScreen={setScreen}
      />

      {screen === 'signup' && (
        <Signup
          setScreen={setScreen}
        />
      )}

      {screen === 'login' && (
        <Login
          setScreen={setScreen}
        />
      )}

      {isMailbox && (
        <div className="mailbox-layout">

          <Sidebar
            onCompose={handleCompose}
            onInbox={handleInbox}
            onSent={handleSent}
            unreadCount={unreadCount}
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

            {screen === 'inbox' && (
              <Inbox
                mailboxType="inbox"
                onUnreadCountChange={
                  setUnreadCount
                }
              />
            )}

            {screen === 'sent' && (
              <Inbox
                mailboxType="sent"
              />
            )}

          </main>

        </div>
      )}

    </>
  );
};

export default App;