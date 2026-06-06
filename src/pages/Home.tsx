import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import MicButton from '../components/MicButton';
import ExampleChip from '../components/ExampleChip';
import { Keyboard, Mic, Sparkles, User, FileText, Send, Tag, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Product/Device',
  'Billing',
  'Support',
  'Delivery',
  'Hostel',
  'Academics',
  'Fees',
  'Infrastructure',
  'Food',
  'Other',
];

const TEMPLATES = [
  { tag: 'Hostel', text: 'Hostel room ka AC kharab hai 3 din se, warden ko bataya par kuch nahi hua.' },
  { tag: 'Delivery', text: 'Mera parcel delivery 5 din se pending hai, tracking update nahi aa raha.' },
  { tag: 'Support', text: 'Broadband internet 2 din se down hai, complaint register hui par fix nahi hua.' },
  { tag: 'Billing', text: 'Meri fees ka payment successful hua but portal pe pending dikh raha hai.' },
  { tag: 'Academics', text: 'Sir ne mujhe fail kar diya bina reason ke, internal marks galat diye hain.' },
  { tag: 'Food', text: 'Canteen ka khana bahut kharab hai, 2 students sick ho gaye khaane se.' },
];

export default function Home() {
  const navigate = useNavigate();
  const { generateComplaint, state } = useComplaints();
  const profile = state.studentProfile;

  const [activeTab, setActiveTab] = useState<'type' | 'speak'>('type');
  const [complaintText, setComplaintText] = useState('');
  const [studentName, setStudentName] = useState(profile.fullName || 'Rahul Kumar');
  const [category, setCategory] = useState('Other');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [processing, setProcessing] = useState(false);

  React.useEffect(() => {
    if (profile.fullName) {
      setStudentName(profile.fullName);
    }
  }, [profile.fullName]);

  const handleTranscribe = (text: string) => {
    setComplaintText(text);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText.trim()) {
      toast.error('Apni baat likhiye ya boliye!');
      return;
    }

    setProcessing(true);
    toast.loading('AI Processing Hinglish text...');

    try {
      const result = await generateComplaint(complaintText, studentName, category, priority);
      toast.dismiss();
      if (result) {
        toast.success('Official Document generated successfully!');
        navigate('/result');
      } else {
        toast.error('AI Processing encountered an issue. Fallback generated.');
        navigate('/result');
      }
    } catch (err) {
      toast.dismiss();
      console.error(err);
      toast.error('Error generating complaint letter.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-inner page-inner--narrow" style={{ gap: '1.5rem' }}>

        {/* Header */}
        <div className="write-header">
          <div className="write-badge">
            <Sparkles style={{ width: 14, height: 14 }} />
            AI-Powered Student Support
          </div>
          <h2 className="heading-lg" style={{ marginBottom: '0.35rem' }}>
            You Speak. We Write It <span className="text-gradient">Officially.</span>
          </h2>
          <p className="text-sm text-secondary" style={{ maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            Formify translates your conversational Hinglish words into formatted, high-priority formal complaints instantly.
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card glass-card--no-hover" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          {processing && (
            <div className="processing-overlay">
              <div className="spinner" />
              <p className="text-sm text-accent animate-pulse" style={{ fontWeight: 700 }}>
                Gemini Translating Hinglish...
              </p>
              <span className="text-xs text-secondary">Applying administrative layouts...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="write-form">

            {/* Row 1: Student Name + Mode Toggle */}
            <div className="form-row">
              <div className="input-group">
                <label className="input-label">
                  <User />
                  Student Name (Signatory)
                </label>
                <input
                  id="input-student-name"
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="input-field"
                  placeholder="Rahul Kumar / Sneha Patel"
                  required
                />
              </div>

              <div className="mode-toggle">
                <button
                  id="tab-toggle-type"
                  type="button"
                  onClick={() => setActiveTab('type')}
                  className={`mode-toggle-btn ${activeTab === 'type' ? 'mode-toggle-btn--active' : ''}`}
                >
                  <Keyboard />
                  <span>Type</span>
                </button>
                <button
                  id="tab-toggle-speak"
                  type="button"
                  onClick={() => setActiveTab('speak')}
                  className={`mode-toggle-btn ${activeTab === 'speak' ? 'mode-toggle-btn--active' : ''}`}
                >
                  <Mic />
                  <span>Speak</span>
                </button>
              </div>
            </div>

            {/* Row 2: Category + Priority */}
            <div className="form-row">
              <div className="input-group">
                <label className="input-label">
                  <Tag />
                  Category
                </label>
                <select
                  id="select-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="select-field"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">
                  <AlertTriangle />
                  Priority
                </label>
                <div className="priority-selector">
                  {(['LOW', 'MEDIUM', 'HIGH'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`priority-option priority-option--${p.toLowerCase()} ${priority === p ? 'priority-option--selected' : ''}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input Area */}
            {activeTab === 'type' ? (
              <div className="input-group">
                <label className="input-label">
                  <FileText />
                  Enter Hinglish / Hindi Text
                </label>
                <textarea
                  id="textarea-complaint"
                  rows={5}
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  className="textarea-field"
                  placeholder="Apni baat likhiye... (e.g. 'sir hostel room 204 me pani bar bar ruk jata h')"
                />
              </div>
            ) : (
              <div className="voice-zone">
                <MicButton onTranscribe={handleTranscribe} />
              </div>
            )}

            {/* Quick Templates */}
            <div className="templates-box">
              <div className="templates-label">
                <Sparkles />
                Quick Templates:
              </div>
              <div className="templates-list">
                {TEMPLATES.map((t, i) => (
                  <ExampleChip
                    key={i}
                    text={`[${t.tag}] ${t.text.slice(0, 50)}...`}
                    onClick={() => {
                      setComplaintText(t.text);
                      setActiveTab('type');
                      // Try to match category
                      const matchedCat = CATEGORIES.find(c => c.toLowerCase() === t.tag.toLowerCase());
                      if (matchedCat) setCategory(matchedCat);
                      toast.success('Template filled!');
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="cta-generate-document"
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={processing}
            >
              <span>Generate Formal Complaint Letter</span>
              <Send className="btn-arrow" style={{ width: 20, height: 20 }} />
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
