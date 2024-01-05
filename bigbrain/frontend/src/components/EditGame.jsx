import React, {
  useState,
  useEffect
} from 'react';
import Api from '../Api';
import {
  useParams,
  Link
} from 'react-router-dom';
import {
  TextField,
  Button,
  Card,
  CardContent,
  MenuItem
} from '@mui/material';

// display the edit game page
function EditGame () {
  const id = useParams().quizid;
  const [newQ, setNewQ] = useState(false)
  const [qType, setQType] = useState('single')
  const type = [
    {
      value: 'single',
      label: 'Single choice',
    },
    {
      value: 'multiple',
      label: 'Multiple choice',
    },
  ];
  const [qText, setQText] = useState('')
  const [time, setTime] = useState('')
  const [qPoint, setQPoint] = useState('')
  const [qOptionally, setQOptionally] = useState('')
  const [answers, setAnswers] = useState([]);
  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };
  const [ques, setQues] = useState([])
  const [update, setUpdate] = useState(false)

  // fetch all the questions to display
  async function fetchAllQuestions () {
    const api = new Api()
    const data = await api.getQuestions(id);
    if (data.error) {
      alert(data.error);
    } else {
      setQues(data.questions);
    }
  }

  // refresh question
  useEffect(async () => {
    fetchAllQuestions();
  }, [update])

  // update the questions to fetch
  async function updataQs () {
    const api = new Api();
    await api.updateGame(id, JSON.stringify({
      questions: ques,
    }))
      .then(data => {
        if (data.error) {
          alert(data.error);
        }
      })
    setUpdate(!update);
  }

  // create a new question infos
  async function creatNewQuestion () {
    const qid = Math.floor(Math.random() * 900000000) + 100000000;
    const newQ = {
      id: qid.toString(),
      type: qType,
      text: qText,
      time_limit: time,
      points: qPoint,
      answer: answers
    }
    setQues(ques.push(newQ));
    await updataQs();
  }

  // delete the question
  async function deleteQuestion (Q) {
    const index = ques.findIndex((question) => question === Q);
    setQues(ques.splice(index, 1));
    await updataQs();
  }

  // function to display questions
  function DisplayQs () {
    return (
      <>
        Questions: <br />
        {Array.isArray(ques) && ques.map((question, index) => (
          <React.Fragment key={index}>
            <Card
              sx={{
                display: 'inline-block',
                mx: '2px',
                transform: 'scale(0.8)'
              }}
              style={{
                width: 360
              }}>
              <CardContent>
                {question.text}
              </CardContent>
              <Link to={`question/${question.id}`}>
                <Button
                  id='edit-question-button'
                  variant="outlined"
                  size="small"
                  color='success'
                >
                  Edit Question
                </Button>
              </Link>
              <Button
                id='delete-question-button'
                variant="outlined"
                size="small"
                color='error'
                onClick={() => deleteQuestion(question)}
              >
                Delete Question
              </Button>
            </Card>
            <br />
          </React.Fragment>
        ))}
      </>
    )
  }

  return (
    <>
      <h1>
        <Link
          to={'/dashboard'}
          style={{
            textDecoration: 'none',
            color: 'black'
          }}
        >
          Dashboard
        </Link>
      </h1>
      <br />
      <Button
        id='add-question-button'
        variant="contained"
        color='success'
        onClick={() => setNewQ(!newQ)}
      >
        Add Question
      </Button><br />
      { newQ && (
        <div className='box'>
          <TextField
            id='question-input'
            label="Question:"
            variant="standard"
            style={{ width: 360 }}
            value={qText}
            onChange={(e) => setQText(e.target.value)}
          /> <br />
          <TextField
            id='time-input'
            label="Time limit(s):"
            variant="standard"
            type="number"
            style={{ width: 360 }}
            value={time}
            onChange={(e) => setTime(e.target.value)}
          /> <br />
          <TextField
            id='points-input'
            label="Points:"
            variant="standard"
            type="number"
            style={{ width: 360 }}
            value={qPoint}
            onChange={(e) => setQPoint(e.target.value)}
          /> <br />
          <TextField
            id='url-input'
            label="Video/photo URL(optional):"
            variant="standard"
            style={{ width: 360 }}
            value={qOptionally}
            onChange={(e) => setQOptionally(e.target.value)}
          /> <br />
          <TextField
            select
            id='type-input'
            label="Type:"
            defaultValue="Single choice"
            variant="standard"
            value={qType}
            onChange={(e) => setQType(e.target.value)}
          >
            {type.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                onClick={(e) => setQType(e.target.value)}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField><br />
          { qType === 'multiple'
            ? <>
                <TextField
                  label="Answer 1:"
                  variant="standard"
                  style={{ width: 360 }}
                  value={answers[0] || ''}
                  onChange={(e) => handleAnswerChange(0, e.target.value)}
                /><br />
                <TextField
                  label="Answer 2:"
                  variant="standard"
                  style={{ width: 360 }}
                  value={answers[1] || ''}
                  onChange={(e) => handleAnswerChange(1, e.target.value)}
                /><br />
                <TextField
                  label="Answer 3 (optional):"
                  variant="standard"
                  style={{ width: 360 }}
                  value={answers[2] || ''}
                  onChange={(e) => handleAnswerChange(2, e.target.value)}
                /><br />
                <TextField
                  label="Answer 4 (optional):"
                  variant="standard"
                  style={{ width: 360 }}
                  value={answers[3] || ''}
                  onChange={(e) => handleAnswerChange(3, e.target.value)}
                /><br />
                <TextField
                  label="Answer 5 (optional):"
                  variant="standard"
                  style={{ width: 360 }}
                  value={answers[4] || ''}
                  onChange={(e) => handleAnswerChange(4, e.target.value)}
                /><br />
                <TextField
                  label="Answer 6 (optional):"
                  variant="standard"
                  style={{ width: 360 }}
                  value={answers[5] || ''}
                  onChange={(e) => handleAnswerChange(5, e.target.value)}
                />
              </>
            : <>
              <TextField
                id='answer-input'
                label="Answer:"
                variant="standard"
                style={{ width: 360 }}
                value={answers[0] || ''}
                onChange={(e) => handleAnswerChange(0, e.target.value)}
              /><br />
            </>
          }
          <br />
          <Button
            id='add-button'
            variant="outlined"
            size="small"
            color="success"
            onClick={() => creatNewQuestion()}
          >
            Add
          </Button><br />
        </div>
      )}
      <br />
      <Link to={'/dashboard'}>
        <Button
          id='return-to-dashboard-button'
          size='small'
          variant="outlined"
        >
          Return to Dashboard
        </Button>
      </Link>
      <br /><br />
      <DisplayQs />
    </>
  )
}

export default EditGame;
