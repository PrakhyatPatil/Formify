import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import MicButton from '../components/MicButton';
import ExampleChip from '../components/ExampleChip';
import { Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

const App = () => {
  const { generateComplaint, isLoading } = useComplaints();
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Product');
  const [isRecording, setIsRecording] = useState(false);
  const navigate = useNavigate();

  const examples = [
    { label: "Delayed package delivery", category: "Delivery", desc: "My package was supposed to arrive last Friday. The tracking says it is in transit but there has been no update. I need this package immediately for a birthday gift." },
    { label: "Broadband internet outages", category: "Support", desc: "My internet has been dropping every 10 minutes for the last three days. I work from home and this is causing severe issues. Tech support has not resolved it." },
    { label: "Incorrect credit card charge", category: "Billing", desc: "I was billed twice for my subscription this month. I opened a dispute ticket last Monday but have received no reply from support yet." }
  ];

  const handleTranscript = (text) => {
    setDescription((prev) => (prev ? prev + ' ' + text : text));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    const response = await generateComplaint(description, priority, category);
    if (response) {
      navigate('/result');
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: '800px' }}>
      <div className="glass-panel" style={{ padding: '36px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: 'white' }}>
          Draft a New Complaint
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '30px' }}>
          Type your issue below, click the microphone icon to speak, or pick an example template to test.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Transcript input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>
              Describe your issue in detail
            </label>
            <div style={{ position: 'relative' }}>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={isRecording ? "Listening to your voice..." : "Detail your problem here, e.g. billing disputes, broken products..."}
                style={{
                  width: '100%',
                  height: '180px',
                  padding: '16px 80px 16px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0, 0, 0, 0.2)',
                  border: '1px solid var(--border-glass)',
                  color: 'white',
                  fontSize: '14px',
                  fontFamily: 'var(--font-sans)',
                  resize: 'none',
                  outline: 'none',
                  transition: 'var(--transition)'
                }}
              />
              <div style={{ position: 'absolute', right: '16px', bottom: '16px' }}>
                <MicButton onTranscript={handleTranscript} onStateChange={setIsRecording} />
              </div>
            </div>
            {isRecording && (
              <span style={{ fontSize: '12px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                <AlertCircle size={14} className="mic-active" style={{ borderRadius: '50%' }} />
                Recording voice input. Speak clearly.
              </span>
            )}
          </div>

          {/* Quick Examples */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>Quick Templates:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {examples.map((ex, i) => (
                <ExampleChip
                  key={i}
                  label={ex.label}
                  category={ex.category}
                  onClick={() => {
                    setDescription(ex.desc);
                    setCategory(ex.category);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Priority and Category Selectors */}
          <div className="grid-2">
            {/* Category Select */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-glass)',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="Product">Product / Device</option>
                <option value="Billing">Billing & Payment</option>
                <option value="Delivery">Delivery & Logistics</option>
                <option value="Support">Customer Support</option>
                <option value="Services">Services / Utilities</option>
                <option value="Other">Other Issues</option>
              </select>
            </div>

            {/* Priority Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>Priority Level</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['low', 'medium', 'high'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '13px',
                      fontWeight: '600',
                      textTransform: 'capitalize',
                      background: priority === p ? 'var(--primary-light)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${priority === p ? 'var(--primary)' : 'var(--border-glass)'}`,
                      color: priority === p ? 'white' : 'var(--text-muted)',
                      transition: 'var(--transition)'
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={isLoading || !description.trim()}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: (!description.trim()) ? 0.5 : 1,
                cursor: (!description.trim()) ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="spin" size={16} />
                  <span>Drafting formal document...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Generate Formal Complaint Letter</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}} />
    </div>
  );
};

export default App;
