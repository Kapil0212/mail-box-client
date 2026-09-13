import { useCallback, useEffect, useRef, useState } from 'react';

import {
  getInboxMails,
  getSentMails,
  sendMail,
  markMailAsRead,
  deleteMail,
} from '../services/mailService';

const useMails = (mailboxType = 'inbox') => {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isSentBox = mailboxType === 'sent';

  const isFetchingRef = useRef(false);

  const fetchMails = useCallback(async () => {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;

    try {
      const data = isSentBox
        ? await getSentMails()
        : await getInboxMails();

      setMails((previousMails) => {
        if (
          previousMails.length === data.length &&
          previousMails.every((oldMail, index) => {
            const newMail = data[index];

            return (
              oldMail.id === newMail.id &&
              oldMail.read === newMail.read
            );
          })
        ) {
          return previousMails;
        }

        return data;
      });

      setError('');
      setLoading(false);
    } catch (err) {
      console.error('Mailbox error:', err);

      setError(
        err.message || 'Unable to load mails.'
      );

      setLoading(false);
    } finally {
      isFetchingRef.current = false;
    }
  }, [isSentBox]);

  useEffect(() => {
    setLoading(true);
    setError('');
    setMails([]);

    fetchMails();

    const interval = setInterval(() => {
      fetchMails();
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchMails]);

  const sendMailFromHook = useCallback(
    async ({
      receiverEmail,
      subject,
      message,
    }) => {
      return await sendMail({
        receiverEmail,
        subject,
        message,
      });
    },
    []
  );

  const markAsRead = useCallback(async (mailId) => {
    await markMailAsRead(mailId);

    setMails((previousMails) =>
      previousMails.map((mail) =>
        mail.id === mailId
          ? {
              ...mail,
              read: true,
            }
          : mail
      )
    );
  }, []);

  const deleteMailFromHook = useCallback(
    async (mailId) => {
      await deleteMail(mailId);

      setMails((previousMails) =>
        previousMails.filter(
          (mail) => mail.id !== mailId
        )
      );
    },
    []
  );

  return {
    mails,
    loading,
    error,
    fetchMails,
    sendMail: sendMailFromHook,
    markAsRead,
    deleteMail: deleteMailFromHook,
  };
};

export default useMails;