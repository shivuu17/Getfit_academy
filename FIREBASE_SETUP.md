# Firebase Deployment Guide for Getfit Academy

This guide will help you deploy your Getfit Academy website to Firebase Hosting with Firebase Authentication and Firestore Database.

## Prerequisites

- Node.js installed (v14 or higher)
- A Google account
- Firebase CLI installed globally: `npm install -g firebase-tools`

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Enter your project name (e.g., "getfit-academy")
4. Select your country/region
5. Click "Create Project"
6. Wait for the project to be created

## Step 2: Set Up Firebase Web App

1. In the Firebase Console, click the Web icon (</> symbol)
2. Enter your app name (e.g., "Getfit Academy Web")
3. Click "Register app"
4. You'll see your Firebase config - **copy this information**
5. Click "Continue to console"

## Step 3: Enable Firebase Services

### Enable Firestore Database
1. In Firebase Console, go to "Build" → "Firestore Database"
2. Click "Create Database"
3. Select "Start in production mode"
4. Choose your region
5. Click "Create"

### Enable Authentication
1. In Firebase Console, go to "Build" → "Authentication"
2. Click "Get started"
3. Click "Email/Password" provider
4. Enable "Email/Password" toggle
5. Click "Save"

### Enable Storage (Optional, for future use)
1. In Firebase Console, go to "Build" → "Storage"
2. Click "Get started"
3. Accept the security rules
4. Select your region
5. Click "Done"

## Step 4: Create an Admin User

1. Go to "Authentication" → "Users"
2. Click "Add user"
3. Enter an email and password for your admin account
4. Click "Add user"
5. Copy the email address of the created user

## Step 5: Set Up Firestore Security Rules

1. Go to "Firestore Database" → "Rules"
2. Replace the rules with the content from `firestore.rules` file in your project
3. In the security rules, the admin allowlist is checked against the signed-in user's email address
4. Click "Publish"

If you want a different first admin email, update `VITE_BOOTSTRAP_ADMIN_EMAIL` in your `.env` file before opening the admin panel for the first time.

## Step 6: Create Admin Configuration in Firestore

1. Go to "Firestore Database" → "Data"
2. Create a new collection named "admins"
3. Create a document named "allowed"
4. Add a field named "emails" with type "Array"
5. Add your admin email address to the array
6. Save

Example structure:
```
Collection: admins
  Document: allowed
    Field: emails (Array)
      - [your_admin_email]
```

## Step 7: Configure Environment Variables

1. In your project root, find or create `.env.local` file (for local development)
2. Also ensure `.env` exists with the environment variables

3. Fill in the Firebase credentials from Step 2:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

Find these values in Firebase Console:
- Go to "Project Settings" (gear icon)
- Click "Your apps"
- Find your web app
- Copy the firebaseConfig object

## Step 8: Install Firebase Tools

```bash
npm install -g firebase-tools
```

## Step 9: Initialize Firebase in Your Project

```bash
firebase login
```

This will open your browser to authenticate with your Google account.

Then initialize Firebase:

```bash
firebase init
```

When prompted:
- Choose "Hosting" and "Firestore" services
- Select your Firebase project
- For Firestore rules file: press Enter (uses firestore.rules)
- For public directory: type `dist`
- Configure as single-page app: type `y` (yes)
- Don't overwrite existing files: type `n` (no)

## Step 10: Build and Deploy

Build your project:
```bash
npm run build
```

Deploy to Firebase:
```bash
npm run deploy
```

Or deploy manually:
```bash
firebase deploy
```

You can also use just the hosting deploy:
```bash
firebase deploy --only hosting
```

## Step 11: Access Your Application

After deployment, you'll get a Firebase Hosting URL. Your application will be live at that URL.

### Access Admin Panel

The admin panel is now secured with Firebase Authentication:
- Desktop: Use keyboard shortcut `Ctrl+Shift+A` to open the admin access modal
- Sign in with an approved Firebase Auth email/password account
- Only emails listed in `admins/allowed` can open the admin panel

## Usage

### Admin Panel Features

**Users Tab:**
- View all users who joined
- See user details (name, phone, gender, age, package, training type, etc.)
- Update user status (pending/active/inactive)
- Delete users
- View detailed user information

**Pricing Tab:**
- Manage package pricing (Monthly, 3 Months, 6 Months, Yearly)
- Changes are saved to Firebase Firestore
- Pricing changes are reflected across the website

### User Data

When users join:
1. Their data is saved to Firebase Firestore under the "users" collection
2. An automatic WhatsApp message is sent to the gym
3. Admin can see the user in the Admin Panel

## Troubleshooting

### "Cannot find module 'firebase'"
Solution: Run `npm install`

### "VITE_FIREBASE_API_KEY is undefined"
Solution: Make sure your `.env` file has all Firebase credentials filled in

### "Authentication/authorization failed"
Solution: Check Firestore security rules and make sure your admin email is in the admins/allowed document

### Deploy not working
Solution: 
- Make sure `dist` folder exists: run `npm run build`
- Make sure you're logged in: run `firebase login`
- Check Firebase project is selected: run `firebase use [project-id]`

## Database Structure

```
Firestore Database:
├── users (collection)
│   └── {user_id} (document)
│       ├── fullName
│       ├── phone
│       ├── email
│       ├── gender
│       ├── dateOfBirth
│       ├── category
│       ├── trainingType
│       ├── packageDuration
│       ├── preferredTime
│       ├── paymentMode
│       ├── status (pending/active/inactive)
│       └── joinedAt
│
├── pricing (collection)
│   └── default (document)
│       ├── monthly
│       ├── quarterly
│       ├── biannual
│       └── yearly
│
└── admins (collection)
    └── allowed (document)
    └── emails (array of admin emails)
```

## Security Notes

- Never commit `.env` files with real credentials to public repositories
- Firestore security rules are set to allow only authenticated admins
- Always use strong passwords for admin accounts
- Regularly review user data in Firestore

## Next Steps

After deployment:
1. Test the admin panel with your credentials
2. Test user registration and data saving
3. Monitor user submissions in the admin panel
4. Keep your Firebase project secure and up to date

## Support

For Firebase issues, visit: https://firebase.google.com/support
For deployment questions, check Firebase documentation: https://firebase.google.com/docs/hosting

---

Happy deploying! 🚀
