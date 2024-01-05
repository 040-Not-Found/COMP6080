import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom';
import './styles.css';
import { Button } from '@mui/material';
import SignUp from './components/SignUp'
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
import Dashboard from './components/Dashboard';
import EditGame from './components/EditGame';
import EditQuestion from './components/EditQuestion';
import Result from './components/Result';
import PlayJoin from './components/PlayJoin';

function App () {
  const [token, setToken] = React.useState(null)

  function manageTokenSet (token) {
    setToken(token);
    localStorage.setItem('token', token);
  }

  function handleSignOut () {
    SignOut();
    setToken(null);
  }

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'));
    }
  }, [])

  return (
    <>
      <BrowserRouter>
        <header>
          <nav>
            {token
              ? (
                <Button id='header-logout'>
                  <Link to="/signin"
                    style={{ textDecoration: 'none', color: 'black' }}
                    onClick={handleSignOut}
                  >
                    Logout
                  </Link>
                </Button>
                )
              : (
              <>
                <Button id='header-sign-in'>
                  <Link to="/signin"
                    style={{ textDecoration: 'none', color: 'black' }}
                  >
                    Sign in
                  </Link>
                </Button>
                |
                <Button id='header-sign-up'>
                  <Link to="/signup"
                  style={{ textDecoration: 'none', color: 'black' }}
                  >
                    Sign up
                  </Link>
                </Button>
              </>
                )}
          </nav>
          <hr />
        </header>
        <main className="main">
          <Routes>
            <Route path="" element={<Navigate to={localStorage.getItem('token') ? '/dashboard' : '/signin'}replace />} />
            <Route exact path="/signup" element={<SignUp onSuccess={manageTokenSet} />} />
            <Route exact path="/signin" element={<SignIn onSuccess={manageTokenSet} />} />
            <Route exact path="/dashboard" element={<Dashboard />} />
            <Route path="/game/:quizid" element={<EditGame />} />
            <Route path="/game/:quizid/question/:questionid" element={<EditQuestion />} />
            <Route path='/game/:quizid/session/:sessionid/result' element={<Result />} />
            <Route exact path="/play" element={<PlayJoin />} />
          </Routes>
        </main>
      </BrowserRouter>

    </>
  );
}

export default App;
