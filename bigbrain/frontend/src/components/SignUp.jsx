import React from 'react';
import {
  useNavigate,
} from 'react-router-dom';
import Api from '../Api';
import { Button, TextField } from '@mui/material';

// display the sign up page
function SignUp ({ onSuccess }) {
  const navigate = useNavigate()
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  async function register () {
    const api = new Api()
    const data = await api.register(JSON.stringify({
      email,
      password,
      name,
    }))
    if (data) {
      if (data.error) {
        alert(data.error);
      } else {
        onSuccess(data.token);
        navigate('/dashboard');
      }
    } else {
      alert('No data!');
    }
  }
  return (
    <>
    <h2>Sign Up</h2>
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
      /> <br />
      <TextField
        id='name-input'
        label="Name"
        variant="standard"
        style={{ width: 360 }}
        value={name}
        onChange={(e) => setName(e.target.value)}
      /> <br /><br />
      <Button
        id='register-button'
        variant="contained"
        size='small'
        onClick={register}
      >
        Register
      </Button> <br />
    </div>
    </>
  )
}

export default SignUp;
