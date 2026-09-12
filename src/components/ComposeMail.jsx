import React, { useState } from 'react';

import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
} from 'react-bootstrap';

import TextEditor from './TextEditor';
import { sendMail } from '../services/mailService';

const ComposeMail = ({ onClose }) => {

  const [receiverEmail, setReceiverEmail] =
    useState('');

  const [subject, setSubject] =
    useState('');

  const [message, setMessage] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState('');

  const [error, setError] =
    useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess('');
    setError('');

    if (!receiverEmail.trim()) {
      setError('Please enter receiver email.');
      return;
    }

    if (!subject.trim()) {
      setError('Please enter subject.');
      return;
    }

    if (!message) {
      setError('Please enter your message.');
      return;
    }

    try {
      setLoading(true);

      await sendMail({
        receiverEmail: receiverEmail.trim(),
        subject: subject.trim(),
        message,
      });

      setSuccess('Mail sent successfully.');

      setReceiverEmail('');
      setSubject('');
      setMessage(null);

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
        'Failed to send mail.'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="compose-container"
    >

      <Row className="justify-content-center">

        <Col md={10} lg={8}>

          <Card className="compose-card">

            <Card.Header className="compose-header">

              <h5 className="mb-0">
                New Message
              </h5>

              {onClose && (
                <Button
                  variant="light"
                  size="sm"
                  onClick={onClose}
                >
                  ✕
                </Button>
              )}

            </Card.Header>

            <Card.Body>

              {success && (
                <div className="alert alert-success">
                  {success}
                </div>
              )}

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <Form onSubmit={handleSubmit}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    To
                  </Form.Label>
<Form.Control
  type="email"
  placeholder="Enter receiver email"
  value={receiverEmail}
  onChange={(e) =>
    setReceiverEmail(e.target.value)
  }
/>npx vitest run
                </Form.Group>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Subject
                  </Form.Label>

                 <Form.Control
  type="text"
  placeholder="Subject"
  value={subject}
  onChange={(e) =>
    setSubject(e.target.value)
  }
/>

                </Form.Group>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Message
                  </Form.Label>

                  <TextEditor
                    onChange={setMessage}
                  />

                </Form.Group>

                <div className="compose-footer">

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send'}
                  </Button>

                </div>

              </Form>

            </Card.Body>

          </Card>

        </Col>

      </Row>

    </Container>
  );
};

export default ComposeMail;