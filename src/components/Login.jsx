import React, { useState } from 'react';

import {
  signInWithEmailAndPassword,
  getIdToken,
} from 'firebase/auth';

import { auth } from '../firebase';

import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from 'react-bootstrap';

const Login = ({ setScreen }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password.');
      return;
    }

    try {
      setLoading(true);

      const result =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      const token =
        await getIdToken(result.user);

      localStorage.setItem('idToken', token);

      setScreen('welcome');

    } catch (err) {
      console.error(err);

      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/user-not-found'
      ) {
        setError('Invalid email or password.');

        window.alert(
          'Invalid email or password.'
        );
      } else {
        setError(
          err.message ||
          'Login failed. Please try again.'
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-header">

          <div className="auth-icon">
            📧
          </div>

          <h2>Login</h2>

          <p>
            Login to access your mailbox
          </p>

        </div>

        {error && (
          <Alert
            variant="danger"
            className="auth-alert"
          >
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>

          <Form.Group className="mb-3">

            <Form.Label>
              Email
            </Form.Label>

            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </Form.Group>


          <Form.Group className="mb-3">

            <Form.Label>
              Password
            </Form.Label>

            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </Form.Group>


          <Button
            type="submit"
            variant="primary"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? 'Logging in...'
              : 'Login'}
          </Button>

        </Form>


        <div className="auth-link">

          <span>
            Don't have an account?{' '}
          </span>

          <button
            type="button"
            onClick={() =>
              setScreen('signup')
            }
          >
            Create Account
          </button>

        </div>


        <div className="auth-link">

          <button
            type="button"
            onClick={() =>
              setScreen('signup')
            }
          >
            ← Back to Signup
          </button>

        </div>

      </div>

    </div>
  );
};

export default Login;