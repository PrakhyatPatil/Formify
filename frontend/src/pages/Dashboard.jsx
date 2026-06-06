import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import ComplaintCard from '../components/ComplaintCard';
import { FilePlus, Search, Archive } from 'lucide-react';

const Dashboard = () => {
  const { complaints, deleteComplaint, setCurrentComplaint, fetchComplaints } = useComplaints();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleView = (complaint) => {
    setCurrentComplaint(complaint);
    navigate('/result');
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || c.priority?.toLowerCase() === filterPriority.toLowerCase();
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Header bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '30px'
      }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'white' }}>Your Dashboard</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Manage, download, and review your compiled complaint files.
          </p>
        </div>

        <button onClick={() => navigate('/generate')} className="btn-primary" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <FilePlus size={16} />
          <span>New Complaint</span>
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="glass-panel" style={{
        padding: '16px 24px',
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '30px'
      }}>
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px', position: 'relative' }}>
          <Search size={16} style={{ color: 'var(--text-muted)', position: 'absolute', left: '12px' }} />
          <input
            type="text"
            placeholder="Search complaints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 10px 10px 38px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid var(--border-glass)',
              color: 'white',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        {/* Priority Filter */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              style={{
                padding: '8px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'capitalize',
                background: filterPriority === p ? 'var(--primary-light)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${filterPriority === p ? 'var(--primary)' : 'var(--border-glass)'}`,
                color: filterPriority === p ? 'white' : 'var(--text-muted)'
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* List / Grid of Cards */}
      {filteredComplaints.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Archive size={48} style={{ opacity: 0.3, marginBottom: '16px', color: 'var(--text-muted)' }} />
          <h3>No complaints found</h3>
          <p style={{ fontSize: '14px', marginTop: '6px' }}>
            {searchTerm || filterPriority !== 'all' ? 'Try adjusting your filters or search term.' : 'Click "New Complaint" to start.'}
          </p>
        </div>
      ) : (
        <div className="grid-cards" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {filteredComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              onView={handleView}
              onDelete={deleteComplaint}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
