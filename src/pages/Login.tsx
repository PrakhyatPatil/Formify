import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import { User, Mail, CreditCard, Home, GraduationCap, ArrowRight, ShieldCheck, LogOut, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { state, updateProfile, logout } = useComplaints();
  const profile = state.studentProfile;

  const [fullName, setFullName] = useState(profile.fullName);
  const [rollNumber, setRollNumber] = useState(profile.rollNumber);
  const [blockRoom, setBlockRoom] = useState(profile.blockRoom);
  const [department, setDepartment] = useState(profile.department);
  const [email, setEmail] = useState(profile.email);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('Name cannot be empty!');
      return;
    }

    updateProfile({
      fullName,
      rollNumber,
      blockRoom,
      department,
      email,
      isLoggedIn: true,
    });
    toast.success('Student credentials synced!');
    navigate('/generate');
  };

  const handleResetToDemo = () => {
    const demo = {
      fullName: 'Rahul Kumar',
      rollNumber: 'INC/2024/7012',
      blockRoom: 'Hostel Block D, Room 204',
      department: 'Computer Science & Engineering',
      email: 'rahul.kumar24@college.edu',
      isLoggedIn: true,
    };
    setFullName(demo.fullName);
    setRollNumber(demo.rollNumber);
    setBlockRoom(demo.blockRoom);
    setDepartment(demo.department);
    setEmail(demo.email);
    updateProfile(demo);
    toast.success('Demo data loaded!');
  };

  const handleLogoutToggle = () => {
    logout();
    toast.success('Logged out. Formify will use generic indicators.');
  };

  return (
    <div id="login-page-root" className="login-container">
      <div className="login-inner">

        {/* Header */}
        <div className="login-header">
          <h2 className="heading-md">
            {profile.isLoggedIn ? 'Applicant Identity Vault' : 'Applicant Onboarding'}
          </h2>
          <p className="text-xs text-secondary" style={{ marginTop: '0.35rem', lineHeight: 1.6 }}>
            Formify embeds your roll numbers and course indexes directly into your generated documents.
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card glass-card--no-hover" style={{ padding: '1.5rem' }}>
          {profile.isLoggedIn && (
            <div className="active-badge" style={{ marginBottom: '1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 style={{ width: 16, height: 16 }} />
                Active Profile
              </span>
              <button
                type="button"
                onClick={handleLogoutToggle}
                className="btn btn-danger btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <LogOut style={{ width: 12, height: 12 }} />
                Logout
              </button>
            </div>
          )}

          <form onSubmit={handleSave} className="login-form">
            <div className="input-group">
              <label className="input-label">
                <User /> Full Name (Signature)
              </label>
              <input
                id="profile-fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Rahul Kumar"
                className="input-field"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">
                <CreditCard /> Student Roll / ID
              </label>
              <input
                id="profile-rollNumber"
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="INC/2026/0942"
                className="input-field"
                required
              />
            </div>

            <div className="login-form-grid">
              <div className="input-group">
                <label className="input-label">
                  <GraduationCap /> Department
                </label>
                <input
                  id="profile-department"
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Mechanical Engineering"
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">
                  <Home /> Room & Block
                </label>
                <input
                  id="profile-blockRoom"
                  type="text"
                  value={blockRoom}
                  onChange={(e) => setBlockRoom(e.target.value)}
                  placeholder="Hostel B, Room 405"
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">
                <Mail /> Email Address
              </label>
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student.name@university.edu.in"
                className="input-field"
                required
              />
            </div>

            <div className="login-actions">
              <button id="profile-save-btn" type="submit" className="btn btn-primary btn-full">
                <span>Save Profile Credentials</span>
                <ArrowRight className="btn-arrow" style={{ width: 16, height: 16 }} />
              </button>

              <div className="login-alt-row">
                <button
                  id="profile-demo-btn"
                  type="button"
                  onClick={handleResetToDemo}
                  className="btn btn-secondary btn-sm"
                >
                  Load Demo Data
                </button>
                <button
                  id="profile-skip-btn"
                  type="button"
                  onClick={() => navigate('/generate')}
                  className="btn btn-ghost btn-sm"
                  style={{ border: '1px solid var(--border-primary)' }}
                >
                  Skip to Generator
                </button>
              </div>
            </div>
          </form>

          <div className="privacy-note">
            <ShieldCheck />
            <p>
              Your data is stored locally in your browser's localStorage and never sent to external servers except during document generation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
