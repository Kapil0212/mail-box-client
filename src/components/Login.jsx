import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

import {
  signInWithEmailAndPassword,
  getIdToken,
} from 'firebase/auth';

import { auth } from '../firebase';

const firebaseErrors = {
  'auth/invalid-credential':
    'Invalid email or password.',

  'auth/user-not-found':
    'Invalid email or password.',

  'auth/wrong-password':
    'Invalid email or password.',

  'auth/invalid-email':
    'Please enter a valid email address.',

  'auth/network-request-failed':
    'Network error. Please check your internet connection.',
};

const Login = ({ setScreen }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError('');

    if (!email.trim() || !password) {
      setError('Please enter email and password.');
      return;
    }

    try {
      setLoading(true);

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      const token = await getIdToken(
        userCredential.user
      );

      localStorage.setItem('idToken', token);

      setEmail('');
      setPassword('');

      setScreen('welcome');

    } catch (err) {
      console.error(err);

      const message =
        firebaseErrors[err.code] ||
        'Invalid email or password.';

      alert(message);
      setError(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-area">

      <Card className="auth-card login-card">
        <Card.Body>

          <h2 className="auth-title">Login</h2>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <Form onSubmit={handleLogin}>

            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </Form.Group>

            <div className="forgot-password">
              <a href="#forgot">Forgot Password?</a>
            </div>

            <Button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>

          </Form>

          <Button
            variant="outline-success"
            className="switch-button"
            onClick={() => setScreen('signup')}
          >
            Don't have an account? Sign up
          </Button>

        </Card.Body>
      </Card>

    </div>
  );
};

export default Login;