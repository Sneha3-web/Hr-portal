import React from 'react';
import { Building2 } from 'lucide-react';

export default function HiringPartners() {
  const partners = [
    'Tata Consultancy Services',
    'Infosys Ltd',
    'Wipro Technologies',
    'Capgemini',
    'Accenture',
    'Cognizant',
    'Amazon AWS',
    'Tech Mahindra',
    'Zoho Corp',
    'HCL Tech'
  ];

  return (
    <div style={{
      background: '#ffffff',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      padding: '24px 0',
      margin: '20px 0 36px'
    }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--text-muted)',
          marginBottom: '16px'
        }}>
          Trusted by Top Hiring Companies & MNCs
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          {partners.map((name, i) => (
            <span
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: 'var(--text-body)'
              }}
            >
              <Building2 size={13} color="var(--primary)" />
              <span>{name}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
