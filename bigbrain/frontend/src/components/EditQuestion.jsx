import React, {
  useEffect,
  useState
} from 'react';
import Api from '../Api';
import {
  TextField,
  Button,
  MenuItem
} from '@mui/material';
import {
  useNavigate,
  useParams
} from 'react-router-dom';

// display the edit question page
function EditQuestion () {
  const navigate = useNavigate()
  const { quizid, questionid } = useParams();
  const [questions, setQuestions] = useState([]);
  const [qType, setQType] = useState('');
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
  const [qText, setQText] = useState('');
  const [time, setTime] = useState('');
  const [qPoint, setQPoint] = useState('');
  const [qOptionally, setQOptionally] = useState('');
  const [answers, setAnswers] = useState([]);
  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  // fetch the questions and set the infos of the specific question
  useEffect(() => {
    const fetchQuestions = async () => {
      const api = new Api();
      const data = await api.getQuestions(quizid);
      if (data.error) {
        alert(data.error);
      } else {
        setQuestions(data.questions);
        const q = data.questions.find(item => item.id === questionid);
        if (q) {
          setQType(q.type);
          setQText(q.text);
          setTime(q.time_limit);
          setQPoint(q.points);
          setAnswers(q.answer);
        }
      }
    };
    fetchQuestions();
  }, [quizid, questionid]);

  // update the new infos
  const update = async () => {
    const newQuestions = [...questions];
    const index = newQuestions.findIndex(q => q.id === questionid);

    // update the infos
    newQuestions[index] = {
      id: questionid,
      type: qType,
      text: qText,
      time_limit: time,
      points: qPoint,
      answer: answers
    };

    // fetch new infos and go back to the previous page
    const api = new Api()
    await api.updateGame(quizid, JSON.stringify({
      questions: newQuestions,
    }))
      .then(data => {
        if (data.error) {
          alert(data.error);
        }
      })
    navigate(-1)
  };

  return (
    <>
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
        id='update-button'
        variant="outlined"
        size="small"
        color="success"
        onClick={update}
      >
        Update
      </Button>
      </div>
    </>
  )
}

export default EditQuestion;
