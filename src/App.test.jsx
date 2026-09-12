import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import App from './App';

const signInMock = vi.fn();
const getIdTokenMock = vi.fn();
const signOutMock = vi.fn();

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: (...args) => signInMock(...args),
  getIdToken: (...args) => getIdTokenMock(...args),
  signOut: (...args) => signOutMock(...args),
}));

vi.mock('./firebase', () => ({
  auth: {},
}));

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // Test Case 1
  it('should display the login screen', () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole('button', {
        name: /have an account\? login/i,
      })
    );

    expect(
      screen.getByRole('heading', { name: 'Login' })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText('Email')
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText('Password')
    ).toBeInTheDocument();
  });

  // Test Case 2
  it('should show error when login fields are empty', () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole('button', {
        name: /have an account\? login/i,
      })
    );

    const form = screen
      .getByPlaceholderText('Email')
      .closest('form');

    fireEvent.submit(form);

    expect(
      screen.getByText('Please enter email and password.')
    ).toBeInTheDocument();

    expect(signInMock).not.toHaveBeenCalled();
  });

  // Test Case 3
  it('should show error for wrong credentials', async () => {
    signInMock.mockRejectedValue({
      code: 'auth/invalid-credential',
    });

    vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<App />);

    fireEvent.click(
      screen.getByRole('button', {
        name: /have an account\? login/i,
      })
    );

    fireEvent.change(
      screen.getByPlaceholderText('Email'),
      {
        target: { value: 'wrong@example.com' },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText('Password'),
      {
        target: { value: 'wrongpassword' },
      }
    );

    const form = screen
      .getByPlaceholderText('Email')
      .closest('form');

    fireEvent.submit(form);

    await waitFor(() => {
      expect(
        screen.getByText('Invalid email or password.')
      ).toBeInTheDocument();
    });

    expect(window.alert).toHaveBeenCalledWith(
      'Invalid email or password.'
    );
  });

  // Test Case 4
  it('should login successfully with valid credentials', async () => {
    const mockUser = {
      uid: 'test-user-id',
      email: 'test@example.com',
    };

    signInMock.mockResolvedValue({
      user: mockUser,
    });

    getIdTokenMock.mockResolvedValue(
      'test-firebase-token'
    );

    render(<App />);

    fireEvent.click(
      screen.getByRole('button', {
        name: /have an account\? login/i,
      })
    );

    fireEvent.change(
      screen.getByPlaceholderText('Email'),
      {
        target: { value: 'test@example.com' },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText('Password'),
      {
        target: { value: 'password123' },
      }
    );

    const form = screen
      .getByPlaceholderText('Email')
      .closest('form');

    fireEvent.submit(form);

    expect(
      await screen.findByText(
        'Welcome to your mail box'
      )
    ).toBeInTheDocument();

    expect(signInMock).toHaveBeenCalled();
  });

  // Test Case 5
  it('should store Firebase ID token after successful login', async () => {
    const mockUser = {
      uid: 'test-user-id',
      email: 'test@example.com',
    };

    signInMock.mockResolvedValue({
      user: mockUser,
    });

    getIdTokenMock.mockResolvedValue(
      'test-firebase-token'
    );

    render(<App />);

    fireEvent.click(
      screen.getByRole('button', {
        name: /have an account\? login/i,
      })
    );

    fireEvent.change(
      screen.getByPlaceholderText('Email'),
      {
        target: { value: 'test@example.com' },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText('Password'),
      {
        target: { value: 'password123' },
      }
    );

    const form = screen
      .getByPlaceholderText('Email')
      .closest('form');

    fireEvent.submit(form);

    await waitFor(() => {
      expect(
        localStorage.getItem('idToken')
      ).toBe('test-firebase-token');
    });
  });
});