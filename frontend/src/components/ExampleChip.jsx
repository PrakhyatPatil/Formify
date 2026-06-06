import React from 'react';

const ExampleChip = ({ label, category, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      style={{
        padding: '6px 12px',
        borderRadius: '20px',
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid var(--border-glass)',
        color: 'var(--text-muted)',
        fontSize: '12px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'var(--transition)'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
        e.currentTarget.style.color = 'white';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
        e.currentTarget.style.borderColor = 'var(--border-glass)';
        e.currentTarget.style.color = 'var(--text-muted)';
      }}
    >
      <span style={{ marginRight: '6px', fontSize: '10px', opacity: 0.6 }}>[{category}]</span>
      {label}
    </button>
  );
};

export default ExampleChip;
