import React, {
  useState
} from 'react';
import Api from '../Api';
import {
  Link,
  useNavigate,
} from 'react-router-dom';
import '../styles.css';
import {
  Button,
  TextField,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
} from '@mui/material';

// display the dashboard
function Dashboard () {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [newGameName, setNewGameName] = useState('');
  const [newGameShow, setNewGameShow] = useState(false);
  const [deleteGame, setDeleteGame] = useState('');
  const [deleteGameShow, setDeleteGameShow] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [copySessionId, setCopySessionId] = useState(false);
  const [endGame, setEndGame] = useState(false);

  // fetch all the questions in to Quizzes for display
  async function fetchAllQuzzies () {
    const api = new Api();
    const data = await api.getQuizzes();
    if (data.error) {
      alert(data.error);
      if (data.error === 'Invalid token') {
        localStorage.removeItem('token');
        navigate('/signin');
      }
    } else {
      let currQuizzies = [];
      let currQuiz = {};
      for (let i = 0; i < data.quizzes.length; i++) {
        const id = data.quizzes[i].id;
        const detail = await api.getQuestions(id);
        if (detail.error) {
          alert(detail.error);
        } else {
          currQuiz = { id, ...detail };
          currQuizzies = [...currQuizzies, currQuiz];
        }
      }
      setQuizzes(currQuizzies);
    }
  }

  // refresh game
  React.useEffect(async () => {
    await fetchAllQuzzies();
  }, [newGameShow, deleteGame]);

  // creating a new game
  async function createNewGame () {
    const api = new Api();
    await api.createGame(JSON.stringify({
      name: newGameName,
    }))
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          setNewGameShow(false);
        }
      })
    await fetchAllQuzzies();
  }

  // delete game
  async function deleteAGame (id) {
    const api = new Api();
    await api.deleteGame(id)
      .then(data => {
        if (data.error) {
          alert(data.error);
          setDeleteGame('');
        }
      })
    await fetchAllQuzzies();
  }

  // helper functions
  function totalTime (questions) {
    let total = 0;
    for (let i = 0; i < questions.length; i++) {
      total += parseInt(questions[i].time_limit);
    }
    return total;
  }

  // Handle start game
  function handleStart (game) {
    setStartGame(true);
    StartAGame(game);
  }

  // set the active session id into sessionId
  async function StartAGame (game) {
    const api = new Api();
    await api.startGame(game.id)
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          api.getQuizzes(game.id)
            .then((result) => {
              if (result.error) {
                alert(result.error);
              } else {
                setSessionId(result.quizzes[0].active);
                api.getSession(result.quizzes[0].active)
                  .then(res => {
                    if (res.error) {
                      alert(res.error);
                    }
                  })
              }
            })
        }
      })
  }

  // Handle end a game
  function handleEnd (game) {
    setStartGame(false);
    setCopySessionId(false);
    EndAGame(game.id);
  }

  // Set the session to inactive in fetch and remove session id
  async function EndAGame (gameId) {
    const api = new Api();
    await api.endGame(gameId)
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          setEndGame(true);
        }
      })
  }

  // navigate to the result page
  function viewResult (gameId) {
    navigate(`/game/${gameId}/session/${sessionId}/result`);
  }

  // copy session id to clipboard
  function handleCopySessionId () {
    navigator.clipboard.writeText(sessionId)
      .then(() => {
        setCopySessionId(true);
      })
  }

  // The text blocks in card displaying game infos
  function CardTexts (game) {
    return (
      <>
        Title: <b>{game.name}</b><br />
        Number of questions: <b>{game.questions.length}</b><br />
        Total time to complete: <b>{totalTime(game.questions)} s</b><br />
        {game.thumbnail
          ? <><img src={game.thumbnail} alt={'thumbnail'} /><br /></>
          : <></>
        }
        <br />
      </>
    )
  }

  // The popup for start a game
  function StartGameDialog (game) {
    return (
      <>
        <Dialog
          open={startGame}
          PaperProps={{ sx: { width: 1000, height: 600 } }}
        >
          <>
            <DialogTitle>
              Game Started
            </DialogTitle>
            Session id: <b>{sessionId}</b> <br />
              {copySessionId
                ? <>
                  Session id copied! <br />
                  </>
                : <>
                  <div>
                    <Button
                      size="small"
                      variant='outlined'
                      color='success'
                      onClick={handleCopySessionId}
                    >
                      Copy Session Id
                    </Button>
                  </div>
                </>
              }
            <div>
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={() => handleEnd(game)}
              >
                End Game
              </Button>
            </div>
          </>
        </Dialog>
      </>
    )
  }

  // The popup when game end(Asking if want to view result)
  function EndGameDialog (game) {
    return (
      <>
        <Dialog
          open={endGame}
          PaperProps={{ sx: { width: 1000, height: 600 } }}
        >
          <DialogTitle>
            Game Ended
          </DialogTitle>
          Would you like to view the results? <br />
          <div>
            <Button
              variant="outlined"
              size="small"
              color="success"
              onClick={() => viewResult(game.id)}
            >

            Yes</Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => setEndGame(false)}
            >
              No
            </Button>
          </div>
        </Dialog>
        <br />
      </>
    )
  }

  // return the display of game cards
  function Cards () {
    return (
      <>
        { Array.isArray(quizzes) && quizzes.map((game, index) => (
        <React.Fragment key={index}>
          <Card
            sx={{
              display: 'inline-block',
              mx: '2px',
              transform: 'scale(0.8)'
            }}
            >
            <CardContent>
              {CardTexts(game)}
              <Button
                id='start-game-button'
                variant="contained"
                color='success'
                size='small'
                onClick={() => handleStart(game)}
              >
                Start Game
              </Button>
              {StartGameDialog(game)}
              {EndGameDialog(game)}
              <Link
                to={`/game/${game.id}`}
              >
                <Button
                  id='edit-game-button'
                  size='small'
                >
                  Edit Game
                </Button>
              </Link>
              {deleteGameShow && (
                <>
                <br />
                  <Button
                    id='delete-game-button'
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => deleteAGame(game.id)}
                  >
                    Delete game
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </React.Fragment>
        )) }
      </>
    )
  }

  return (
    <>
      <h1>Dashboard</h1>
      <Link to={'/play'}>
        <Button
          color='success'
          variant='contained'
          size='small'
        >
          Play
        </Button>
      </Link> <br /><br />
      <hr />
      Games: <br />
      <Cards />
      <br />
      <Button
        id='create-new-game-button'
        variant="contained"
        onClick={() => setNewGameShow(!newGameShow)}
      >
        Create A New Game
      </Button> <br />
      {newGameShow && (
        <>
          <TextField
            id='title-input'
            label="Title"
            variant="standard"
            style={{ width: 360 }}
            value={newGameName}
            onChange={(e) => setNewGameName(e.target.value)}
          /> <br /><br />
          <Button
            id='create-button'
            variant="contained"
            size="small"
            color="success"
            onClick={createNewGame}
          >
            Create
          </Button><br />
        </>
      )}
      <br />
      <Button
        id='show-delete-button'
        variant="contained"
        color="error"
        onClick={() => setDeleteGameShow(!deleteGameShow)}
      >
        {deleteGameShow ? 'Hide' : ''} Delete games
      </Button>
    </>
  )
}

export default Dashboard;
