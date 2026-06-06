import { useComplaints, Complaint } from '../context/ComplaintContext';
import PriorityBadge from './PriorityBadge';
import { Calendar, MapPin, CheckCircle, Clock, Trash2, ArrowRight } from 'lucide-react';

interface ComplaintCardProps {
  complaint: Complaint;
  onView: (complaint: Complaint) => void;
}

export default function ComplaintCard({ complaint, onView }: ComplaintCardProps & { key?: string }) {
  const { updateStatus, deleteComplaint } = useComplaints();

  const handleStatusToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus = complaint.status === 'Pending' ? 'Submitted' : 'Pending';
    updateStatus(complaint.id, nextStatus);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteComplaint(complaint.id);
  };

  const getDeptBadgeClass = (dept: string) => {
    switch (dept) {
      case 'Hostel Maintenance': return 'badge--info';
      case 'IT Support': return 'badge--info';
      case 'Academic Office': return 'badge--warning';
      case 'Security': return 'badge--high';
      case 'Mess/Canteen': return 'badge--warning';
      default: return 'badge--info';
    }
  };

  return (
    <div
      id={`complaint-card-${complaint.id}`}
      onClick={() => onView(complaint)}
      className="glass-card glass-card--interactive complaint-card"
    >
      <div className="complaint-card-body">
        <div className="complaint-card-tags">
          <PriorityBadge priority={complaint.priority} />
          <span className={`badge badge--dept ${getDeptBadgeClass(complaint.department)}`}>
            {complaint.department}
          </span>
          <span className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto' }}>
            <Calendar style={{ width: 12, height: 12 }} />
            {complaint.dateSubmitted}
          </span>
        </div>

        <h4 className="complaint-card-title">{complaint.subject}</h4>

        <p className="complaint-card-location">
          <MapPin />
          {complaint.location}
        </p>

        <p className="complaint-card-preview">
          "{complaint.originalText}"
        </p>
      </div>

      <div className="complaint-card-actions">
        <button
          id={`status-toggle-${complaint.id}`}
          onClick={handleStatusToggle}
          type="button"
          className={`status-toggle ${complaint.status === 'Submitted' ? 'status-toggle--submitted' : 'status-toggle--pending'}`}
          title="Click to toggle status"
        >
          {complaint.status === 'Submitted' ? (
            <>
              <CheckCircle />
              <span>Submitted</span>
            </>
          ) : (
            <>
              <Clock className="animate-pulse" />
              <span>Pending</span>
            </>
          )}
        </button>

        <button
          id={`delete-btn-${complaint.id}`}
          onClick={handleDelete}
          type="button"
          className="btn-danger"
          title="Delete Complaint"
        >
          <Trash2 style={{ width: 16, height: 16 }} />
        </button>

        <div className="card-arrow">
          <ArrowRight style={{ width: 16, height: 16 }} />
        </div>
      </div>
    </div>
  );
}
