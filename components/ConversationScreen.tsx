import { useRecipient } from '@/hooks/useRecipient'
import { Conversation, IMessage } from '@/types'
import styled from 'styled-components'
import RecipientAvatar from './RecipientAvatar'
import {
  convertFirestoreTimestampToString,
  generateQueryGetMessages,
  transformMessage,
} from '@/utils/getMessagesInConversation'
import { IconButton } from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useRouter } from 'next/router'
import { useCollection } from 'react-firebase-hooks/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '@/config/firebase'
import Message from './Message'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import MicIcon from '@mui/icons-material/Mic'
import SendIcon from '@mui/icons-material/Send'
import {
  KeyboardEventHandler,
  MouseEventHandler,
  useState,
  useRef,
} from 'react'
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'

const StyledRecipientHeader = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  align-items: center;
  padding: 11px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`
const StyledHeaderInfo = styled.div`
  flex-grow: 1;

  > h3 {
    margin-top: 0;
    margin-bottom: 3px;
  }
  > span {
    font-size: 14px;
    color: gray;
  }
`
const StyledH3 = styled.h3`
  word-break: break-all;
`

const StyledHeaderIcons = styled.div`
  display: flex;
`

const StyledMessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`

const StyledInputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: #fff;
  z-index: 200;
`
const StyledInput = styled.input`
  flex-grow: 1;
  outline: none;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 15px;
  margin-left: 15px;
  margin-right: 15px;
`
const EnOfMessageForAutoScroll = styled.div`
  margin-bottom: 30px;
`

const ConversationScreen = ({
  conversation,
  messages,
}: {
  conversation: Conversation
  messages: IMessage[]
}) => {
  const [newMessage, setNewMessage] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [loggedInUser, __loading, __error] = useAuthState(auth)
  const conversationUsers = conversation.users
  const { recipientEmail, recipient } = useRecipient(conversationUsers)
  const router = useRouter()
  const conversationId = router.query.id as string
  const queryGetMessages = generateQueryGetMessages(conversationId as string)
  // eslint-disable-next-line no-undef
  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // eslint-disable-next-line no-unused-vars
  const [messagesSnapshot, messagesLoading, __error1] =
    useCollection(queryGetMessages)

  const showMessages = () => {
    if (messagesLoading) {
      return messages.map((message) => (
        <Message key={message.id} message={message} />
      ))
    }
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message key={message.id} message={transformMessage(message)} />
      ))
    }
    return null
  }

  const addMessageToDbAndUpdateLastSeen = async () => {
    await setDoc(
      doc(db, 'users', loggedInUser?.email as string),
      {
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    )
    // add new message
    await addDoc(collection(db, 'messages'), {
      conversation_id: conversationId,
      text: newMessage,
      sent_at: serverTimestamp(),
      user: loggedInUser?.email,
    })
    setNewMessage('')
    // scroll to the end of messages
    scrollToBottom()
  }

  // eslint-disable-next-line no-undef
  const sendMessageOnEnter: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (!newMessage) return
      addMessageToDbAndUpdateLastSeen()
    }
  }

  // eslint-disable-next-line no-undef
  const sendMessageOnClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    if (!newMessage) return
    addMessageToDbAndUpdateLastSeen()
  }

  return (
    <>
      <StyledRecipientHeader>
        <RecipientAvatar
          recipient={recipient}
          recipientEmail={recipientEmail}
        />
        <StyledHeaderInfo>
          <StyledH3>{recipientEmail}</StyledH3>
          {recipient && (
            <span>
              Last active:{' '}
              {convertFirestoreTimestampToString(recipient.lastSeen)}
            </span>
          )}
        </StyledHeaderInfo>
        <StyledHeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </StyledHeaderIcons>
      </StyledRecipientHeader>
      <StyledMessageContainer>
        {showMessages()}
        {/* for auto scroll to the end when a new message is sent */}
        <EnOfMessageForAutoScroll ref={endOfMessagesRef} />
      </StyledMessageContainer>
      <StyledInputContainer>
        <InsertEmoticonIcon />
        <StyledInput
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value)
          }}
          onKeyDown={sendMessageOnEnter}
        />
        <IconButton onClick={sendMessageOnClick} disabled={!newMessage}>
          <SendIcon />
        </IconButton>
        <IconButton>
          <MicIcon />
        </IconButton>
      </StyledInputContainer>
    </>
  )
}

export default ConversationScreen
