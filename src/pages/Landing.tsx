import { useNavigate } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import { Sparkles, ArrowRight, Mic, FileText, CheckCircle2, ShieldAlert, Cpu, Zap, LogIn } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { state } = useComplaints();
  const profile = state.studentProfile;

  return (
    <div id="landing-page-root" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-badge">
          <Sparkles />
          <span>India's #1 Hinglish-to-Formal Document Suite</span>
        </div>

        <h1 className="landing-headline">
          You Speak <span className="italic-text">Hinglish</span>.{' '}
          <br />
          We Write It <span className="text-gradient">Officially.</span>
        </h1>

        <p className="landing-subtitle">
          Indian students speak in raw, casual Hinglish. But campus administration demands formal English letterheads.
          Formify automatically builds flawless, professionally-formatted A4 complaint letters in seconds.
        </p>

        <div className="landing-cta-row">
          {profile.isLoggedIn ? (
            <button
              id="landing-cta-editor"
              onClick={() => navigate('/generate')}
              className="btn btn-primary btn-lg"
            >
              <span>Draft Your Complaint</span>
              <ArrowRight className="btn-arrow" style={{ width: 20, height: 20 }} />
            </button>
          ) : (
            <button
              id="landing-cta-login"
              onClick={() => navigate('/login')}
              className="btn btn-primary btn-lg"
            >
              <span>Setup Student Profile</span>
              <LogIn style={{ width: 20, height: 20 }} />
            </button>
          )}

          <button
            id="landing-cta-about"
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary btn-lg"
          >
            View Dashboard
          </button>
        </div>

        <div className="landing-status">
          <div className={`status-dot ${profile.isLoggedIn ? 'status-dot--active' : 'status-dot--inactive'}`} />
          <span>
            {profile.isLoggedIn ? (
              <>Signatory: <strong>{profile.fullName}</strong> ({profile.rollNumber})</>
            ) : (
              <>Status: <strong>Unregistered (Using Fallback)</strong></>
            )}
          </span>
          <button
            onClick={() => navigate('/login')}
            className="text-accent"
            style={{ fontWeight: 700, fontSize: '0.72rem', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {profile.isLoggedIn ? 'Edit' : 'Setup'}
          </button>
        </div>
      </section>

      {/* Pipeline Showcase */}
      <section className="pipeline-showcase">
        <div className="pipeline-grid">
          <div className="pipeline-step">
            <div>
              <div className="pipeline-step-badge">
                <span className="pipeline-step-num pipeline-step-num--1">Step 1</span>
                <span className="pipeline-step-label">Student Expresses Issue</span>
              </div>
              <h2 className="heading-md" style={{ marginBottom: '0.5rem' }}>
                Type or speak in mixed Hindustani language.
              </h2>
              <p className="text-sm text-secondary" style={{ lineHeight: 1.7, marginBottom: '1rem' }}>
                Tell us about electricity issues, broken water taps, or misprinted certificates. Zero jargon required.
              </p>
            </div>

            <div className="pipeline-demo-box">
              <div className="pipeline-demo-label">
                <Mic />
                <span>Conversational Input Specimen:</span>
              </div>
              <p className="pipeline-demo-text">
                "Sir library mein mera laptop bag chori ho gaya, table par rakha tha, warden se footage manga par wo support nahi kar rahe."
              </p>
            </div>
          </div>

          <div className="pipeline-step">
            <div>
              <div className="pipeline-step-badge">
                <span className="pipeline-step-num pipeline-step-num--2">Step 2</span>
                <span className="pipeline-step-label">AI Document Assembly</span>
              </div>
              <h2 className="heading-md" style={{ marginBottom: '0.5rem' }}>
                Instant translation to legal layout blocks.
              </h2>
              <p className="text-sm text-secondary" style={{ lineHeight: 1.7, marginBottom: '1rem' }}>
                We classify department channels, evaluate risk category, and structure standard English office paragraphs.
              </p>
            </div>

            <div className="pipeline-demo-box">
              <div className="pipeline-output-header">
                <span>GENERATED SUBJECT LETTER</span>
                <span style={{ color: 'var(--accent-red)' }}>HIGH PRIORITY</span>
              </div>
              <div style={{ fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <p><strong>To:</strong> The Chief Campus Security Directorate</p>
                <p><strong>Subject:</strong> Urgent Security Investigation Regarding Theft</p>
                <p className="text-xs text-secondary" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.35rem', textAlign: 'justify', lineHeight: 1.5 }}>
                  "This letter serves to officially notify the department of a security breach involving the theft of an unsecured laptop device from the student reading area..."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="section-center" style={{ marginBottom: '2.5rem' }}>
            <h2 className="heading-lg" style={{ marginBottom: '0.5rem' }}>
              Features Built For College Demands
            </h2>
            <p className="text-sm text-secondary" style={{ maxWidth: '500px' }}>
              Elegant structures and strict alignment to administrative layout regulations.
            </p>
          </div>

          <div className="features-grid">
            {[
              { icon: <Mic />, title: 'Hinglish Speech Transcription', desc: 'Speak directly into the microphone. Our system transcribes Hindi-English structures with precision.', color: 'var(--accent-blue)' },
              { icon: <FileText />, title: 'Professional PDF Compilation', desc: 'Render pixel-perfect A4 letters with formal alignment, subjects, signing margins, and stamp layout.', color: 'var(--accent-green)' },
              { icon: <Cpu />, title: 'Gemini Smart Translation', desc: 'Gemini model generates official terminology fitting structural guidelines from casual keywords.', color: 'var(--accent-red)' },
              { icon: <ShieldAlert />, title: 'Auto Urgency Assessor', desc: 'Sorts issues through risk ratings (HIGH, MEDIUM, LOW) so authorities prioritize appropriately.', color: 'var(--accent-yellow)' },
              { icon: <CheckCircle2 />, title: 'State & Tracking Pipeline', desc: 'Save letters in the dashboard, mark state changes dynamically, and organize all complaints.', color: 'var(--accent-blue)' },
              { icon: <Zap />, title: 'Applicant Auth Suite', desc: 'Set up student ID signatory configuration to stamp PDFs instantly with your credentials.', color: 'var(--accent-purple)' },
            ].map((f, i) => (
              <div key={i} className="glass-card feature-card">
                <div className="feature-icon" style={{ color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 1.5rem' }}>
          <h2 className="heading-lg" style={{ marginBottom: '0.5rem' }}>
            Level the Playing Field in India's Campus Offices
          </h2>
          <p className="text-sm text-secondary" style={{ maxWidth: '550px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
            Language fluency should never stand in the way of student safety, hostel maintenance, and academic clearances.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/login')} className="btn btn-primary">
              <span>Set Up Profile</span>
              <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
            <button onClick={() => navigate('/generate')} className="btn btn-secondary">
              Skip, Try Generator
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
