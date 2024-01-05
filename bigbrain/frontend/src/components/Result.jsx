import React, {
  useState,
  useEffect
} from 'react';
import {
  useNavigate,
  useParams
} from 'react-router-dom';
import { Button } from '@mui/material';
import Api from '../Api';

// display the result page
function Result () {
  const sessionid = useParams().sessionid;
  const navigate = useNavigate();
  const [session, setSession] = useState({});
  const [loading, setLoading] = useState(true);
  const [topPlayers, setTopPlayers] = useState('');

  // fetch the session to get infos about the game
  useEffect(async () => {
    const fetchSession = async () => {
      const api = new Api()
      await api.getSession(sessionid)
        .then(data => {
          if (data.error) {
            alert(data.error)
          } else {
            setSession(data.results)
            setTopPlayers(handleTopPlayers)
            setLoading(false)
          }
        })
    }
    await fetchSession()
  }, [sessionid]);

  // TODO
  function handleTopPlayers () {
    return session;
  }

  return (
    <>
      { loading &&
        <h1>Loading...</h1>
      }
      {
        !loading && (
          <>
            Results: {topPlayers.id} <br />
          </>
        )
      }
      <Button
        onClick={() => navigate(-1)}
      >
        Close
      </Button>
    </>
  )
}

export default Result;
