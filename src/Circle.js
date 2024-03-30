import React, { useState, useEffect } from 'react';

const Circle = ({ handleColorSelection }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentColor, setCurrentColor] = useState('blue'); // Default color
  const [startTime, setStartTime] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [numQuestions, setNumQuestions] = useState(0);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'l') {
        setIsVisible(true);
        setStartTime(Date.now()); // Record start time
        generateRandomColor();
      } else if (['r', 'g', 'y', 'b'].includes(event.key.toLowerCase())) {
        const selectedColor = event.key.toLowerCase();
        const colorMap = {
          'r': 'red',
          'g': 'green',
          'b': 'blue',
          'y': 'yellow'
        };
        handleColorSelection(currentColor === colorMap[selectedColor] ? 'correct' : 'incorrect');
        setIsVisible(false);
        const endTime = Date.now();
        const elapsed = (endTime - startTime) / 1000; // Calculate elapsed time in seconds
        setTotalTime((prevTotal) => prevTotal + elapsed);
        setNumQuestions((prevNum) => prevNum + 1);
        setCurrentColor(colorMap[selectedColor]); // Update current color
      } else {
        handleColorSelection('incorrect'); // Count any other key as incorrect
        setIsVisible(false);
      }
    };

    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [currentColor, startTime, handleColorSelection]);

  const generateRandomColor = () => {
    const colors = ['red', 'green', 'blue', 'yellow'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setCurrentColor(randomColor);
  };

  return (
    <div style={{ display: isVisible ? 'block' : 'none', textAlign: 'center' }}>
      <div
        id="circle"
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          backgroundColor: currentColor,
          margin: '20px auto'
        }}
      ></div>
    </div>
  );
};

export default Circle;
