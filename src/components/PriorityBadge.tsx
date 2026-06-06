interface PriorityBadgeProps {
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const className = `badge badge--${priority.toLowerCase()}`;

  return (
    <span id={`priority-badge-${priority.toLowerCase()}`} className={className}>
      {priority}
    </span>
  );
}
