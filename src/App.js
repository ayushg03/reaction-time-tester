import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import Circle from './Circle';
import CloseIcon from '@mui/icons-material/Close';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [testResults, setTestResults] = useState({
    correctAnswers: 0,
    incorrectAnswers: 0,
    averageTimePerQuestion: 0,
    totalQuestionsAnswered: 0,
  });
  const [timer, setTimer] = useState(60);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isTestRunning) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) =>{
          if (prevTimer === 0) {
            clearInterval(intervalId);
            setIsOpen(true);
            setIsTestRunning(false);
            setTestStarted(false);
            return 0;
          }
          return prevTimer - 1
        });
        if (timer === 0) {
          clearInterval(intervalId);
          setIsOpen(true);
          setIsTestRunning(false);
          setTestStarted(false); // Reset test started flag
        }
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isTestRunning, timer]);

  const handleStart = () => {
    setIsTestRunning(true);
    setTestStarted(true); // Test has been started
  };

  const handlePause = () => {
    setIsTestRunning(false);
  };

  const handleReset = () => {
    setIsOpen(false);
    setIsTestRunning(false);
    setTimer(60);
    setTestResults({
      correctAnswers: 0,
      incorrectAnswers: 0,
      averageTimePerQuestion: 0,
      totalQuestionsAnswered: 0,
    });
    handleStart();
  };

  const handleColorSelection = (color) => {
    // Calculate elapsed time for the current question
    const elapsedTime = 60 - timer;
  
    // Update test statistics based on color selection
    setTestResults((prevResults) => ({
      ...prevResults,
      totalQuestionsAnswered: prevResults.totalQuestionsAnswered + 1,
      correctAnswers: color === 'correct' ? prevResults.correctAnswers + 1 : prevResults.correctAnswers,
      incorrectAnswers: color === 'correct' ? prevResults.incorrectAnswers : prevResults.incorrectAnswers + 1,
    }));
  };
  

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <Typography variant="h5" style={{ marginTop: '20px' }}>
        Time Left: {timer} seconds
      </Typography>
      {isTestRunning && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, marginTop: '100px', marginLeft: '100px' }}>
          <Circle handleColorSelection={handleColorSelection} />
        </Box>
      )}
      <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, margin: 'auto', marginBottom: '40px' }}>
        <Button
          variant="contained"
          onClick={isTestRunning ? handlePause : handleStart}
          size='large'
          sx={{
            minWidth: '150px',
            minHeight: '50px',
            fontSize: '1.5rem',
          }}
        >
          {isTestRunning ? 'Pause Test' : (testStarted ? 'Resume Test' : 'Start Test')}
        </Button>
      </Box>
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <div style={{ width: '300px', margin: 'auto', marginTop: '200px', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', position: 'relative' }}>
          <IconButton
            aria-label="close"
            style={{ position: 'absolute', top: '5px', right: '5px' }}
            onClick={() => setIsOpen(false)}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" gutterBottom align="center">
           Test Results
          </Typography>
          <Typography>Correct Answers: {testResults.correctAnswers}</Typography>
          <Typography>Incorrect Answers: {testResults.incorrectAnswers}</Typography>
          <Typography>Total Questions Answered: {testResults.totalQuestionsAnswered}</Typography>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button variant="contained" onClick={handleReset}>
              Start New Test
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;
