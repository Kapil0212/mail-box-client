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

import useMails from '../hooks/useMails';

import ComposeMail from './ComposeMail';

const Inbox = ({
  mailboxType = 'inbox',
  onUnreadCountChange,
}) => {
  const {
    mails,
    loading,
    error,
    fetchMails,
    markAsRead,
    deleteMail,
  } = useMails(mailboxType);

  const [selectedMail, setSelectedMail] =
    useState(null);

  const [showCompose, setShowCompose] =
    useState(false);

  const isSentBox = mailboxType === 'sent';

  const unreadCount = isSentBox
    ? 0
    : mails.filter(
        (mail) => mail.read !== true
      ).length;

  useEffect(() => {
    if (
      onUnreadCountChange &&
      !isSentBox
    ) {
      onUnreadCountChange(unreadCount);
    }
  }, [
    unreadCount,
    onUnreadCountChange,
    isSentBox,
  ]);

  const getMessagePreview = (message) => {
    if (!message) {
      return '';
    }

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

  const getFullMessage = (message) => {
    if (!message) {
      return '';
    }

    if (typeof message === 'object') {
      if (Array.isArray(message.blocks)) {
        return message.blocks
          .map((block) => block.text || '')
          .join('\n')
          .trim();
      }

      return '';
    }

    return String(message);
  };

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

  const handleMailClick = async (mail) => {
    setSelectedMail(mail);

    if (
      isSentBox ||
      mail.read === true
    ) {
      return;
    }

    try {
      await markAsRead(mail.id);

      setSelectedMail((previousMail) =>
        previousMail
          ? {
              ...previousMail,
              read: true,
            }
          : previousMail
      );
    } catch (error) {
      console.error(
        'Failed to mark mail as read:',
        error
      );
    }
  };

  const handleDeleteMail = async (mailId) => {
    try {
      await deleteMail(mailId);

      if (
        selectedMail &&
        selectedMail.id === mailId
      ) {
        setSelectedMail(null);
      }
    } catch (error) {
      console.error(
        'Delete mail error:',
        error
      );
    }
  };

  if (showCompose) {
    return (
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col md={10} lg={9}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">
                Compose Mail
              </h4>

              <Button
                variant="outline-secondary"
                onClick={() =>
                  setShowCompose(false)
                }
              >
                Back to Mailbox
              </Button>
            </div>

            <ComposeMail />
          </Col>
        </Row>
      </Container>
    );
  }

  if (selectedMail) {
    return (
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col md={10} lg={9}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Button
                variant="outline-secondary"
                onClick={() =>
                  setSelectedMail(null)
                }
              >
                ← Back to{' '}
                {isSentBox
                  ? 'Sent'
                  : 'Inbox'}
              </Button>

              {!isSentBox && (
                <Button
                  variant="danger"
                  onClick={() =>
                    handleDeleteMail(
                      selectedMail.id
                    )
                  }
                >
                  Delete
                </Button>
              )}
            </div>

            <div className="border rounded bg-white p-4">
              <h4 className="mb-3">
                {selectedMail.subject ||
                  '(No subject)'}
              </h4>

              <hr />

              <div className="mb-3">
                <strong>From:</strong>{' '}
                {selectedMail.senderEmail}
              </div>

              <div className="mb-3">
                <strong>To:</strong>{' '}
                {selectedMail.receiverEmail}
              </div>

              <div className="text-muted small mb-4">
                {formatDate(
                  selectedMail.createdAt
                )}
              </div>

              <div
                style={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.7',
                }}
              >
                {getFullMessage(
                  selectedMail.message
                )}
              </div>
            </div>
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
              <h3 className="mb-1">
                {isSentBox
                  ? 'Sent Mail'
                  : 'Inbox'}
              </h3>

              {!isSentBox && (
                <small className="text-muted">
                  {unreadCount} unread message
                  {unreadCount !== 1
                    ? 's'
                    : ''}
                </small>
              )}
            </div>

            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                onClick={fetchMails}
                disabled={loading}
              >
                Refresh
              </Button>

              <Button
                variant="primary"
                onClick={() =>
                  setShowCompose(true)
                }
              >
                Compose
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />

              <div className="mt-2">
                Loading{' '}
                {isSentBox
                  ? 'sent mails'
                  : 'inbox'}
                ...
              </div>
            </div>
          ) : mails.length === 0 ? (
            <div className="text-center py-5 border rounded bg-light">
              <h5>
                No mails found
              </h5>

              <p className="text-muted mb-3">
                {isSentBox
                  ? 'You have not sent any mails yet.'
                  : 'Your inbox is empty.'}
              </p>

              <Button
                variant="primary"
                onClick={() =>
                  setShowCompose(true)
                }
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
                    {!isSentBox && (
                      <Col xs={1} md={1}>
                        {mail.read !== true && (
                          <span
                            style={{
                              display:
                                'inline-block',
                              width: '10px',
                              height: '10px',
                              borderRadius:
                                '50%',
                              backgroundColor:
                                '#0d6efd',
                            }}
                          />
                        )}
                      </Col>
                    )}

                    <Col
                      xs={
                        isSentBox
                          ? 12
                          : 11
                      }
                      md={
                        isSentBox
                          ? 4
                          : 3
                      }
                      className={
                        !isSentBox &&
                        mail.read !== true
                          ? 'fw-bold'
                          : ''
                      }
                      onClick={() =>
                        handleMailClick(mail)
                      }
                      style={{
                        cursor: 'pointer',
                      }}
                    >
                      {isSentBox
                        ? `To: ${mail.receiverEmail}`
                        : mail.senderEmail}
                    </Col>

                    <Col
                      xs={12}
                      md={3}
                      className={
                        !isSentBox &&
                        mail.read !== true
                          ? 'fw-bold'
                          : ''
                      }
                      onClick={() =>
                        handleMailClick(mail)
                      }
                      style={{
                        cursor: 'pointer',
                      }}
                    >
                      {mail.subject ||
                        '(No subject)'}
                    </Col>

                    <Col
                      xs={12}
                      md={3}
                      className="text-muted text-truncate"
                      onClick={() =>
                        handleMailClick(mail)
                      }
                      style={{
                        cursor: 'pointer',
                      }}
                    >
                      {getMessagePreview(
                        mail.message
                      )}
                    </Col>

                    <Col
                      xs={12}
                      md={1}
                      className="text-muted small"
                    >
                      {formatDate(
                        mail.createdAt
                      )}
                    </Col>

                    {!isSentBox && (
                      <Col
                        xs={12}
                        md={1}
                        className="text-md-end mt-2 mt-md-0"
                      >
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() =>
                            handleDeleteMail(
                              mail.id
                            )
                          }
                        >
                          Delete
                        </Button>
                      </Col>
                    )}
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