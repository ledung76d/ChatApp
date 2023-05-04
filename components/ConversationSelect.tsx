import { useRecipient } from '@/hooks/useRecipient'
import { Conversation } from '@/types'
import styled from 'styled-components'
import RecipientAvatar from './RecipientAvatar'
import { useRouter } from 'next/router'

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-all;
  :hover {
    background-color: #e9eaeb;
  }
`

export const ConversationSelect = ({
  id,
  conversationUser,
}: {
  id: string
  conversationUser: Conversation['users']
}) => {
  const { recipient, recipientEmail } = useRecipient(conversationUser)

  const router = useRouter()

  const onSelectConversation = () => {
    router.push(`/conversations/${id}`)
  }

  return (
    <StyledContainer onClick={onSelectConversation}>
      <RecipientAvatar recipientEmail={recipientEmail} recipient={recipient} />
      <span>{recipientEmail}</span>
    </StyledContainer>
  )
}
