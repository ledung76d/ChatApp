import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import styled from 'styled-components'
import ChatIcon from '@mui/icons-material/Chat'
import MoreVerticalIcon from '@mui/icons-material/MoreVert'
import LogoutIcon from '@mui/icons-material/Logout'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'
import { auth, db } from '@/config/firebase'
import { signOut } from 'firebase/auth'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import * as EmailValidator from 'email-validator'
import { addDoc, collection, query, where } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { Conversation } from '@/types'
import { ConversationSelect } from './ConversationSelect'
const StyledContainer = styled.div`
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;
  border-right: 1px solid whitesmoke;
`

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
`
const StyledSearch = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 2px;
`

const StyledUserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`

const StyledSearchInput = styled.input`
  outline: none;
  border: none;
  flex: 1;
`

const StyledSidebarButton = styled(Button)`
  width: 100%;
  border-top: 1px solid whitesmoke;
  border-bottom: 1px solid whitesmoke;
  font-weight: 700;
`

export const Sidebar = () => {
  // eslint-disable-next-line no-unused-vars
  const [loggedInUser, _loading, _error] = useAuthState(auth)

  const [isOpenNewConversationDialog, setIsOpenNewConversationDialog] =
    useState(false)

  const [recipientEmail, setRecipientEmail] = useState('')
  const toggleConversationDiaLog = (isOpen: boolean) => {
    setIsOpenNewConversationDialog(isOpen)
    if (!isOpen) {
      setRecipientEmail('')
    }
  }
  const isInvitingSelf = recipientEmail === loggedInUser?.email

  const handleClose = () => {
    toggleConversationDiaLog(false)
  }

  const queryGetConversationsForCurrentUser = query(
    collection(db, 'conversations'),
    where('users', 'array-contains', loggedInUser?.email)
  )
  // eslint-disable-next-line no-unused-vars
  const [conversationSnapshot, __loading, __error1] = useCollection(
    queryGetConversationsForCurrentUser
  )

  // Check if conversation already exists before creating a new one
  const isConversationAlreadyExists = (recipientEmail: string) => {
    return !!conversationSnapshot?.docs.find((doc) =>
      (doc.data() as Conversation).users.includes(recipientEmail)
    )
  }

  const createConversation = async () => {
    if (!recipientEmail) return
    if (
      EmailValidator.validate(recipientEmail) &&
      !isInvitingSelf &&
      !isConversationAlreadyExists(recipientEmail)
    ) {
      await addDoc(collection(db, 'conversations'), {
        users: [loggedInUser?.email, recipientEmail],
      })
    }
    handleClose()
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      // eslint-disable-next-line no-console, no-undef
      console.log('LOGOUT ERROR', error)
    }
  }

  return (
    <StyledContainer>
      <StyledHeader>
        <Tooltip title={loggedInUser?.email as string} placement='right'>
          <StyledUserAvatar src={loggedInUser?.photoURL || ''} />
        </Tooltip>
        <div>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVerticalIcon />
          </IconButton>
          <IconButton onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </div>
      </StyledHeader>
      <StyledSearch>
        <SearchIcon />
        <StyledSearchInput placeholder='Search in conversation' />
      </StyledSearch>
      <StyledSidebarButton
        onClick={() => {
          toggleConversationDiaLog(true)
        }}
      >
        Start a new conversation
      </StyledSidebarButton>

      {/* List conversation */}
      {/* <ConversationSelect key/> */}
      {conversationSnapshot?.docs.map((conversation) => (
        <ConversationSelect
          key={conversation.id}
          id={conversation.id}
          conversationUser={(conversation.data() as Conversation).users}
        />
      ))}

      <Dialog open={isOpenNewConversationDialog} onClose={handleClose}>
        <DialogTitle>New conversation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a Google email address for the user you wish to chat
            with
          </DialogContentText>
          <TextField
            autoFocus
            label='Email Address'
            type='email'
            fullWidth
            variant='standard'
            value={recipientEmail}
            onChange={(e) => {
              setRecipientEmail(e.target.value)
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={!recipientEmail} onClick={createConversation}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  )
}
