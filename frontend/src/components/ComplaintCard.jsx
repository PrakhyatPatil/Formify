import React from 'react';
import { Calendar, Tag, Trash2, ArrowRight } from 'lucide-react';
import PriorityBadge from './PriorityBadge';

const ComplaintCard = ({ complaint, onView, onDelete }) => {
  const formattedDate = new Date(complaint.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="glass-panel" style={{
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '12px',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>{complaint.title}</h3>
        <PriorityBadge priority={complaint.priority} />
      </div>

      <p style={{
        color: 'var(--text-muted)',
        fontSize: '14px',
        lineHeight: '1.6',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        height: '65px'
      }}>
        {complaint.description}
      </p>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '12px',
        borderTop: '1px solid var(--border-glass)',
        fontSize: '12px',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={12} />
            <span>{formattedDate}</span>
          </div>
          {complaint.category && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Tag size={12} />
              <span>{complaint.category}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onDelete(complaint.id)}
            style={{
              padding: '6px',
              borderRadius: '6px',
              background: 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-high)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            title="Delete complaint"
          >
            <Trash2 size={16} />
          </button>

          <button
            onClick={() => onView(complaint)}
            className="btn-primary"
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>View Letter</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
