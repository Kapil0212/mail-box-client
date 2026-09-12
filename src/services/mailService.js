import { getIdToken } from 'firebase/auth';
import { auth } from '../firebase';

const getEmailKey = (email) => {
  return btoa(email.trim().toLowerCase())
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

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

  const senderEmail = user.email
    .trim()
    .toLowerCase();

  const receiver = receiverEmail
    .trim()
    .toLowerCase();

  const mail = {
    senderEmail,
    receiverEmail: receiver,
    subject: subject.trim(),
    message,
    createdAt: new Date().toISOString(),
  };

  const databaseUrl =
    import.meta.env.VITE_FIREBASE_DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      'Firebase database URL is missing.'
    );
  }

  const emailKey = getEmailKey(receiver);

  const inboxUrl =
    `${databaseUrl}/mailboxes/${emailKey}/inbox.json?auth=${token}`;

  console.log('Saving mail to:', inboxUrl);

  const inboxResponse = await fetch(
    inboxUrl,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mail),
    }
  );

  if (!inboxResponse.ok) {
    const errorText =
      await inboxResponse.text();

    console.error(
      'Receiver inbox error:',
      inboxResponse.status,
      errorText
    );

    throw new Error(
      `Receiver inbox error: ${inboxResponse.status} ${errorText}`
    );
  }

  const senderKey = getEmailKey(senderEmail);

  const sentUrl =
    `${databaseUrl}/mailboxes/${senderKey}/sent.json?auth=${token}`;

  const sentResponse = await fetch(
    sentUrl,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mail),
    }
  );

  if (!sentResponse.ok) {
    const errorText =
      await sentResponse.text();

    console.error(
      'Sentbox error:',
      sentResponse.status,
      errorText
    );

    throw new Error(
      `Sentbox error: ${sentResponse.status} ${errorText}`
    );
  }

  return {
    success: true,
  };
};