import { getIdToken } from 'firebase/auth';
import { auth } from '../firebase';

const getEmailKey = (email) => {
  return btoa(email.trim().toLowerCase())
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

// Send Mail
export const sendMail = async ({
  receiverEmail,
  subject,
  message,
}) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not logged in.');
  }

  const token = await getIdToken(user);

  const senderEmail = user.email.trim().toLowerCase();
  const receiver = receiverEmail.trim().toLowerCase();

  const mail = {
    senderEmail,
    receiverEmail: receiver,
    subject: subject.trim(),
    message,
    read: false,
    createdAt: new Date().toISOString(),
  };

  const databaseUrl = import.meta.env.VITE_FIREBASE_DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('Firebase database URL is missing.');
  }

  // Save in receiver inbox
  const receiverKey = getEmailKey(receiver);

  const inboxUrl =
    `${databaseUrl}/mailboxes/${receiverKey}/inbox.json?auth=${token}`;

  const inboxResponse = await fetch(inboxUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mail),
  });

  if (!inboxResponse.ok) {
    const errorText = await inboxResponse.text();

    throw new Error(
      `Receiver inbox error: ${inboxResponse.status} ${errorText}`
    );
  }

  // Save in sender sentbox
  const senderKey = getEmailKey(senderEmail);

  const sentUrl =
    `${databaseUrl}/mailboxes/${senderKey}/sent.json?auth=${token}`;

  const sentResponse = await fetch(sentUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mail),
  });

  if (!sentResponse.ok) {
    const errorText = await sentResponse.text();

    throw new Error(
      `Sentbox error: ${sentResponse.status} ${errorText}`
    );
  }

  return { success: true };
};


// Get Inbox Mails
export const getInboxMails = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not logged in.');
  }

  const token = await getIdToken(user);

  const databaseUrl = import.meta.env.VITE_FIREBASE_DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('Firebase database URL is missing.');
  }

  const emailKey = getEmailKey(user.email);

  const inboxUrl =
    `${databaseUrl}/mailboxes/${emailKey}/inbox.json?auth=${token}`;

  const response = await fetch(inboxUrl);

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Failed to fetch inbox: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();

  if (!data) {
    return [];
  }

  const mails = Object.entries(data).map(
    ([id, mail]) => ({
      id,
      ...mail,
    })
  );

  mails.sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  );

  return mails;
};


// Mark Mail As Read
export const markMailAsRead = async (mailId) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not logged in.');
  }

  const token = await getIdToken(user);

  const databaseUrl = import.meta.env.VITE_FIREBASE_DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('Firebase database URL is missing.');
  }

  const emailKey = getEmailKey(user.email);

  const mailUrl =
    `${databaseUrl}/mailboxes/${emailKey}/inbox/${mailId}.json?auth=${token}`;

  const response = await fetch(mailUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      read: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Failed to mark mail as read: ${response.status} ${errorText}`
    );
  }

  return true;
};