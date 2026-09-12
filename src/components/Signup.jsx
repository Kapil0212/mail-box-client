import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';

const firebaseErrors = {
  'auth/email-already-in-use':
    'An account already exists with this email address.',

  'auth/invalid-email':
    'Please enter a valid email address.',

  'auth/weak-password':
    'Password should be at least 6 characters long.',

  'auth/network-request-failed':
    'Network error. Please check your internet connection.',

  'auth/operation-not-allowed':
    'Email/password authentication is not enabled in Firebase.',
};

const Signup = ({ setScreen }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!email.trim() || !password || !confirmPassword) {
      setError('Please fill all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      console.log('User has successfully signed up.');

      await signOut(auth);

      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setSuccess('Account created successfully.');

      setTimeout(() => {
        setScreen('login');
      }, 1200);

    } catch (err) {
      console.error(err);

      setError(
        firebaseErrors[err.code] ||
        'Unable to create account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-area">

      <Card className="auth-card">
        <Card.Body>

          <h2 className="auth-title">SignUp</h2>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          <Form onSubmit={handleSignup}>

            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />
            </Form.Group>

            <Button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </Button>

          </Form>

          <Button
            variant="outline-success"
            className="switch-button"
            onClick={() => setScreen('login')}
          >
            Have an account? Login
          </Button>

        </Card.Body>
      </Card>

    </div>
  );
};

export default Signup;