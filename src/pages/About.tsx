import { useNavigate } from 'react-router-dom';
import { Mic, Cpu, FileCheck, Users, BookOpen, Award } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  const steps = [
    {
      step: '01',
      title: 'Speak / Type casual Hinglish',
      description: 'Input your complaint casually like you converse with friends. Speech-to-text converts spoken Hindi and Hinglish.',
      icon: <Mic style={{ width: 24, height: 24, color: 'var(--accent-blue)' }} />,
    },
    {
      step: '02',
      title: 'AI analyzes & formats layouts',
      description: 'Gemini processes context, categorizes departments, estimates priority, and composes an elegant formal letter.',
      icon: <Cpu style={{ width: 24, height: 24, color: 'var(--accent-red)' }} />,
    },
    {
      step: '03',
      title: 'Download verified digital PDF',
      description: 'Get an officially formatted document with authority heads, subjects, date stamp, ready to download and submit.',
      icon: <FileCheck style={{ width: 24, height: 24, color: 'var(--accent-green)' }} />,
    },
  ];

  const techStack = [
    { name: 'React 19 & Vite', desc: 'Fast client UI' },
    { name: 'React Router SPA', desc: 'Client-side routing' },
    { name: 'Vanilla CSS', desc: 'Glassmorphism dark UI' },
    { name: 'Gemini 2.5 Flash', desc: 'AI Translation Engine' },
    { name: 'Express Backend', desc: 'Secure API proxy' },
    { name: 'PDFKit Renderer', desc: 'On-demand PDF compiler' },
  ];

  return (
    <div className="page-container">
      <div className="page-inner" style={{ maxWidth: '900px', gap: '2rem', padding: '1.5rem 0' }}>

        {/* Hero */}
        <div className="about-hero">
          <h2 className="heading-lg">Democratizing Campus Communication</h2>
          <p className="about-tagline">"You Speak. We Write It Officially."</p>
          <p className="text-base text-secondary" style={{ lineHeight: 1.7 }}>
            Institutional systems inside Indian colleges demand rigorous formal standards which exclude students
            facing language bottlenecks. Formify bridges this divide, giving everyone equal power to file administrative
            materials and report campus incidents — without English fluency anxiety.
          </p>
        </div>

        {/* 3-Step Pipeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 className="label-tag" style={{ textAlign: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', color: 'var(--text-secondary)' }}>
            The Document Assembly Pipeline
          </h3>

          <div className="about-steps">
            {steps.map((st, i) => (
              <div key={i} id={`about-pipeline-step-${st.step}`} className="glass-card about-step-card">
                <div className="about-step-header">
                  <div className="about-step-icon">{st.icon}</div>
                  <span className="about-step-num">{st.step}</span>
                </div>
                <h4 className="heading-sm" style={{ marginBottom: '0.35rem' }}>{st.title}</h4>
                <p className="text-xs text-secondary" style={{ lineHeight: 1.6 }}>{st.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="glass-card glass-card--no-hover" style={{ padding: '1.5rem' }}>
          <h3 className="label-tag text-secondary" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            Integrated Web Architecture (Tech Stack)
          </h3>
          <div className="tech-stack-grid">
            {techStack.map((tech, idx) => (
              <div key={idx} className="tech-chip">
                <span className="tech-chip-name">{tech.name}</span>
                <span className="tech-chip-desc">{tech.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: 'var(--accent-blue-subtle)', color: 'var(--accent-blue)' }}>
              <Users />
            </div>
            <div>
              <div className="stat-value" style={{ color: 'var(--accent-blue)' }}>100%</div>
              <div className="stat-label">Active Resolution</div>
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: 'var(--accent-red-subtle)', color: 'var(--accent-red)' }}>
              <BookOpen />
            </div>
            <div>
              <div className="stat-value" style={{ color: 'var(--accent-red)' }}>0 SEC</div>
              <div className="stat-label">English Needed</div>
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: 'var(--accent-green-subtle)', color: 'var(--accent-green)' }}>
              <Award />
            </div>
            <div>
              <div className="stat-value" style={{ color: 'var(--accent-green)' }}>A4 PDF</div>
              <div className="stat-label">Print Ready</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
          <button
            id="about-back-to-writing"
            onClick={() => navigate('/generate')}
            className="btn btn-primary btn-lg"
          >
            Create Your Complaint Document Now
          </button>
        </div>
      </div>
    </div>
  );
}
