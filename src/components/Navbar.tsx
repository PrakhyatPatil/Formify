import { Link, useLocation } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { useComplaints } from '../context/ComplaintContext';

export default function Navbar() {
  const location = useLocation();
  const { state } = useComplaints();
  const profile = state.studentProfile;

  const isActive = (path: string) => location.pathname === path;

  const getInitials = (name: string) => {
    if (!name) return 'ST';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="navbar">
      <Link id="logo-container" to="/" className="navbar-brand">
        <div className="navbar-logo">
          <FileText />
        </div>
        <div>
          <div className="navbar-title">Formify</div>
          <div className="navbar-subtitle">Official Document Generator</div>
        </div>
      </Link>

      <div className="navbar-links">
        <Link id="nav-item-landing" to="/" className={`navbar-link ${isActive('/') ? 'navbar-link--active' : ''}`}>
          Home
        </Link>
        <Link id="nav-item-generate" to="/generate" className={`navbar-link ${isActive('/generate') ? 'navbar-link--active' : ''}`}>
          Write
        </Link>
        <Link id="nav-item-dashboard" to="/dashboard" className={`navbar-link ${isActive('/dashboard') ? 'navbar-link--active' : ''}`}>
          Dashboard
        </Link>
        <Link id="nav-item-about" to="/about" className={`navbar-link ${isActive('/about') ? 'navbar-link--active' : ''}`}>
          About
        </Link>
      </div>

      <div className="navbar-right">
        <Link id="nav-avatar-link" to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="navbar-avatar">
            {profile.isLoggedIn ? getInitials(profile.fullName) : '?'}
          </div>
          <span className="navbar-user-name" style={{ display: 'none' }}>
            {profile.isLoggedIn ? profile.fullName : 'Guest'}
          </span>
        </Link>
      </div>
    </nav>
  );
}
