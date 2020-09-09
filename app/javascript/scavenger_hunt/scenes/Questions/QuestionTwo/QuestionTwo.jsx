import React, { useState, useEffect } from 'react';
import { TextField, Grid } from '@material-ui/core';
import { Card, Button } from "react-bootstrap";
import { Clues } from '../../../data/staticData/clues';
import { check } from '../utility';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import { useGetUserAnswerQuery } from '../../../data/queries';
import { useSaveUserAnswerMutation } from '../../../data/mutations'

import './QuestionTwo.scss';

const  QuestionTwo = ({ progress, setActiveStep, completed, setCompleted  }) => {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading ] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { data: getUserAnswerQueryData, loading: getUserAnswerQueryLoading } = useGetUserAnswerQuery({
    variables: {
      question_number: 2
    }
  });

  const [saveUserAnswer, { loading: mutationLoading }] = useSaveUserAnswerMutation();

  useEffect(() => {
    if(!getUserAnswerQueryLoading) {
      let persisted_user_answer = getUserAnswerQueryData.currentUser.answerTo;
      if(persisted_user_answer){
        updateCompleted();
        setAnswer(persisted_user_answer);
      }
    }
  });

  const ans = Clues[1].answers[0];

  const updateCompleted = () => {
    const newCompleted = completed;
    newCompleted[progress].score = 1;
    newCompleted[progress].isCompleted = true;
    setCompleted(newCompleted);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setLoading(true);
    if (check(answer, ans)) {
      setToggle(true);
      updateCompleted();
      if(!mutationLoading){
        saveUserAnswer({
          variables: {
            "input": {
              "answerAttributes": {
                "questionNumber": 2,
                "answer": answer
              }
            }
          }
        });
      }
    } else {
      setToggle(false);
    }
    setLoading(false);
  }

  const handleChange = (event) => {
    setAnswer(event.target.value);
  }

  return (
    <Card>
      <Card.Header>
        <h1>Puzzle #2</h1>
      </Card.Header>
      <Card.Body>
        <form onSubmit={handleSubmit} >
          <div className="letter-box">
            What’s Science Society’s website? www.________.com
          </div>
          <div className="center-text">
            <TextField required
            disabled={completed[progress].isCompleted}
              id="question" 
              label="Answer" 
              variant="outlined"
              aria-describedby="Write your answer here" 
              value={answer}
              onChange={handleChange}
            />
          </div>
          <Grid container justify="center" alignItems="center">
          {
            (completed[progress].isCompleted || (submitted && toggle)) &&
              <CheckCircleOutlineIcon style={{ color: 'green', width: 50, height: 50}}/>
          }
          {
            submitted && !toggle &&
              <HighlightOffIcon style={{ color: 'red', width: 50, height: 50}}/>
          }
                 
          </Grid>
          {
           (!toggle && !completed[progress].isCompleted)  &&
            <div className="center-text">
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
              >
                Submit
              </Button>
            </div>
          }
        </form>
      </Card.Body>
    </Card>
  );
};

export { QuestionTwo };