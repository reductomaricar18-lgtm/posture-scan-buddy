# Firebase Setup Guide

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "posture-scan-buddy")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, click "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

## Step 3: Enable Firestore Database

1. In your Firebase project, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (you can secure it later)
4. Select a location for your database
5. Click "Done"

## Step 4: Get Your Firebase Configuration

1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "posture-scan-buddy-web")
6. Copy the configuration object

## Step 5: Update Your Firebase Configuration

1. Open `src/lib/firebaseClient.ts`
2. Replace the placeholder values with your actual Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "your_actual_api_key",
  authDomain: "your_project_id.firebaseapp.com",
  projectId: "your_project_id",
  storageBucket: "your_project_id.appspot.com",
  messagingSenderId: "your_messaging_sender_id",
  appId: "your_app_id"
};
```

## Step 6: Set Up Firestore Security Rules

1. In Firestore Database, go to the "Rules" tab
2. Update the rules to allow authenticated users to read/write their own data and log activity:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /scans/{scanId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /userActivity/{activityId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## Step 7: Test Your Setup

1. Run your development server: `npm run dev`
2. Navigate to `/signup` to create a new account
3. Check Firebase Console > Authentication to see the new user
4. Check Firebase Console > Firestore Database to see the user document
5. **Test login/logout monitoring**:
   - Sign in with your account
   - Check Firestore > `userActivity` collection for login records
   - Sign out
   - Check Firestore > `userActivity` collection for logout records

## Security Notes

- Never commit your Firebase API keys to version control
- Use environment variables for production deployments
- Set up proper Firestore security rules before going to production
- Consider enabling additional authentication methods (Google, Facebook, etc.)

## User Activity Monitoring

Your app now tracks:
- **Login events** with timestamp, user agent, and user details
- **Logout events** with timestamp, session duration, and last screen
- **Session duration** (how long users stay logged in)
- **User navigation** (which screen they were on when logging out)

## Troubleshooting

- **Authentication errors**: Make sure Email/Password auth is enabled
- **Database errors**: Check Firestore security rules
- **CORS errors**: Verify your domain is added to authorized domains in Firebase
- **API key errors**: Ensure your Firebase config is correct and complete
- **Activity logging errors**: Check if userActivity collection exists and rules allow access 