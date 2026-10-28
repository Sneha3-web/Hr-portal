import React from 'react';
import { Eye, Download, Bookmark, BookmarkCheck, CheckCircle2, Calendar } from 'lucide-react';

export default function CandidateTableView({
  candidates,
  shortlist,
  onToggleShortlist,
  onViewResume,
  onDownloadResume,
  onViewDetails,
  onScheduleInterview
}) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
      marginBottom: '40px'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px 18px', fontWeight: 600 }}>Student Name</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Category / Role</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Experience</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Location</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Key Skills</th>
              <th style={{ padding: '12px 18px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => {
              const isShortlisted = shortlist.some((s) => s.id === c.id);
              const isScheduled = Boolean(c.scheduleDetails && c.scheduleDetails.date && c.scheduleDetails.time);
              return (
                <tr 
                  key={c.id} 
                  style={{ 
                    borderBottom: '1px solid var(--border)',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-light)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 18px' }}>
                    <div 
                      style={{ fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => onViewDetails(c)}
                    >
                      <span>{c.name}</span>
                      <CheckCircle2 size={13} color="#10b981" />
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: '0.76rem',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--bg-subtle)',
                      color: 'var(--primary)',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <span>{c.category}</span>
                      {isScheduled && (
                        <span style={{
                          fontSize: '0.66rem',
                          color: '#15803d',
                          background: '#dcfce7',
                          border: '1px solid #bbf7d0',
                          padding: '1px 6px',
                          borderRadius: '8px',
                          fontWeight: 700
                        }}>
                          Scheduled
                        </span>
                      )}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-body)' }}>{c.experience}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-body)' }}>{c.location}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)', maxWidth: '240px' }}>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                      {(c.skills || []).slice(0, 3).join(', ')}
                    </span>
                  </td>
                  <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onViewResume(c)}
                        title="Preview Resume"
                        style={{ padding: '5px 8px' }}
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => onDownloadResume(c)}
                        title="Download Resume"
                        style={{ padding: '5px 8px' }}
                      >
                        <Download size={13} />
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => onScheduleInterview && onScheduleInterview(c)}
                        title={isScheduled ? "Interview already scheduled" : "Schedule Interview"}
                        disabled={isScheduled}
                        style={{ padding: '5px 8px', opacity: isScheduled ? 0.6 : 1 }}
                      >
                        <Calendar size={13} />
                      </button>
                      <button
                        className={`btn btn-sm ${isShortlisted ? 'btn-accent' : 'btn-primary'}`}
                        onClick={() => onToggleShortlist(c)}
                        title={isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
                        style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                      >
                        {isShortlisted ? 'Shortlisted' : 'Shortlist'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
