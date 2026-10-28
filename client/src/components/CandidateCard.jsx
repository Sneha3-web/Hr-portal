import React from 'react';
import { Download, Eye, CheckCircle2, Bookmark, BookmarkCheck, MapPin, Briefcase, Calendar, MessageSquare, ArrowUpRight } from 'lucide-react';

function getInitials(name) {
  if (!name) return 'T';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// Deterministic company affiliation / showcase label matching tal.club style
function getAffiliation(candidate) {
  if (candidate.category === 'Data Analyst') return 'Data & Analytics Builder';
  if (candidate.category === 'Devops' || candidate.category === 'DevOps') return 'DevOps & Cloud Specialist';
  if (candidate.category === 'Testing Role') return 'QA Automation Engineer';
  if (candidate.category === 'Full Stack Developer') return 'Full Stack Tech Builder';
  if (candidate.category === 'Java Developer') return 'Java & Backend Engineer';
  if (candidate.category === 'Python Developer') return 'Python & AI Engineer';
  return `${candidate.category || 'Software'} Engineer`;
}

export default function CandidateCard({
  candidate,
  isShortlisted,
  onToggleShortlist,
  onViewResume,
  onDownloadResume,
  onViewDetails,
  onScheduleInterview
}) {
  const initials = getInitials(candidate.name);
  const displaySkills = (candidate.skills || []).slice(0, 4);
  const isScheduled = Boolean(candidate?.scheduleDetails && candidate.scheduleDetails.date && candidate.scheduleDetails.time);
  const affiliation = getAffiliation(candidate);

  return (
    <div className="tal-member-card" id={`candidate-${candidate.id}`}>
      <div className="tal-member-card-body">
        {/* Top: Avatar + Member Info */}
        <div className="tal-member-top" onClick={() => onViewDetails(candidate)}>
          <div className="tal-member-avatar-wrap">
            <div className="tal-member-avatar">
              {initials}
            </div>
            <span className="tal-member-online-dot" title="Active on Global Minds Network" />
          </div>

          <div className="tal-member-info">
            <div className="tal-member-name-row">
              <span className="tal-member-name">{candidate.name}</span>
              <CheckCircle2 size={15} className="tal-verified-badge" />
              {candidate.isCandidateBuilt && (
                <span style={{
                  fontSize: '10.5px',
                  fontWeight: 700,
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '1px 7px',
                  borderRadius: '9999px',
                  marginLeft: '4px'
                }}>
                  ⚡ Candidate Created
                </span>
              )}
            </div>

            <div className="tal-member-role">
              {affiliation} • <span className="tal-subtle-org">Global Minds</span>
            </div>

            <div className="tal-member-meta">
              <span className="tal-meta-item">
                <MapPin size={12} />
                <span>{candidate.location || 'Bengaluru'}</span>
              </span>
              <span className="tal-meta-dot">•</span>
              <span className="tal-meta-item">
                <Briefcase size={12} />
                <span>{candidate.experience || 'Fresher'}</span>
              </span>
              {isScheduled && (
                <>
                  <span className="tal-meta-dot">•</span>
                  <span className="tal-scheduled-tag">
                    <Calendar size={11} />
                    <span>Interview: {candidate.scheduleDetails.date}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Skills Tag Pills */}
        <div className="tal-member-skills">
          {displaySkills.map((skill, idx) => (
            <span key={idx} className="tal-skill-pill">
              {skill}
            </span>
          ))}
          {(candidate.skills || []).length > 4 && (
            <span className="tal-skill-more">
              +{candidate.skills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="tal-member-actions">
        <button
          className="tal-btn-action-view"
          onClick={() => onViewDetails(candidate)}
          title="Open Tal Member Profile"
        >
          <span>View Profile</span>
          <ArrowUpRight size={13} />
        </button>

        <button
          className="tal-btn-action-preview"
          onClick={() => onViewResume(candidate)}
          title="Preview PDF Resume"
        >
          <Eye size={13} />
          <span>Resume</span>
        </button>

        <button
          className="tal-btn-action-download"
          onClick={() => onDownloadResume(candidate)}
          title="Download original resume file"
        >
          <Download size={13} />
        </button>

        <button
          className={`tal-btn-action-schedule ${isScheduled ? 'scheduled' : ''}`}
          onClick={() => onScheduleInterview(candidate)}
          title={isScheduled ? 'Interview Already Scheduled' : 'Schedule Direct Interview'}
          disabled={isScheduled}
        >
          <Calendar size={13} />
        </button>

        <button
          className={`tal-btn-action-shortlist ${isShortlisted ? 'active' : ''}`}
          onClick={() => onToggleShortlist(candidate)}
          title={isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
        >
          {isShortlisted ? <BookmarkCheck size={14} fill="currentColor" /> : <Bookmark size={14} />}
        </button>
      </div>
    </div>
  );
}
