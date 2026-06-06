import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, Mic, LayoutDashboard, Info } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="glass-panel" style={{
      margin: '20px auto',
      maxWidth: '1100px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 30px',
      borderRadius: 'var(--radius-lg)',
      position: 'sticky',
      top: '20px',
      zIndex: 100
    }}>
      <NavLink to="/" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
        color: 'white',
        fontSize: '22px',
        fontWeight: '800',
        letterSpacing: '0.5px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <FileText size={20} />
        </div>
        <span>Form<span className="gradient-text">ify</span></span>
      </NavLink>

      <div style={{ display: 'flex', gap: '8px' }}>
        <NavLink 
          to="/generate" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          style={navLinkStyle}
        >
          <Mic size={16} />
          <span>Write Complaint</span>
        </NavLink>

        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          style={navLinkStyle}
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink 
          to="/about" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          style={navLinkStyle}
        >
          <Info size={16} />
          <span>About</span>
        </NavLink>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-muted);
          text-decoration: none;
          padding: 8px 16px;
          border-radius: var(--radius-md);
          font-weight: 500;
          font-size: 14px;
          transition: var(--transition);
        }
        .nav-link:hover {
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.05);
        }
        .nav-link.active {
          color: white;
          background: var(--primary-light);
          border: 1px solid rgba(99, 102, 241, 0.3);
        }
      `}} />
    </nav>
  );
};

const navLinkStyle = {
  textDecoration: 'none',
};

export default Navbar;
