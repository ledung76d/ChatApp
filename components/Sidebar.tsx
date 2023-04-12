import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import styled from 'styled-components';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVerticalIcon from '@mui/icons-material/MoreVert';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import { auth } from '@/config/firebase';
import { signOut } from 'firebase/auth';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';

const StyledContainer = styled.div`
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;
  border-right: 1px solid whitesmoke;
`;

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
`;
const StyledSearch = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 2px;
`;

const StyledUserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const StyledSearchInput = styled.input`
  outline: none;
  border: none;
  flex: 1;
`;

const StyledSidebarButton = styled(Button)`
  width: 100%;
  border-top: 1px solid whitesmoke;
  border-bottom: 1px solid whitesmoke;
  font-weight: 700;
`;

export const Sidebar = () => {
  const [isOpenNewConversationDialog, setIsOpenNewConversationDialog] =
    useState(false);

  const [];
  const handleClickOpen = () => {
    setIsOpenNewConversationDialog(true);
  };

  const handleClose = () => {
    setIsOpenNewConversationDialog(false);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log('LOGOUT ERROR', error);
    }
  };

  return (
    <StyledContainer>
      <StyledHeader>
        <Tooltip title='USER EMAIL' placement='right'>
          <StyledUserAvatar />
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
      <StyledSidebarButton>Start a new conversation</StyledSidebarButton>
      <div>
        <Button variant='outlined' onClick={handleClickOpen}>
          Open form dialog
        </Button>
        <Dialog open={isOpenNewConversationDialog} onClose={handleClose}>
          <DialogTitle>Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To subscribe to this website, please enter your email address
              here. We will send updates occasionally.
            </DialogContentText>
            <TextField
              autoFocus
              margin='dense'
              id='name'
              label='Email Address'
              type='email'
              fullWidth
              variant='standard'
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Subscribe</Button>
          </DialogActions>
        </Dialog>
      </div>
    </StyledContainer>
  );
};
