import './App.css';

import React, { useState, useEffect } from 'react';         //useState is function that returns an array with two elements
function App() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    fetch('http://localhost:5000/')
    .then(response => response.text())
    .then(data => setMessage(data));
  }, []);

  return (
    <div className="App">
      <h1>Satellite Follower App</h1>
      <h2>{message}</h2>
    </div>
  );
}
export default App;