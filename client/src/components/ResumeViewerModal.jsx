import React from 'react';
import { X, Download, ExternalLink, Bookmark, BookmarkCheck, FileText, Calendar } from 'lucide-react';

export default function ResumeViewerModal({
  candidate,
  isShortlisted,
  onToggleShortlist,
  onDownloadResume,
  onClose
}) {
  if (!candidate) return null;

  const ext = (candidate.fileType || candidate.filename || '').toLowerCase();
  const isPdf = ext.includes('.pdf') || (!ext.includes('.doc') && !ext.includes('.png') && !ext.includes('.jpg'));
  const isImage = ext.includes('.png') || ext.includes('.jpg') || ext.includes('.jpeg') || ext.includes('.webp');
  const resumeUrl = candidate.filename ? `/uploads/resumes/${encodeURIComponent(candidate.filename)}` : null;
  const hasSchedule = Boolean(
    candidate?.scheduleDetails &&
    candidate.scheduleDetails.date &&
    candidate.scheduleDetails.time
  );

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2200, padding: '16px' }}>
      <div 
        className="modal-content modal-xl" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          display: 'flex', 
          flexDirection: 'column',
          height: '92vh',
          maxHeight: '94vh',
          width: '92vw',
          maxWidth: '1120px',
          borderRadius: '22px',
          overflow: 'hidden',
          background: '#ffffff',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Modal Header */}
        <div 
          className="modal-header" 
          style={{ 
            padding: '16px 24px', 
            borderBottom: '1px solid #e5e5e5',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: '#000000',
              padding: '8px',
              borderRadius: '10px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800, color: '#000000' }}>
                  {candidate.name}
                </h3>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '3px 10px',
                  background: '#f0f0f0',
                  color: '#000000',
                  borderRadius: '999px',
                  fontWeight: 600,
                  border: '1px solid #d4d4d4'
                }}>
                  {candidate.category || 'Candidate'}
                </span>
                {hasSchedule && (
                  <span style={{
                    fontSize: '0.72rem',
                    color: '#000000',
                    background: '#f0f0f0',
                    border: '1px solid #000000',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontWeight: 700
                  }}>
                    Interview: {candidate.scheduleDetails.date} • {candidate.scheduleDetails.time} ({candidate.scheduleDetails.mode || 'Online'})
                  </span>
                )}
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#595959' }}>
                {candidate.education || 'Education Details'} • {candidate.experience || 'Experience'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Shortlist Button (Always active and interactive) */}
            <button
              className={`btn btn-sm ${isShortlisted ? 'btn-shortlist shortlisted' : 'btn-primary'}`}
              onClick={() => onToggleShortlist(candidate)}
              style={{
                background: isShortlisted ? '#000000' : '#ffffff',
                color: isShortlisted ? '#ffffff' : '#000000',
                border: '1px solid #000000',
                borderRadius: '10px',
                padding: '7px 14px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
              title={isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
            >
              {isShortlisted ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              <span>{isShortlisted ? '★ Shortlisted' : '☆ Shortlist'}</span>
            </button>

            {/* Download Button */}
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onDownloadResume(candidate)}
              title="Download Resume File"
              style={{
                background: '#f0f0f0',
                color: '#000000',
                border: '1px solid #d4d4d4',
                borderRadius: '10px',
                padding: '7px 14px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Download size={16} />
              <span>Download</span>
            </button>

            {/* Open Raw in New Tab */}
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm"
                title="Open resume in new browser window"
                style={{
                  background: '#ffffff',
                  color: '#000000',
                  border: '1px solid #d4d4d4',
                  borderRadius: '10px',
                  padding: '7px 10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <ExternalLink size={16} />
              </a>
            )}

            {/* Close Button */}
            <button 
              className="close-btn" 
              onClick={onClose} 
              title="Close Preview"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#f0f0f0',
                border: '1px solid #d4d4d4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#000000'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body / Full Document Viewer (No Half-Cuts) */}
        <div 
          className="modal-body" 
          style={{ 
            flex: '1 1 auto', 
            height: 'calc(92vh - 82px)', 
            padding: '12px 16px', 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden',
            background: '#ffffff'
          }}
        >
          {isPdf && resumeUrl ? (
            <div 
              className="resume-viewer-container" 
              style={{ 
                flex: '1 1 auto', 
                height: '100%', 
                minHeight: '560px',
                width: '100%',
                borderRadius: '14px', 
                overflow: 'hidden', 
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <iframe
                src={`${resumeUrl}#toolbar=1&navpanes=0`}
                className="resume-iframe"
                title={`${candidate.name} Resume`}
                style={{
                  width: '100%',
                  height: '100%',
                  flex: '1 1 auto',
                  minHeight: '560px',
                  border: 'none',
                  display: 'block',
                  background: '#ffffff'
                }}
              />
            </div>
          ) : isImage && resumeUrl ? (
            <div 
              style={{ 
                flex: '1 1 auto', 
                height: '100%', 
                overflow: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                padding: '20px',
                background: '#f8fafc',
                borderRadius: '14px',
                border: '1px solid #e2e8f0'
              }}
            >
              <img 
                src={resumeUrl} 
                alt={`${candidate.name} Resume`} 
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 18px rgba(0, 0, 0, 0.1)' 
                }} 
              />
            </div>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              textAlign: 'center',
              background: '#f8fafc',
              borderRadius: '14px',
              border: '1px solid #e2e8f0'
            }}>
              <FileText size={60} color="#000000" style={{ marginBottom: '16px' }} />
              <h4 style={{ fontSize: '1.3rem', marginBottom: '8px', color: '#000000', fontWeight: 800 }}>
                Document Preview ({candidate.fileType || '.docx'})
              </h4>
              <p style={{ color: '#595959', maxWidth: '480px', marginBottom: '20px' }}>
                This candidate's resume ({candidate.originalFilename || candidate.filename}) is ready for download.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={() => onDownloadResume(candidate)}
                  style={{
                    background: '#000000',
                    color: '#ffffff',
                    border: '1px solid #000000',
                    borderRadius: '999px',
                    padding: '10px 20px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Download size={16} />
                  <span>Download Resume File</span>
                </button>
              </div>

              {/* Candidate Summary */}
              {Array.isArray(candidate.skills) && candidate.skills.length > 0 && (
                <div style={{
                  marginTop: '28px',
                  textAlign: 'left',
                  width: '100%',
                  maxWidth: '600px',
                  background: '#ffffff',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontWeight: 700, color: '#000000', marginBottom: '12px' }}>
                    Verified Competencies:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {candidate.skills.map((s, idx) => (
                      <span 
                        key={idx} 
                        style={{ 
                          background: '#f0f0f0', 
                          color: '#000000', 
                          border: '1px solid #d4d4d4', 
                          fontWeight: 600,
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '13px'
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
