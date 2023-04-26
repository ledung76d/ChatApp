import Button from '@mui/material/Button'
import Head from 'next/head'
import styled from 'styled-components'
import Image from 'next/image'
import ChatAppLogo from '../assets/Logo.png'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { auth } from '../config/firebase'

const StyledContainer = styled.div`
  height: 100vh;
  display: grid;
  place-items: center;
  background-color: whitesmoke;
`

const StyledLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
`

const StyledImageWrapper = styled.div`
  margin-bottom: 50px;
`

const Login = () => {
  // eslint-disable-next-line no-unused-vars
  const [signInWithGoogle, _user, _loading, _error] = useSignInWithGoogle(auth)

  const signIn = () => {
    signInWithGoogle()
  }

  return (
    <StyledContainer>
      <Head>
        <h1>Login</h1>
      </Head>

      <StyledLoginContainer>
        <StyledImageWrapper>
          <Image src={ChatAppLogo} alt='ChatAppLogo' height={200} width={200} />
        </StyledImageWrapper>

        <Button variant='outlined' onClick={signIn}>
          Sign in with Googles
        </Button>
      </StyledLoginContainer>
    </StyledContainer>
  )
}

export default Login
