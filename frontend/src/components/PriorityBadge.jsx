import React from 'react';

const PriorityBadge = ({ priority }) => {
  const getStyles = () => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return {
          bg: 'rgba(239, 68, 68, 0.15)',
          color: 'var(--color-high)',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        };
      case 'medium':
        return {
          bg: 'rgba(245, 158, 11, 0.15)',
          color: 'var(--color-medium)',
          border: '1px solid rgba(245, 158, 11, 0.3)'
        };
      case 'low':
      default:
        return {
          bg: 'rgba(16, 185, 129, 0.15)',
          color: 'var(--color-low)',
          border: '1px solid rgba(16, 185, 129, 0.3)'
        };
    }
  };

  const styles = getStyles();

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      backgroundColor: styles.bg,
      color: styles.color,
      border: styles.border
    }}>
      {priority || 'low'}
    </span>
  );
};

export default PriorityBadge;
