# Mailbox Client - Signup Screen

React + React Bootstrap + Firebase Authentication signup page matching the supplied reference layout.

## Requirements covered

- React JS
- React Bootstrap for the interface components
- Email, Password and Confirm Password only
- All fields are required
- Password confirmation validation
- Firebase Email/Password Authentication
- Firebase errors displayed to the user
- Successful signup logs exactly:
  `User has successfully signed up.`

## 1. Install dependencies

```bash
npm install
```

## 2. Configure Firebase

1. Open Firebase Console: https://console.firebase.google.com/
2. Create a project (or use your existing Mailbox Client Firebase project).
3. Open **Build -> Authentication -> Get started**.
4. Open **Sign-in method**.
5. Enable **Email/Password** and save.
6. Go to **Project settings -> General**.
7. Under **Your apps**, create/select a Web app (`</>`).
8. Copy the Firebase web configuration values.
9. Create a `.env` file in this project's root using `.env.example` as the template.
10. Put your values into `.env`.

Example:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Do not commit `.env` to Git. It is already included in `.gitignore`.

## 3. Run

```bash
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

## 4. Test signup

- Enter an email.
- Enter a password with at least 6 characters.
- Enter the same password in Confirm Password.
- Click **Sign up**.
- Check Firebase Console -> Authentication -> Users. The new account should appear.
- Open browser DevTools -> Console and verify:

```text
User has successfully signed up.
```

## 5. Git commit and push

```bash
git init
git add .
git commit -m "Create Mailbox Client signup screen"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Then get the commit ID with:

```bash
git rev-parse HEAD
```
