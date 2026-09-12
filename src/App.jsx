import React, { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Container,
  Form,
  Nav,
  Navbar,
  Spinner,
  Stack,
} from 'react-bootstrap';

import {
  createUserWithEmailAndPassword,
  getIdToken,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

import { auth } from './firebase';

const firebaseErrors = {
  'auth/email-already-in-use':
    'An account already exists with this email address.',
  'auth/invalid-email':
    'Please enter a valid email address.',
  'auth/weak-password':
    'Password should be at least 6 characters long.',
  'auth/invalid-credential':
    'Invalid email or password.',
  'auth/user-not-found':
    'Invalid email or password.',
  'auth/wrong-password':
    'Invalid email or password.',
  'auth/network-request-failed':
    'Network error. Please check your internet connection.',
  'auth/operation-not-allowed':
    'Email/password authentication is not enabled in Firebase.',
};

function App() {
  const [screen, setScreen] = useState('signup');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // ---------------- SIGNUP ----------------

  const handleSignup = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    const cleanEmail = email.trim();

    if (!cleanEmail || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      console.log('User has successfully signed up.');

      await signOut(auth);

      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setSuccess('Account created successfully. Please login.');

      setTimeout(() => {
        setSuccess('');
        setScreen('login');
      }, 1200);
    } catch (firebaseError) {
      console.error('Signup error:', firebaseError);

      setError(
        firebaseErrors[firebaseError.code] ||
          'Unable to create your account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LOGIN ----------------

  const handleLogin = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError('Please enter email and password.');
      return;
    }

    setLoading(true);

    try {
      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );

      // Get Firebase ID token
      const token = await getIdToken(userCredential.user);

      // Store token in localStorage
      localStorage.setItem('idToken', token);

      console.log('User has successfully logged in.');

      setEmail('');
      setPassword('');

      // Show welcome screen
      setScreen('welcome');
    } catch (firebaseError) {
      console.error('Login error:', firebaseError);

      alert(
        firebaseErrors[firebaseError.code] ||
          'Invalid email or password.'
      );

      setError(
        firebaseErrors[firebaseError.code] ||
          'Invalid email or password.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LOGOUT ----------------

  const handleLogout = async () => {
    try {
      await signOut(auth);

      localStorage.removeItem('idToken');

      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError('');
      setSuccess('');

      setScreen('login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // ---------------- NAVBAR ----------------

  const NavbarSection = () => (
    <Navbar className="top-navbar" expand="md">
      <Container fluid className="px-4 px-md-5">
        <Navbar.Brand
          className="brand"
          onClick={() => setScreen('signup')}
          style={{ cursor: 'pointer' }}
        >
          <span className="brand-mark">
            <span className="brand-mark-inner" />
          </span>

          <span>Mailbox Client</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />

        <Navbar.Collapse id="main-nav">
          <Nav className="ms-md-4 gap-md-2">
            <Nav.Link onClick={() => setScreen('signup')}>
              Home
            </Nav.Link>

            <Nav.Link onClick={() => setScreen('login')}>
              Login
            </Nav.Link>

            <Nav.Link>About Us</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );

  // ---------------- WELCOME SCREEN ----------------

  if (screen === 'welcome') {
    return (
      <div className="app-shell">
        <NavbarSection />

        <div className="blue-shape" />

        <main className="welcome-area">
          <Card className="welcome-card">
            <Card.Body>
              <h1>Welcome to your mail box</h1>

              <p>
                You have successfully logged in.
              </p>

              <Button
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Card.Body>
          </Card>
        </main>
      </div>
    );
  }

  // ---------------- LOGIN SCREEN ----------------

  if (screen === 'login') {
    return (
      <div className="app-shell">
        <NavbarSection />

        <div className="blue-shape" />

        <main className="signup-area">
          <Container className="d-flex justify-content-center align-items-center h-100">
            <Stack className="signup-stack" gap={2}>
              <Card className="signup-card login-card">
                <Card.Body>
                  <h1 className="signup-title">Login</h1>

                  {error && (
                    <Alert
                      variant="danger"
                      className="message"
                    >
                      {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleLogin} noValidate>
                    <Form.Group
                      className="mb-2"
                      controlId="loginEmail"
                    >
                      <Form.Control
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) =>
                          setEmail(event.target.value)
                        }
                        autoComplete="email"
                        required
                        disabled={loading}
                      />
                    </Form.Group>

                    <Form.Group
                      className="mb-2"
                      controlId="loginPassword"
                    >
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) =>
                          setPassword(event.target.value)
                        }
                        autoComplete="current-password"
                        required
                        disabled={loading}
                      />
                    </Form.Group>

                    <Button
                      type="submit"
                      className="signup-button"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            size="sm"
                            className="me-2"
                          />
                          Logging in...
                        </>
                      ) : (
                        'Login'
                      )}
                    </Button>

                    <div className="forgot-password">
                      <a href="#forgot-password">
                        Forgot password
                      </a>
                    </div>
                  </Form>
                </Card.Body>
              </Card>

              <Button
                variant="outline-success"
                className="login-button"
                onClick={() => {
                  setError('');
                  setSuccess('');
                  setEmail('');
                  setPassword('');
                  setScreen('signup');
                }}
              >
                Don't have an account? Sign up
              </Button>
            </Stack>
          </Container>
        </main>
      </div>
    );
  }

  // ---------------- SIGNUP SCREEN ----------------

  return (
    <div className="app-shell">
      <NavbarSection />

      <div className="blue-shape" />

      <main className="signup-area">
        <Container className="d-flex justify-content-center align-items-center h-100">
          <Stack className="signup-stack" gap={2}>
            <Card className="signup-card">
              <Card.Body>
                <h1 className="signup-title">SignUp</h1>

                {error && (
                  <Alert
                    variant="danger"
                    className="message"
                  >
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert
                    variant="success"
                    className="message"
                  >
                    {success}
                  </Alert>
                )}

                <Form onSubmit={handleSignup} noValidate>
                  <Form.Group
                    className="mb-2"
                    controlId="signupEmail"
                  >
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      autoComplete="email"
                      required
                      disabled={loading}
                    />
                  </Form.Group>

                  <Form.Group
                    className="mb-2"
                    controlId="signupPassword"
                  >
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      autoComplete="new-password"
                      minLength={6}
                      required
                      disabled={loading}
                    />
                  </Form.Group>

                  <Form.Group
                    className="mb-3"
                    controlId="signupConfirmPassword"
                  >
                    <Form.Control
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      autoComplete="new-password"
                      minLength={6}
                      required
                      disabled={loading}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="signup-button"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          size="sm"
                          className="me-2"
                        />
                        Signing up...
                      </>
                    ) : (
                      'Sign up'
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            <Button
              variant="outline-success"
              className="login-button"
              onClick={() => {
                setError('');
                setSuccess('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setScreen('login');
              }}
            >
              Have an account? Login
            </Button>
          </Stack>
        </Container>
      </main>
    </div>
  );
}

export default App;