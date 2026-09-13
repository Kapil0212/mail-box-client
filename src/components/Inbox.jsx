import React, { useEffect, useReducer, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  ListGroup,
  Spinner,
  Alert,
} from 'react-bootstrap';

import {
  getInboxMails,
  markMailAsRead,
  deleteMail,
} from '../services/mailService';

import ComposeMail from './ComposeMail';

const initialState = {
  mails: [],
  loading: true,
  error: '',
};

const inboxReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        loading: true,
        error: '',
      };

    case 'FETCH_SUCCESS':
      return {
        ...state,
        mails: action.payload,
        loading: false,
        error: '',
      };

    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'MARK_AS_READ':
      return {
        ...state,
        mails: state.mails.map((mail) =>
          mail.id === action.payload
            ? {
                ...mail,
                read: true,
              }
            : mail
        ),
      };

    case 'DELETE_MAIL':
      return {
        ...state,
        mails: state.mails.filter(
          (mail) => mail.id !== action.payload
        ),
      };

    default:
      return state;
  }
};

const Inbox = ({ onUnreadCountChange }) => {
  const [state, dispatch] = useReducer(
    inboxReducer,
    initialState
  );

  const [selectedMail, setSelectedMail] = useState(null);
  const [showCompose, setShowCompose] = useState(false);

  const loadInbox = async () => {
    try {
      dispatch({
        type: 'FETCH_START',
      });

      const inboxMails = await getInboxMails();

      dispatch({
        type: 'FETCH_SUCCESS',
        payload: inboxMails,
      });
    } catch (error) {
      console.error('Inbox error:', error);

      dispatch({
        type: 'FETCH_ERROR',
        payload:
          error.message || 'Unable to load inbox.',
      });
    }
  };

  useEffect(() => {
    loadInbox();
  }, []);

  const unreadCount = state.mails.filter(
    (mail) => mail.read !== true
  ).length;

  useEffect(() => {
    if (onUnreadCountChange) {
      onUnreadCountChange(unreadCount);
    }
  }, [unreadCount, onUnreadCountChange]);

  const getMessagePreview = (message) => {
    if (!message) return '';

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
    if (!message) return '';

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
    if (!date) return '';

    const mailDate = new Date(date);

    if (Number.isNaN(mailDate.getTime())) {
      return '';
    }

    return mailDate.toLocaleString();
  };

  const handleMailClick = async (mail) => {
    setSelectedMail(mail);

    if (mail.read === true) {
      return;
    }

    try {
      await markMailAsRead(mail.id);

      dispatch({
        type: 'MARK_AS_READ',
        payload: mail.id,
      });
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

      dispatch({
        type: 'DELETE_MAIL',
        payload: mailId,
      });

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

      dispatch({
        type: 'FETCH_ERROR',
        payload:
          error.message ||
          'Unable to delete mail.',
      });
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
                Back to Inbox
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
                ← Back to Inbox
              </Button>

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
                Inbox
              </h3>

              <small className="text-muted">
                {unreadCount} unread message
                {unreadCount !== 1
                  ? 's'
                  : ''}
              </small>
            </div>

            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                onClick={loadInbox}
                disabled={state.loading}
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

          {state.error && (
            <Alert variant="danger">
              {state.error}
            </Alert>
          )}

          {state.loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />

              <div className="mt-2">
                Loading inbox...
              </div>
            </div>
          ) : state.mails.length === 0 ? (
            <div className="text-center py-5 border rounded bg-light">
              <h5>
                No mails found
              </h5>

              <p className="text-muted mb-3">
                Your inbox is empty.
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
              {state.mails.map((mail) => (
                <ListGroup.Item
                  key={mail.id}
                  className="py-3"
                >
                  <Row className="align-items-center">

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

                    <Col
                      xs={11}
                      md={3}
                      className={
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
                      {mail.senderEmail}
                    </Col>

                    <Col
                      xs={12}
                      md={3}
                      className={
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