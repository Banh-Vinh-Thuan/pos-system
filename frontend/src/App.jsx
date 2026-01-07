import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import POSScreen from './components/POSScreen';
import RealtimeScreen from './components/RealtimeScreen';

function App() {
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <nav style={{ 
          marginBottom: '20px', 
          padding: '10px', 
          backgroundColor: '#f0f0f0',
          borderRadius: '8px'
        }}>
          <Link to="/" style={{ marginRight: '20px', textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
            POS Screen
          </Link>
          <Link to="/realtime" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
            Realtime Orders
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<POSScreen />} />
          <Route path="/realtime" element={<RealtimeScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;