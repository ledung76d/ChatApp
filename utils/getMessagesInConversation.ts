import { db } from '@/config/firebase'
import { IMessage } from '@/types'
import {
  DocumentData,
  Query,
  QueryDocumentSnapshot,
  Timestamp,
  collection,
  orderBy,
  query,
  where,
} from 'firebase/firestore'

export const generateQueryGetMessages = (
  conversationId?: string
): Query<DocumentData> => {
  return query(
    collection(db, 'messages'),
    where('conversation_id', '==', conversationId),
    orderBy('sent_at', 'asc')
  )
}

export const convertFirestoreTimestampToString = (timestamp: Timestamp) => {
  return new Date(timestamp.toDate().getTime()).toLocaleString()
}

export const transformMessage = (
  message: QueryDocumentSnapshot<DocumentData>
) =>
  ({
    id: message.id,
    ...message.data(),
    sent_at: message.data().sent_at
      ? convertFirestoreTimestampToString(message.data().sent_at as Timestamp)
      : null,
  } as IMessage)
