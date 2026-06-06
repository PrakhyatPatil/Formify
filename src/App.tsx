import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ComplaintProvider } from './context/ComplaintContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Result from './pages/Result';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <ComplaintProvider>
      <Router>
        <div className="app-layout">
          <Navbar />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/generate" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/result" element={<Result />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>

          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(225, 22%, 14%)',
                color: 'hsl(0, 0%, 95%)',
                fontFamily: "'Inter', sans-serif",
                border: '1px solid hsla(225, 20%, 25%, 0.6)',
                borderRadius: '10px',
                fontSize: '13px',
                backdropFilter: 'blur(12px)',
              },
            }}
          />

          <footer className="footer">
            <div style={{ fontWeight: 500 }}>© 2026 Formify • Institutional Support System</div>
            <div className="footer-links">
              <span className="footer-link">Privacy</span>
              <span className="footer-link">Terms</span>
              <span className="footer-link">Contact</span>
            </div>
          </footer>
        </div>
      </Router>
    </ComplaintProvider>
  );
}
