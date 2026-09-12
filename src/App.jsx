import { useState } from 'react';
import { Alert, Button, Card, Container, Form, Nav, Navbar, Spinner, Stack } from 'react-bootstrap';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase';

const firebaseErrors = {
  'auth/email-already-in-use': 'An account already exists with this email address.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/weak-password': 'Password should be at least 6 characters long.',
  'auth/network-request-failed': 'Network error. Please check your internet connection.',
  'auth/operation-not-allowed': 'Email/password sign-up is not enabled in Firebase Authentication.',
};

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
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
      await createUserWithEmailAndPassword(auth, cleanEmail, password);
      console.log('User has successfully signed up.');
      await signOut(auth);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setSuccess('Account created successfully. You can now login.');
    } catch (firebaseError) {
      console.error('Signup error:', firebaseError);
      setError(firebaseErrors[firebaseError.code] || 'Unable to create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Navbar className="top-navbar" expand="md">
        <Container fluid className="px-4 px-md-5">
          <Navbar.Brand href="#" className="brand">
            <span className="brand-mark" aria-hidden="true">
              <span className="brand-mark-inner" />
            </span>
            <span>Mailbox Client</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="ms-md-4 gap-md-2">
              <Nav.Link href="#">Home</Nav.Link>
              <Nav.Link href="#">Inbox</Nav.Link>
              <Nav.Link href="#">About Us</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="blue-shape" aria-hidden="true" />

      <main className="signup-area">
        <Container className="d-flex justify-content-center align-items-center h-100">
          <Stack className="signup-stack" gap={2}>
            <Card className="signup-card">
              <Card.Body>
                <h1 className="signup-title">SignUp</h1>

                {error && <Alert variant="danger" className="message">{error}</Alert>}
                {success && <Alert variant="success" className="message">{success}</Alert>}

                <Form onSubmit={handleSubmit} noValidate>
                  <Form.Group className="mb-2" controlId="signupEmail">
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                      required
                      disabled={loading}
                    />
                  </Form.Group>

                  <Form.Group className="mb-2" controlId="signupPassword">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="new-password"
                      minLength={6}
                      required
                      disabled={loading}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="signupConfirmPassword">
                    <Form.Control
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      autoComplete="new-password"
                      minLength={6}
                      required
                      disabled={loading}
                    />
                  </Form.Group>

                  <Button type="submit" className="signup-button" disabled={loading}>
                    {loading ? <><Spinner size="sm" className="me-2" /> Signing up...</> : 'Sign up'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            <Button variant="outline-success" className="login-button" href="#login">
              Have an account? Login
            </Button>
          </Stack>
        </Container>
      </main>
    </div>
  );
}

export default App;
