import { getApps, getApp, initializeApp } from 'firebase/app';
// Import the functions you need from the SDKs you need
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCbYtG4NqILKWOKju2p5o9vFmmEjoMfaZA',
  authDomain: 'chatapp-37afb.firebaseapp.com',
  projectId: 'chatapp-37afb',
  storageBucket: 'chatapp-37afb.appspot.com',
  messagingSenderId: '181705282443',
  appId: '1:181705282443:web:e17ed513f33778bdc4958e',
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { db, auth, provider };
