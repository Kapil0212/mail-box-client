import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  ListGroup,
  Spinner,
  Alert,
} from 'react-bootstrap';

import { getInboxMails } from '../services/mailService';
import ComposeMail from './ComposeMail';

const Inbox = () => {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCompose, setShowCompose] = useState(false);

  const loadInbox = async () => {
    try {
      setLoading(true);
      setError('');

      const inboxMails = await getInboxMails();

      setMails(inboxMails);
    } catch (err) {
      console.error('Inbox error:', err);

      setError(
        err.message || 'Unable to load inbox.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInbox();
  }, []);

  const formatDate = (date) => {
    if (!date) {
      return '';
    }

    const mailDate = new Date(date);

    if (Number.isNaN(mailDate.getTime())) {
      return '';
    }

    return mailDate.toLocaleString();
  };

  const getMessagePreview = (message) => {
    if (!message) {
      return '';
    }

    // Draft.js raw content
    if (typeof message === 'object') {
      if (Array.isArray(message.blocks)) {
        return message.blocks
          .map((block) => block.text || '')
          .join(' ')
          .trim();
      }

      return '';
    }

    return String(message);
  };

  if (showCompose) {
    return (
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col md={10} lg={9}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">Compose Mail</h4>

              <Button
                variant="outline-secondary"
                onClick={() => setShowCompose(false)}
              >
                Back to Inbox
              </Button>
            </div>

            <ComposeMail />
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h3 className="mb-1">Inbox</h3>

              <small className="text-muted">
                Received mails
              </small>
            </div>

            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                onClick={loadInbox}
                disabled={loading}
              >
                Refresh
              </Button>

              <Button
                variant="primary"
                onClick={() => setShowCompose(true)}
              >
                Compose
              </Button>
            </div>
          </div>

          {error && (
            <Alert
              variant="danger"
              className="mb-3"
            >
              {error}
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />

              <div className="mt-2">
                Loading inbox...
              </div>
            </div>
          ) : mails.length === 0 ? (
            <div className="text-center py-5 border rounded bg-light">
              <h5>No mails found</h5>

              <p className="text-muted mb-3">
                Your inbox is empty.
              </p>

              <Button
                variant="primary"
                onClick={() => setShowCompose(true)}
              >
                Compose Mail
              </Button>
            </div>
          ) : (
            <ListGroup>
              {mails.map((mail) => (
                <ListGroup.Item
                  key={mail.id}
                  className="py-3"
                >
                  <Row className="align-items-center">
                    <Col
                      xs={12}
                      md={3}
                      className="fw-semibold"
                    >
                      {mail.senderEmail}
                    </Col>

                    <Col
                      xs={12}
                      md={3}
                      className="fw-semibold"
                    >
                      {mail.subject || '(No subject)'}
                    </Col>

                    <Col
                      xs={12}
                      md={4}
                      className="text-muted"
                    >
                      {getMessagePreview(
                        mail.message
                      )}
                    </Col>

                    <Col
                      xs={12}
                      md={2}
                      className="text-muted small text-md-end"
                    >
                      {formatDate(
                        mail.createdAt
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Inbox;