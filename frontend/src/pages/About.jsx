import React from 'react';
import { Shield, Sparkles, Mic, FileDown, Layers } from 'lucide-react';

const About = () => {
  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: '800px' }}>
      <div className="glass-panel" style={{ padding: '40px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px', color: 'white' }}>
          About Formify
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>
          Formify is a modern web application designed to level the playing field for consumers. Writing formal, authoritative letters to corporations can be intimidating and time-consuming. Formify simplifies this by allowing you to speak your mind freely, transcribing your words, and using the power of Google Gemini AI to draft structured letters ready to print or export.
        </p>

        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: 'white', marginTop: '30px' }}>
          Key Features & Stack
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '10px', borderRadius: '8px' }}>
              <Mic size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: '700', color: 'white', fontSize: '15px' }}>Web Speech API Transcription</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
                Leverages the browser's built-in webkitSpeechRecognition engine for continuous speech transcription without recording delays.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(217, 70, 239, 0.1)', color: 'var(--accent)', padding: '10px', borderRadius: '8px' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: '700', color: 'white', fontSize: '15px' }}>Google Gemini AI</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
                Powered by `gemini-2.5-flash` via the FastAPI backend to refine and structure natural descriptions into legal, polite, and persuasive formal prose.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-low)', padding: '10px', borderRadius: '8px' }}>
              <FileDown size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: '700', color: 'white', fontSize: '15px' }}>FPDF2 Engine</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
                Formats and drafts documents to high-resolution downloadable PDF files with visual headers, priority-colored accent tags, and official layouts.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'white', padding: '10px', borderRadius: '8px' }}>
              <Layers size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: '700', color: 'white', fontSize: '15px' }}>Premium Vanilla CSS styling</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
                Uses beautiful glassmorphic elements, modern gradients, HSL custom color spaces, and responsive layout structures for a state-of-the-art consumer dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
