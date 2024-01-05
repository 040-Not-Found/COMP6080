import React, {
  useState
} from 'react';
import { useNavigate } from 'react-router-dom';
import Api from '../Api';
import {
  Button,
  TextField
} from '@mui/material';

// display the sign in page
function SignIn ({ onSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  async function login () {
    const api = new Api();
    const data = await api.login(JSON.stringify({
      email,
      password,
    }));
    if (data.error) {
      alert(data.error);
    } else {
      onSuccess(data.token);
      navigate('/dashboard');
    }
  }
  return (
    <>
      <h2>Sign In</h2>
      <div className='box'>
        <TextField
          id='email-input'
          label="Email"
          variant="standard"
          style={{ width: 360 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /> <br />
        <TextField
          id='password-input'
          label="Password"
          variant="standard"
          style={{ width: 360 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /> <br /><br />
        <Button
          id='sign-in-button'
          variant="contained"
          size='small'
          onClick={login}
        >
          Sign In
        </Button>
      </div>
    </>
  );
}

export default SignIn;
