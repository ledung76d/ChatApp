import styled from 'styled-components';
import CircularProgress from '@mui/material/CircularProgress';
import ChatAppLogo from '../assets/Logo.png';
import Image from 'next/image';

const StyledContainer = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const StyledImageWrapper = styled.div`
  margin-bottom: 10px;
`;

export const Loading = () => {
  return (
    <StyledContainer>
      <StyledImageWrapper>
        <Image src={ChatAppLogo} alt='Chat app logo' height={200} width={200} />
      </StyledImageWrapper>
      <CircularProgress />
    </StyledContainer>
  );
};
