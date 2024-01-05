import React from 'react';
import Api from '../Api';

// fetch for sign out
async function SignOut () {
  const api = new Api();
  const data = await api.logout();
  if (data.error) {
    alert(data.error);
  } else {
    localStorage.removeItem('token');
  }
  return (
    <>
    </>
  )
}

export default SignOut;
