import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import App from './App';

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('./firebase', () => ({
  auth: {},
}));

import { createUserWithEmailAndPassword } from 'firebase/auth';

describe('Signup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test Case 1
  it('should display the signup form', () => {
    render(<App />);

    expect(screen.getByText('SignUp')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Confirm Password')
    ).toBeInTheDocument();
  });

  // Test Case 2
  it('should show an error when fields are empty', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Sign up' }));

    expect(
      screen.getByText('Please fill in all fields.')
    ).toBeInTheDocument();
  });

  // Test Case 3
  it('should show an error when passwords do not match', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(
      screen.getByPlaceholderText('Email'),
      'test@example.com'
    );

    await user.type(
      screen.getByPlaceholderText('Password'),
      'password123'
    );

    await user.type(
      screen.getByPlaceholderText('Confirm Password'),
      'password456'
    );

    await user.click(screen.getByRole('button', { name: 'Sign up' }));

    expect(
      screen.getByText('Passwords do not match.')
    ).toBeInTheDocument();
  });

  // Test Case 4
  it('should successfully create an account with valid details', async () => {
    const user = userEvent.setup();

    createUserWithEmailAndPassword.mockResolvedValue({
      user: {
        uid: 'test-user-id',
      },
    });

    render(<App />);

    await user.type(
      screen.getByPlaceholderText('Email'),
      'test@example.com'
    );

    await user.type(
      screen.getByPlaceholderText('Password'),
      'password123'
    );

    await user.type(
      screen.getByPlaceholderText('Confirm Password'),
      'password123'
    );

    await user.click(screen.getByRole('button', { name: 'Sign up' }));

    expect(createUserWithEmailAndPassword).toHaveBeenCalled();
  });

  // Test Case 5
  it('should display Firebase error when email already exists', async () => {
    const user = userEvent.setup();

    createUserWithEmailAndPassword.mockRejectedValue({
      code: 'auth/email-already-in-use',
    });

    render(<App />);

    await user.type(
      screen.getByPlaceholderText('Email'),
      'existing@example.com'
    );

    await user.type(
      screen.getByPlaceholderText('Password'),
      'password123'
    );

    await user.type(
      screen.getByPlaceholderText('Confirm Password'),
      'password123'
    );

    await user.click(screen.getByRole('button', { name: 'Sign up' }));

    expect(
      await screen.findByText(
        'An account already exists with this email address.'
      )
    ).toBeInTheDocument();
  });
});