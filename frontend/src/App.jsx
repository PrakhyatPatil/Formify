import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ComplaintProvider } from './context/ComplaintContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import GeneratorPage from './pages/App';
import Result from './pages/Result';
import Dashboard from './pages/Dashboard';
import About from './pages/About';

function App() {
  return (
    <ComplaintProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/generate" element={<GeneratorPage />} />
              <Route path="/result" element={<Result />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ComplaintProvider>
  );
}

export default App;
