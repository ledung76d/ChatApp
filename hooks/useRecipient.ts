import { collection, query, where } from 'firebase/firestore';
import { AppUser, Conversation } from '../types';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/config/firebase';
import { getRecipientEmail } from '@/utils/getRecipientEmail';
import { useCollection } from 'react-firebase-hooks/firestore';

export const useRecipient = (conversation: Conversation['users']) => {
  // get recipient email
  const [loggedInUser, _loading, _error] = useAuthState(auth);
  const recipientEmail = getRecipientEmail(conversation, loggedInUser);
  // get recipient avatar
  const queryGetRecipientAvatar = query(
    collection(db, 'users'),
    where('email', '==', recipientEmail)
  );

  const [recipientSnapshot, _loading2, _error2] = useCollection(
    queryGetRecipientAvatar
  );

  // if recipient avatar is not found, return data with default avatar
  const recipient = recipientSnapshot?.docs?.[0]?.data() as AppUser | undefined;

  return {
    recipient,
    recipientEmail,
  };
};
