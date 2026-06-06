import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, FileText, ArrowRight, ShieldCheck, Sparkles, FileDown } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
      {/* Hero Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 16px',
        borderRadius: '30px',
        background: 'var(--primary-light)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        color: '#a5b4fc',
        fontSize: '13px',
        fontWeight: '600',
        marginBottom: '24px',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        <Sparkles size={14} />
        <span>Voice-to-Letter Generation</span>
      </div>

      {/* Hero Headings */}
      <h1 style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 'clamp(32px, 6vw, 64px)',
        fontWeight: '800',
        lineHeight: 1.1,
        maxWidth: '900px',
        margin: '0 auto 20px',
        color: 'white'
      }}>
        Transform Raw Audio complaints into <br />
        <span className="gradient-text">Professional Formal Letters</span>
      </h1>

      <p style={{
        color: 'var(--text-muted)',
        fontSize: 'clamp(16px, 2.5vw, 19px)',
        maxWidth: '650px',
        margin: '0 auto 36px',
        lineHeight: 1.6
      }}>
        Formify uses voice transcription and Gemini to draft structured, legally clear, and priority-coded consumer complaint letters in seconds.
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '80px' }}>
        <button onClick={() => navigate('/generate')} className="btn-primary" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '16px 32px',
          fontSize: '16px'
        }}>
          <span>Draft Your Complaint</span>
          <ArrowRight size={18} />
        </button>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary" style={{
          padding: '16px 32px',
          fontSize: '16px'
        }}>
          View Dashboard
        </button>
      </div>

      {/* Value Pillars / Feature Grid */}
      <div className="grid-3" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginTop: '20px'
      }}>
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'left' }}>
          <div style={{
            background: 'rgba(99, 102, 241, 0.1)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            marginBottom: '20px'
          }}>
            <Mic size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: 'white' }}>Speech Transcription</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
            Speak naturally. Our high-fidelity browser speech-to-text handles transcription so you don't have to type.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '30px', textAlign: 'left' }}>
          <div style={{
            background: 'rgba(217, 70, 239, 0.1)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent)',
            marginBottom: '20px'
          }}>
            <Sparkles size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: 'white' }}>Gemini AI Drafting</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
            Transform unstructured descriptions into polished, formal letters utilizing legal, professional, and clear tones.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '30px', textAlign: 'left' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-low)',
            marginBottom: '20px'
          }}>
            <FileDown size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: 'white' }}>PDF Export & Printing</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
            Export your polished letters directly to PDF or open a formatted layout for physical printing with a single click.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
