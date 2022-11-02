import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const clientCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  tomTomApi: process.env.NEXT_PUBLIC_TOM_TOM_API_KEY,
  cloudinaryApiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
};

if (!firebase.apps.length) {
  firebase?.initializeApp(clientCredentials);
}

export { firebase, clientCredentials };
