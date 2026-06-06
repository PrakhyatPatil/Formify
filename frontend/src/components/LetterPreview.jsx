import React, { useState } from 'react';
import { Copy, Check, FileDown, Printer } from 'lucide-react';
import { complaintApi } from '../services/api';

const LetterPreview = ({ complaint }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(complaint.letter_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadUrl = complaintApi.getDownloadUrl(complaint.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>Generated Letter Preview</h3>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={handleCopy} 
            className="btn-secondary" 
            style={{ padding: '8px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {copied ? <Check size={14} style={{ color: 'var(--color-low)' }} /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>
          
          <button 
            onClick={handlePrint} 
            className="btn-secondary" 
            style={{ padding: '8px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={14} />
            <span>Print</span>
          </button>

          <a 
            href={downloadUrl} 
            download 
            className="btn-primary" 
            style={{ 
              padding: '8px 16px', 
              fontSize: '13px', 
              textDecoration: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px' 
            }}
          >
            <FileDown size={14} />
            <span>Download PDF</span>
          </a>
        </div>
      </div>

      {/* Elegant letter paper layout */}
      <div className="letter-paper" style={{
        background: '#ffffff',
        color: '#0f172a',
        padding: '40px',
        borderRadius: '8px',
        fontFamily: 'Georgia, serif',
        fontSize: '14px',
        lineHeight: '1.6',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        minHeight: '600px',
        whiteSpace: 'pre-line',
        border: '1px solid #e2e8f0',
        textAlign: 'left'
      }}>
        {complaint.letter_text}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .letter-paper, .letter-paper * {
            visibility: visible;
          }
          .letter-paper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            box-shadow: none;
            padding: 0;
          }
        }
      `}} />
    </div>
  );
};

export default LetterPreview;
