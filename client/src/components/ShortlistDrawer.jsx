import React, { useState } from 'react';
import { X, Trash2, Download, Calendar, Sparkles, UserCheck, ArrowRight, Copy, Check } from 'lucide-react';

export default function ShortlistDrawer({
  isOpen,
  onClose,
  shortlistedCandidates,
  onRemoveFromShortlist,
  onClearShortlist,
  onDownloadBulk,
  onProceedToSchedule,
  onViewResume
}) {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    if (!shortlistedCandidates.length) return;
    const summaryText = shortlistedCandidates.map((c, i) => 
      `${i + 1}. ${c.name} — ${c.category}\n   • Experience: ${c.experience || 'Fresher'}\n   • Technical Skills: ${(c.skills || []).join(', ')}\n   • Location: ${c.location || 'Bangalore'}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(`Shortlisted Tech Candidates via Global Minds Technologies:\n\n${summaryText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div 
        style={{
          width: '100%',
          maxWidth: 'min(520px, 100vw)',
          height: '100vh',
          background: '#ffffff',
          borderLeft: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 25px rgba(0,0,0,0.1)',
          animation: 'slide-in-right 0.25s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes slide-in-right {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        {/* Drawer Header */}
        <div className="modal-header" style={{ padding: '18px 22px', borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={20} color="#2563eb" />
              <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800, color: '#0f172a' }}>Shortlisted Candidates</h3>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
              {shortlistedCandidates.length} candidate{shortlistedCandidates.length === 1 ? '' : 's'} ready for interview scheduling
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {onOpenFullShortlistPage && (
              <button 
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  onClose();
                  onOpenFullShortlistPage();
                }}
                style={{ fontSize: '0.78rem', padding: '5px 10px', color: '#2563eb', borderColor: '#bfdbfe', background: '#eff6ff' }}
                title="Open in dedicated Boss Workspace"
              >
                Full Page ↗
              </button>
            )}
            {shortlistedCandidates.length > 0 && (
              <button 
                className="btn btn-outline btn-sm" 
                onClick={onClearShortlist}
                style={{ fontSize: '0.78rem', padding: '5px 10px' }}
              >
                Clear All
              </button>
            )}
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Drawer Body - Candidate List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', background: '#f8fafc' }}>
          {shortlistedCandidates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <UserCheck size={56} color="#94a3b8" style={{ marginBottom: '16px' }} />
              <h4 style={{ color: '#0f172a', marginBottom: '8px', fontWeight: 700 }}>Your Shortlist is Empty</h4>
              <p style={{ fontSize: '0.88rem', maxWidth: '300px', margin: '0 auto 20px' }}>
                Browse our domain categories and click "Shortlist" on candidates you want to interview.
              </p>
              <button className="btn btn-secondary btn-sm" onClick={onClose}>
                Browse Talent Pool
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {shortlistedCandidates.map((c) => {
                const initials = (c.name || 'C').split(' ').filter(Boolean).map(p => p[0]).slice(0, 2).join('').toUpperCase();
                return (
                  <div 
                    key={c.id} 
                    style={{
                      background: '#ffffff',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: '16px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #18181b, #27272a)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 750,
                        fontSize: '0.9rem',
                        flexShrink: 0
                      }}>
                        {initials}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 750, color: '#09090b', fontSize: '0.96rem' }}>{c.name}</span>
                          <span style={{
                            fontSize: '0.68rem',
                            padding: '1px 8px',
                            borderRadius: '9999px',
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #bfdbfe',
                            fontWeight: 650
                          }}>
                            {c.category}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          {c.experience || 'Fresher'} • {c.location || 'Bangalore'}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveFromShortlist(c.id)}
                        title="Remove from shortlist"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {c.skills && c.skills.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {c.skills.slice(0, 3).map((skill, sIdx) => (
                          <span key={sIdx} style={{
                            fontSize: '0.72rem',
                            background: '#f4f4f5',
                            color: '#3f3f46',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontWeight: 500
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                      <button
                        type="button"
                        onClick={() => onViewResume(c)}
                        style={{
                          flex: 1,
                          height: '32px',
                          background: '#18181b',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px'
                        }}
                      >
                        <Eye size={13} />
                        <span>View Resume (PDF)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        {shortlistedCandidates.length > 0 && (() => {
          const unscheduled = shortlistedCandidates.filter(
            (c) => !(c.interviewScheduled || c.status === 'Interview Scheduled')
          );
          return (
            <div style={{
              padding: '20px',
              borderTop: '1px solid #e2e8f0',
              background: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {unscheduled.length === 0 && (
                <div style={{ fontSize: '0.8rem', color: '#b45309', background: '#fef3c7', padding: '8px 12px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                  All selected candidates already have interviews scheduled. Remove them or select new candidates to schedule.
                </div>
              )}
              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '13px' }}
                onClick={onProceedToSchedule}
                disabled={unscheduled.length === 0}
              >
                <Calendar size={18} />
                <span>
                  {unscheduled.length === 0
                    ? 'All Selected Candidates Scheduled'
                    : `Schedule Interview / Hire Candidates (${unscheduled.length})`}
                </span>
                <ArrowRight size={16} />
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  className="btn btn-outline"
                  style={{
                    padding: '10px 8px',
                    fontSize: '0.82rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    borderColor: copied ? '#86efac' : '#cbd5e1',
                    background: copied ? '#f0fdf4' : '#ffffff',
                    color: copied ? '#15803d' : '#334155'
                  }}
                  onClick={handleCopySummary}
                  title="Copy candidate list to share via Email, Slack, or WhatsApp"
                >
                  {copied ? <Check size={15} color="#16a34a" /> : <Copy size={15} />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
                </button>

                <button
                  className="btn btn-secondary"
                  style={{ padding: '10px 8px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  onClick={onDownloadBulk}
                  title="Download all candidate resumes in a single ZIP folder"
                >
                  <Download size={15} />
                  <span>Download All ZIP</span>
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
