import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Modal, Typography, LinearProgress } from '@mui/material';
import Circle from './Circle';
import CloseIcon from '@mui/icons-material/Close';

function App() {
  const [isOpen, setIsOpen] = useState(true); // Initial modal open
  const [showResults, setShowResults] = useState(false); // Test results modal
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
        setTimer((prevTimer) => {
          if (prevTimer === 0) {
            clearInterval(intervalId);
            setIsOpen(false); // Close instructions modal
            setShowResults(true); // Show test results modal
            setIsTestRunning(false);
            setTestStarted(false); // Reset test started flag
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isTestRunning, timer]);

  const handleStart = () => {
    if(timer===0){
      setShowResults(false);
      setTimer(60);
      setTestResults({
        correctAnswers: 0,
        incorrectAnswers: 0,
        averageTimePerQuestion: 0,
        totalQuestionsAnswered: 0,
      }); 
    }
    setIsTestRunning(true);
    setTestStarted(true); // Test has been started
    setIsOpen(false); // Close instructions modal
  };

  const handlePause = () => {
    setIsTestRunning(false);
  };

  const handleReset = () => {
    setShowResults(false);
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
      <Typography variant="h5" style={{ marginTop: '20px', color: timer <= 10 ? 'red' : 'inherit' ,fontFamily:'poppins',  fontSize: '1.8em', fontWeight: '500'}}>
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
          size="large"
          sx={{
            minWidth: '150px',
            minHeight: '50px',
            fontSize: '1.5rem',
            fontFamily:'poppins',
            backgroundColor: '#01959a',
            "&:hover": {
              backgroundColor: '#0c8185', // Set the same background color for hover state
            }
          }}
        >
          {isTestRunning ? 'Pause Test' : (testStarted ? 'Resume Test' : 'Start Test')}
        </Button>
       
      </Box>
      <Modal open={isOpen} onClose={() => setIsOpen(false)} >
        <div style={{ width: '40vw', margin: 'auto', marginTop: '200px', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', position: 'relative' ,border:'none',outline: 'none'}}>
          <IconButton
            aria-label="close"
            style={{ position: 'absolute', top: '5px', right: '5px' }}
            onClick={() => setIsOpen(false)}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" gutterBottom align="center" sx={{fontFamily:'poppins',  fontSize: '1.8em'}}>
           <u>Instructions</u> 
          </Typography>
          <Typography variant="body1" gutterBottom align="left" sx={{fontFamily:'poppins',  fontSize: '1.2em'}}>
            1. Press 'L' to load the color on screen.
          </Typography>
          <Typography variant="body1" gutterBottom align="left" sx={{fontFamily:'poppins',  fontSize: '1.2em'}}>
            2. Press 'R', 'G', 'Y', and 'B' buttons corresponding to the color on the screen to answer.
          </Typography>
          <Typography variant="body1" gutterBottom align="left" sx={{fontFamily:'poppins',  fontSize: '1.2em'}}>
            3. The total time of the test is 1 minute.
          </Typography>
          <Typography variant="body1" gutterBottom align="left" sx={{fontFamily:'poppins',  fontSize: '1.2em'}}>
            4. Once the timer expires, results will be shown on the screen.
          </Typography>
          <div style={{ textAlign: 'center', marginTop: '20px' }} >
            <Button variant="contained" onClick={() => setIsOpen(false)} sx={{fontFamily:'poppins',  fontSize: '1.2em', minWidth: '60px', minHeight: '15px',backgroundColor: '#01959a',
            "&:hover": {
              backgroundColor: '#0c8185', // Set the same background color for hover state
            }}}>
              Proceed
            </Button>
          </div>
        </div>
      </Modal>
      <Modal open={showResults} onClose={() => setShowResults(false)}>
        <div style={{ width: '300px', margin: 'auto', marginTop: '200px', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', position: 'relative',outline: 'none' }}>
          <IconButton
            aria-label="close"
            style={{ position: 'absolute', top: '5px', right: '5px' }}
            onClick={() => setShowResults(false)}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" gutterBottom align="center" sx={{fontFamily:'poppins',  fontSize: '1.5em'}}>
            <u>Test Results</u>
          </Typography>
          <Typography sx={{fontFamily:'poppins',  fontSize: '1.2em'}}>Correct Answers: {testResults.correctAnswers}</Typography>
          <Typography sx={{fontFamily:'poppins',  fontSize: '1.2em'}}>Incorrect Answers: {testResults.incorrectAnswers}</Typography>
          <Typography sx={{fontFamily:'poppins',  fontSize: '1.2em'}}>Total Questions Answered: {testResults.totalQuestionsAnswered}</Typography>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button variant="contained" onClick={handleReset} sx={{fontFamily:'poppins',  fontSize: '1.2em', minWidth: '60px', minHeight: '15px',backgroundColor: '#01959a',
            "&:hover": {
              backgroundColor: '#0c8185', // Set the same background color for hover state
            }}}>
              Start New Test
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;
