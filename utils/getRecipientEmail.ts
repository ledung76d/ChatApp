import { Conversation } from '@/types';
import { User } from 'firebase/auth';

export const getRecipientEmail = (
  conversationUsers: Conversation['users'],
  userLoggedIn?: User | null
) => conversationUsers.find((user) => user !== userLoggedIn?.email);
