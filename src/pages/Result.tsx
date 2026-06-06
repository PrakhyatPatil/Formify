import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaints, Complaint } from '../context/ComplaintContext';
import PriorityBadge from '../components/PriorityBadge';
import LetterPreview from '../components/LetterPreview';
import { ArrowLeft, FileText, ShieldAlert, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Result() {
  const navigate = useNavigate();
  const { state, setActiveComplaint, updateStatus } = useComplaints();

  const complaint: Complaint | null =
    state.activeComplaint || (state.complaints.length > 0 ? state.complaints[0] : null);

  useEffect(() => {
    if (!complaint) {
      toast.error('No complaint selected. Redirecting.');
      navigate('/');
    }
  }, [complaint, navigate]);

  if (!complaint) {
    return (
      <div className="page-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="section-center">
          <p className="text-sm text-secondary" style={{ marginBottom: '1rem' }}>No active complaint selected.</p>
          <button onClick={() => navigate('/generate')} className="btn btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleReset = () => {
    setActiveComplaint(null);
    navigate('/generate');
  };

  const handleStatusSubmit = () => {
    const nextStatus = complaint.status === 'Pending' ? 'Submitted' : 'Pending';
    updateStatus(complaint.id, nextStatus);
    toast.success(`Complaint status marked as ${nextStatus}!`);
  };

  return (
    <div className="page-container">
      <div className="page-inner page-inner--wide">

        {/* Header */}
        <div className="result-header">
          <button
            id="back-btn-to-dashboard"
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary btn-sm"
          >
            <ArrowLeft style={{ width: 16, height: 16 }} />
            <span>Back to Complaints</span>
          </button>

          <div className="result-meta">
            <PriorityBadge priority={complaint.priority} />
            <span className="badge badge--info badge--dept">
              Dept: {complaint.department}
            </span>
          </div>
        </div>

        {/* Two panel grid */}
        <div className="result-grid">

          {/* Left panel */}
          <div className="result-sidebar">

            {/* Original Input Card */}
            <div id="original-hinglish-card" className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                <h3 className="label-tag" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                  <FileText style={{ width: 16, height: 16, color: 'var(--accent-blue)' }} />
                  Your Hinglish Input
                </h3>
                <span className="text-xs text-muted">{complaint.dateSubmitted}</span>
              </div>
              <blockquote className="blockquote">
                "{complaint.originalText}"
              </blockquote>
              <div style={{ marginTop: '0.75rem', padding: '0.6rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span className="text-xs" style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.15rem' }}>Signatory Author:</span>
                <span className="text-xs text-secondary">{complaint.studentName} (Student ID)</span>
              </div>
            </div>

            {/* AI Insights Card */}
            <div id="ai-insights-card" className="insights-card">
              <h3 className="label-tag" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-blue)' }}>
                <ShieldAlert style={{ width: 16, height: 16 }} />
                AI Priority Analysis
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="meta-item">
                  <span className="meta-item-label">Assigned Priority:</span>
                  <span className="meta-item-value" style={{ color: complaint.priority === 'HIGH' ? 'var(--accent-red)' : complaint.priority === 'MEDIUM' ? 'var(--accent-yellow)' : 'var(--accent-green)', fontWeight: 800 }}>
                    {complaint.priority}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-item-label">Urgency Detail:</span>
                  <p className="text-xs" style={{ color: 'var(--text-primary)', lineHeight: 1.6, marginTop: '0.15rem' }}>
                    {complaint.urgencyReason || 'Based on campus guidelines.'}
                  </p>
                </div>
                <div className="meta-item">
                  <span className="meta-item-label">Location:</span>
                  <div style={{ display: 'inline-block', marginTop: '0.2rem', padding: '0.3rem 0.6rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 600 }}>
                    {complaint.location}
                  </div>
                </div>
              </div>

              <button
                id="btn-status-toggle-main"
                onClick={handleStatusSubmit}
                type="button"
                className="btn btn-secondary btn-full btn-sm"
                style={{ marginTop: '0.5rem' }}
              >
                <CheckCircle2 style={{ width: 16, height: 16 }} />
                <span>Mark as {complaint.status === 'Submitted' ? 'Pending' : 'Submitted'}</span>
              </button>
            </div>
          </div>

          {/* Right panel: Letter Preview */}
          <div>
            <LetterPreview
              complaint={complaint}
              onReset={handleReset}
              onRefreshStatus={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
