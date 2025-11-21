import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Upload from './components/Upload';
import ThankYou from './components/ThankYou';
import History from './components/History';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;
