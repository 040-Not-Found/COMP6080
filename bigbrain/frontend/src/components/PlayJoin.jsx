import React, {
  useState,
} from 'react';
import {
  useNavigate,
  // useParams
} from 'react-router-dom';
import {
  Button,
  TextField,
  // Dialog,
  // DialogTitle,
} from '@mui/material';
import Api from '../Api';

// display the result page
function PlayJoin () {
  const navigate = useNavigate()
  const [sessionId, setSessionId] = useState('')
  const [name, setName] = useState('')
  const [playerId, setPlayerId] = useState('')
  const [start, setStart] = useState(false)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState('')

  // get the datas of this session from fetch
  function fetchSession () {
    const api = new Api()
    api.getSession(sessionId)
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          setSession(data.results);
          setLoading(false);
        }
      })
  }

  // join the session using the session id
  async function join () {
    const api = new Api()
    await api.join(sessionId, JSON.stringify({
      name,
    }))
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          setPlayerId(data.playerId);
        }
      })
    fetchSession();
    setStart(true);
  }

  // navigate to previous page when quit
  function quit () {
    navigate(-1);
  }

  return (
    <>
      {!start
        ? <>
          Enter the session id: <br />
          <TextField
            label="Session ID"
            size="small"
            variant="outlined"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
          /> <br /><br />
          Enter your name: <br />
          <TextField
            label="Name"
            size="small"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <Button
            color="success"
            onClick={join}
          >
            Join
          </Button>
        </>
        : <>
        {loading
          ? <>Loading...</>
          : <>
          Hi {name}! Your id is: {playerId} <br />
          Start
          {session.questions}
          </>
        }
        </>
      }
      <br />
      <Button color='error' onClick={quit}>Exit Game</Button>
    </>
  )
}

export default PlayJoin;
