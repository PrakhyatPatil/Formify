import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import LetterPreview from '../components/LetterPreview';
import PriorityBadge from '../components/PriorityBadge';
import { ArrowLeft, Send, Sparkles, CheckCircle2 } from 'lucide-react';

const Result = () => {
  const { currentComplaint } = useComplaints();
  const navigate = useNavigate();

  if (!currentComplaint) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '20px', color: 'white', marginBottom: '12px' }}>No active generated letter</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            Please draft a complaint first to view the generated output here.
          </p>
          <button onClick={() => navigate('/generate')} className="btn-primary">
            Draft Complaint
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Header and Back Link */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
        <button
          onClick={() => navigate('/generate')}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-glass)',
            color: 'white',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <span style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: '600', textTransform: 'uppercase' }}>
            Success
          </span>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Your Complaint Letter is Ready!
          </h2>
        </div>
      </div>

      {/* Main Grid: Letter Preview & Metadata details */}
      <div className="grid-result" style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '30px'
      }}>
        {/* Detail Panel */}
        <div className="glass-panel" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border-glass)' }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>DOCUMENT TITLE</span>
              <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>{currentComplaint.title}</h4>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>PRIORITY</span>
              <PriorityBadge priority={currentComplaint.priority} />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>ORIGINAL TRANSCRIPT</span>
            <p style={{
              color: 'var(--text-main)',
              fontSize: '14px',
              background: 'rgba(0, 0, 0, 0.15)',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid var(--border-glass)',
              lineHeight: '1.6'
            }}>{currentComplaint.description}</p>
          </div>

          {/* Letter preview */}
          <LetterPreview complaint={currentComplaint} />
        </div>
      </div>
    </div>
  );
};

export default Result;
