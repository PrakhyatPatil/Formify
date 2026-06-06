import { useState } from 'react';
import { Complaint } from '../context/ComplaintContext';
import { getPdfDownloadUrl } from '../services/api';
import { Printer, Copy, RefreshCw, Check, FileCheck } from 'lucide-react';
import toast from 'react-hot-toast';

interface LetterPreviewProps {
  complaint: Complaint;
  onReset: () => void;
  onRefreshStatus?: () => void;
}

export default function LetterPreview({ complaint, onReset }: LetterPreviewProps) {
  const [copied, setCopied] = useState(false);

  const getAuthorityTitle = (dept: string) => {
    switch (dept) {
      case 'Hostel Maintenance':
        return 'The Hostel Warden\nHostel Administration Office';
      case 'IT Support':
        return 'The Head of IT Infrastructure\nIT Services Wing';
      case 'Academic Office':
        return 'The Dean of Academic Affairs\nOffice of Academics';
      case 'Security':
        return 'The Chief Security Officer\nSecurity Control & Administration';
      case 'Mess/Canteen':
        return 'The Central Mess In-charge\nStudent Welfare & Dining';
      default:
        return 'The Registrar\nCampus Administrative Wing';
    }
  };

  const getFullLetterText = () => {
    const authority = getAuthorityTitle(complaint.department);
    return `Date: ${complaint.dateSubmitted}

To,
${authority}
Indian National College Campus (INCC)

Subject: ${complaint.subject}

Sir/Madam,

${complaint.formalBody}

Yours sincerely,
${complaint.studentName}
Location Associated: ${complaint.location}
Department Category: ${complaint.department}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFullLetterText());
    setCopied(true);
    toast.success('Official Letter copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Pop-up blocked. Please allow pop-ups.');
      return;
    }
    const authority = getAuthorityTitle(complaint.department);
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Formify - ${complaint.subject}</title>
        <style>
          body { font-family: 'Georgia', serif; padding: 60px; color: #1a1a1a; line-height: 1.8; max-width: 700px; margin: 0 auto; }
          .header { color: #1A73E8; font-size: 22px; font-weight: bold; margin-bottom: 4px; font-family: sans-serif; }
          .sub-header { color: #666; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px; font-family: sans-serif; }
          hr { border: none; border-top: 1.5px solid #ddd; margin: 20px 0; }
          .date { font-size: 13px; color: #333; margin-bottom: 20px; }
          .to { font-weight: bold; }
          .to-details { white-space: pre-line; font-size: 13px; line-height: 1.5; color: #444; margin-bottom: 20px; }
          .subject { font-weight: bold; font-size: 14px; color: #1A73E8; border-left: 3px solid #1A73E8; padding-left: 10px; margin-bottom: 20px; }
          .body { font-size: 14px; text-align: justify; margin-bottom: 40px; }
          .sign { font-weight: bold; }
          .name { color: #1A73E8; font-size: 16px; font-weight: bold; margin-top: 4px; font-family: sans-serif; }
          .meta { font-size: 11px; color: #888; margin-top: 10px; }
          .footer-line { margin-top: 60px; border-top: 1px solid #ddd; padding-top: 10px; font-size: 9px; color: #aaa; text-align: center; font-style: italic; }
          @media print { body { padding: 40px; } }
        </style>
      </head>
      <body>
        <div class="header">FORMIFY</div>
        <div class="sub-header">Campus Incident & Excellence Resolution System</div>
        <hr />
        <div class="date">Date: ${complaint.dateSubmitted}</div>
        <div class="to">To,</div>
        <div class="to-details">${authority}\nIndian National College Campus (INCC)</div>
        <div class="subject">Subject: ${complaint.subject}</div>
        <div class="body">Sir/Madam,<br/><br/>${complaint.formalBody}</div>
        <div class="sign">Yours sincerely,</div>
        <div class="name">${complaint.studentName}</div>
        <div class="meta">Location: ${complaint.location} | Dept: ${complaint.department}</div>
        <div class="footer-line">This letter was generated digitally via Formify (Hinglish to Official Document Generator)</div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div id="letter-preview-card" className="glass-card letter-card" style={{ padding: '1.5rem' }}>
      <div className="letter-card-header">
        <h3 className="heading-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileCheck style={{ width: 20, height: 20, color: 'var(--accent-blue)' }} />
          Official Document Preview
        </h3>

        {complaint.status === 'Submitted' ? (
          <span className="badge badge--success">● Submitted</span>
        ) : (
          <span className="badge badge--warning">● Pending</span>
        )}
      </div>

      <div id="formal-letter-paper" className="letter-paper">
        <div className="letter-paper-header">
          <div className="letter-paper-brand">FORMIFY OFFICIAL DOC</div>
          <div className="letter-paper-date">Date: {complaint.dateSubmitted}</div>
        </div>

        <div className="letter-paper-to">
          <p style={{ fontWeight: 700, color: 'hsl(0,0%,15%)' }}>To,</p>
          <p style={{ whiteSpace: 'pre-line' }}>
            {getAuthorityTitle(complaint.department)}
            {'\n'}Indian National College Campus (INCC)
          </p>
        </div>

        <div className="letter-paper-subject">
          SUBJECT: {complaint.subject.toUpperCase()}
        </div>

        <div className="letter-paper-body">
          Sir/Madam,{'\n\n'}{complaint.formalBody}
        </div>

        <div className="letter-paper-footer">
          <p style={{ fontWeight: 700 }}>Yours sincerely,</p>
          <p className="name">{complaint.studentName}</p>
          <p className="details">
            Location: {complaint.location} | Dept: {complaint.department}
          </p>
        </div>
      </div>

      <div className="letter-actions">
        <a
          id="btn-download-pdf"
          href={getPdfDownloadUrl(complaint.id)}
          download
          className="btn btn-primary"
          style={{ textDecoration: 'none', flex: 1 }}
        >
          <Printer style={{ width: 16, height: 16 }} />
          <span>Download PDF</span>
        </a>

        <button
          id="btn-copy-letter"
          type="button"
          onClick={handleCopy}
          className="btn btn-secondary"
          style={{ flex: 1 }}
        >
          {copied ? <Check style={{ width: 16, height: 16, color: 'var(--accent-green)' }} /> : <Copy style={{ width: 16, height: 16 }} />}
          <span>{copied ? 'Copied' : 'Copy Letter'}</span>
        </button>

        <button
          id="btn-print-letter"
          type="button"
          onClick={handlePrint}
          className="btn btn-secondary"
          style={{ flex: 1 }}
        >
          <Printer style={{ width: 16, height: 16 }} />
          <span>Print</span>
        </button>

        <button
          id="btn-submit-another"
          type="button"
          onClick={onReset}
          className="btn btn-ghost"
          title="Submit Another"
        >
          <RefreshCw style={{ width: 16, height: 16 }} />
        </button>
      </div>
    </div>
  );
}
