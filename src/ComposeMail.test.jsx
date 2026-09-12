import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import ComposeMail from './components/ComposeMail';

const sendMailMock = vi.fn();

vi.mock('./services/mailService', () => ({
  sendMail: (...args) => sendMailMock(...args),
}));

vi.mock('./components/TextEditor', () => ({
  default: ({ onChange }) => (
    <textarea
      placeholder="Message"
      onChange={(e) =>
        onChange({
          blocks: [
            {
              text: e.target.value,
            },
          ],
          entityMap: {},
        })
      }
    />
  ),
}));

describe('ComposeMail Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display compose mail form', () => {
    render(<ComposeMail />);

    expect(
      screen.getByText('New Message')
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText('Enter receiver email')
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText('Subject')
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText('Message')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Send',
      })
    ).toBeInTheDocument();
  });

  it('should show error when receiver email is empty', async () => {
    render(<ComposeMail />);

    fireEvent.change(
      screen.getByPlaceholderText('Subject'),
      {
        target: {
          value: 'Test Subject',
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText('Message'),
      {
        target: {
          value: 'Hello',
        },
      }
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Send',
      })
    );

    expect(
      await screen.findByText(
        'Please enter receiver email.'
      )
    ).toBeInTheDocument();

    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it('should show error when subject is empty', async () => {
    render(<ComposeMail />);

    fireEvent.change(
      screen.getByPlaceholderText(
        'Enter receiver email'
      ),
      {
        target: {
          value: 'receiver@example.com',
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText('Message'),
      {
        target: {
          value: 'Hello',
        },
      }
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Send',
      })
    );

    expect(
      await screen.findByText(
        'Please enter subject.'
      )
    ).toBeInTheDocument();

    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it('should show error when message is empty', async () => {
    render(<ComposeMail />);

    fireEvent.change(
      screen.getByPlaceholderText(
        'Enter receiver email'
      ),
      {
        target: {
          value: 'receiver@example.com',
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText('Subject'),
      {
        target: {
          value: 'Test Subject',
        },
      }
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Send',
      })
    );

    expect(
      await screen.findByText(
        'Please enter your message.'
      )
    ).toBeInTheDocument();

    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it('should send mail successfully with valid data', async () => {
    sendMailMock.mockResolvedValue({
      success: true,
    });

    render(<ComposeMail />);

    fireEvent.change(
      screen.getByPlaceholderText(
        'Enter receiver email'
      ),
      {
        target: {
          value: 'receiver@example.com',
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText('Subject'),
      {
        target: {
          value: 'Hello',
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText('Message'),
      {
        target: {
          value: 'Hello, this is a test mail.',
        },
      }
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Send',
      })
    );

    await waitFor(() => {
      expect(sendMailMock).toHaveBeenCalledWith({
        receiverEmail: 'receiver@example.com',
        subject: 'Hello',
        message: {
          blocks: [
            {
              text: 'Hello, this is a test mail.',
            },
          ],
          entityMap: {},
        },
      });
    });

    expect(
      await screen.findByText(
        'Mail sent successfully.'
      )
    ).toBeInTheDocument();
  });

  it('should show error when sending mail fails', async () => {
    sendMailMock.mockRejectedValue(
      new Error('Failed to send mail.')
    );

    render(<ComposeMail />);

    fireEvent.change(
      screen.getByPlaceholderText(
        'Enter receiver email'
      ),
      {
        target: {
          value: 'receiver@example.com',
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText('Subject'),
      {
        target: {
          value: 'Hello',
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText('Message'),
      {
        target: {
          value: 'Test message',
        },
      }
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Send',
      })
    );

    expect(
      await screen.findByText(
        'Failed to send mail.'
      )
    ).toBeInTheDocument();
  });
});