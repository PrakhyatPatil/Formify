import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaints, Complaint } from '../context/ComplaintContext';
import ComplaintCard from '../components/ComplaintCard';
import { FileStack, Plus, SlidersHorizontal, Inbox, Sparkles, Search } from 'lucide-react';
import toast from 'react-hot-toast';

type FilterType = 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW';

export default function Dashboard() {
  const navigate = useNavigate();
  const { state, setActiveComplaint } = useComplaints();
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComplaints = state.complaints.filter((c) => {
    const matchesFilter = filter === 'ALL' || c.priority === filter;
    const matchesSearch = searchQuery.trim() === '' ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleView = (complaint: Complaint) => {
    setActiveComplaint(complaint);
    navigate('/result');
  };

  return (
    <div className="page-container">
      <div className="page-inner" style={{ maxWidth: '900px' }}>

        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="dashboard-title-group">
            <div className="dashboard-icon-box">
              <FileStack />
            </div>
            <div className="dashboard-title-text">
              <h2 className="heading-md" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                My Complaints
                <span id="complaints-count-badge" className="count-badge">
                  {state.complaints.length} Total
                </span>
              </h2>
              <p className="text-xs text-secondary">
                Manage your converted Hinglish letters and track submission states.
              </p>
            </div>
          </div>

          <button
            id="dashboard-cta-new"
            onClick={() => navigate('/generate')}
            className="btn btn-primary btn-sm"
          >
            <Plus style={{ width: 16, height: 16 }} />
            <span>New Complaint</span>
          </button>
        </div>

        {/* Filter + Search Bar */}
        <div className="glass-card glass-card--no-hover filter-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div className="filter-label">
              <SlidersHorizontal />
              <span>Priority:</span>
            </div>
            <div className="filter-buttons">
              {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as FilterType[]).map((type) => (
                <button
                  key={type}
                  id={`filter-btn-${type.toLowerCase()}`}
                  type="button"
                  onClick={() => setFilter(type)}
                  className={`filter-btn filter-btn--${type.toLowerCase()} ${filter === type ? 'filter-btn--active' : ''}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="search-wrapper">
            <Search />
            <input
              id="search-complaints"
              type="text"
              placeholder="Search complaints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Complaints List */}
        <div id="complaints-list-container" className="complaints-list">
          {filteredComplaints.length === 0 ? (
            <div id="empty-state-card" className="glass-card empty-state">
              <div className="empty-state-icon">
                <Inbox />
              </div>
              <h3 className="heading-sm" style={{ marginBottom: '0.25rem' }}>No complaints found</h3>
              <p className="text-sm text-secondary" style={{ maxWidth: '380px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {filter === 'ALL' && !searchQuery.trim()
                  ? "You haven't converted any Hinglish complaints yet. Get started!"
                  : `No complaints match your current filters.`}
              </p>
              <button
                onClick={() => {
                  if (filter !== 'ALL' || searchQuery.trim()) {
                    setFilter('ALL');
                    setSearchQuery('');
                  } else {
                    navigate('/generate');
                  }
                }}
                className="btn btn-secondary btn-sm"
              >
                {filter !== 'ALL' || searchQuery.trim() ? 'Reset Filters' : 'Create First Complaint'}
              </button>
            </div>
          ) : (
            filteredComplaints.map((c) => (
              <ComplaintCard
                key={c.id}
                complaint={c}
                onView={handleView}
              />
            ))
          )}
        </div>

        {/* Info Box */}
        <div className="info-box">
          <div className="info-box-icon">
            <Sparkles />
          </div>
          <div>
            <h5 className="info-box-title">About States & Submissions</h5>
            <p className="info-box-desc">
              Toggle the status on each card (Pending / Submitted) to track your paperwork.
              Click a card to view the full document preview and download PDFs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
