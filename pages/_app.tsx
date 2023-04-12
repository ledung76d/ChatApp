import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Login from './login';
import { auth, db } from '@/config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Loading } from '@/components/Loading';
import { useEffect } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function App({ Component, pageProps }: AppProps) {
  const [loggedInUser, loading, __error] = useAuthState(auth);

  useEffect(() => {
    const setUserInDB = async () => {
      try {
        await setDoc(
          doc(db, 'users', loggedInUser?.email as string),
          {
            email: loggedInUser?.email,
            lastSeen: serverTimestamp(),
            photoURL: loggedInUser?.photoURL,
          },
          { merge: true } //just update what is changed
        );
      } catch (error) {
        console.log('ERROR SETTING USER INFO IN DB');
      }
    };
    if (loggedInUser) {
      setUserInDB();
    }
  }, [loggedInUser]);

  if (loading) return <Loading />;
  if (!loggedInUser) return <Login />;
  return <Component {...pageProps} />;
}
