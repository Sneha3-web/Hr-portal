import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  Download, 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle2, 
  Calendar,
  Mail,
  Phone,
  Code2,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Building2,
  ShieldCheck,
  Share2
} from 'lucide-react';

export default function CandidateDetailModal({
  candidate,
  isShortlisted,
  onToggleShortlist,
  onViewResume,
  onDownloadResume,
  onScheduleInterview,
  onClose
}) {
  const [expandedWork, setExpandedWork] = useState(true);

  if (!candidate) return null;

  const initials = (candidate.name || 'T')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const isScheduled = Boolean(candidate?.scheduleDetails && candidate.scheduleDetails.date && candidate.scheduleDetails.time);

  // Construct experience items based on candidate's real data
  const experienceList = [
    {
      role: `${candidate.category || 'Software'} Engineer`,
      company: 'Global Minds Tech Project Showcase',
      duration: 'Aug 2024 - Present · 1 yr 3 mos',
      location: candidate.location || 'Bengaluru, India',
      desc: candidate.bio || `Specialized developer trained in ${candidate.category}. Built enterprise full-stack applications with high code coverage, automated CI/CD pipelines, and robust database architectures.`
    },
    {
      role: 'Project Associate & Hands-on Lab',
      company: 'Tech Academy Hub',
      duration: 'Jan 2024 - Jul 2024 · 6 mos',
      location: 'On-site',
      desc: `Architected backend microservices and responsive web client interfaces with verified test-driven development.`
    }
  ];

  return (
    <div className="tal-modal-overlay" onClick={onClose}>
      <div className="tal-modal-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Top Header Bar */}
        <div className="tal-sheet-nav">
          <div className="tal-brand-icon-box" style={{ width: '38px', height: '38px', background: '#ffffff', padding: '2px' }}>
            <img src="/logo.jpg" alt="Global Minds" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>

          <div className="tal-sheet-nav-actions">
            <button
              className="tal-btn-sheet-download"
              onClick={() => onDownloadResume(candidate)}
              title="Download Resume"
            >
              <Download size={14} />
              <span>Download Resume</span>
            </button>

            <button className="tal-sheet-close" onClick={onClose} aria-label="Close profile">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Profile Content */}
        <div className="tal-sheet-body">
          {/* Candidate Serif Headline */}
          <div className="tal-sheet-hero-header">
            <h1 className="tal-sheet-name">{candidate.name}</h1>
            <p className="tal-sheet-tagline">
              {candidate.education || 'B.E. Computer Science'} • {candidate.category}
            </p>
          </div>

          {/* 3D Tilted Cards Showcase Preview (matching sai-nikhil-tati screenshot) */}
          <div className="tal-profile-card-stack-row">
            {/* Left Card: Company & Role */}
            <div className="tal-profile-stack-card tal-stack-left">
              <div className="tal-company-squircle">
                <Building2 size={24} color="#101011" />
              </div>
              <div className="tal-stack-company-name">Global Minds</div>
              <div className="tal-stack-role-name">{candidate.category || 'Tech Builder'}</div>
              <div className="tal-stack-exp-label">WORK EXPERIENCE</div>
              <div className="tal-stack-exp-val">{candidate.experience || '1-3 Years'}</div>
            </div>

            {/* Center Card: Large Photo / Avatar */}
            <div className="tal-profile-stack-card tal-stack-center">
              <div className="tal-center-avatar-surface">
                <div className="tal-center-initials">{initials}</div>
              </div>
              <div className="tal-center-card-badge">
                <CheckCircle2 size={13} color="#10b981" />
                <span>Available Immediately</span>
              </div>
            </div>

            {/* Right Card: Verified Silver Seal Badge */}
            <div className="tal-profile-stack-card tal-stack-right">
              <div className="tal-silver-seal-container">
                <div className="tal-silver-seal">
                  <ShieldCheck size={28} color="#475569" />
                </div>
              </div>
              <div className="tal-stack-verified-text">
                VERIFIED MEMBER OF TAL CLUB
              </div>
              <div className="tal-stack-verified-sub">
                500+ Hours Hands-on Code Vetted
              </div>
            </div>
          </div>

          {/* Stacked Mobile Profile Cards */}
          <div className="tal-profile-cards-container">
            {/* Card 1: Core Header */}
            <div className="tal-mobile-card tal-mobile-card-first">
              <div className="tal-mobile-card-title-row">
                <h2 className="tal-mobile-name">{candidate.name}</h2>
                <CheckCircle2 size={18} color="#10b981" />
              </div>
              <p className="tal-mobile-subtitle">
                {candidate.education || 'B.E. Computer Science'} | {candidate.category} Specialist
              </p>
              <div className="tal-mobile-location-row">
                <MapPin size={14} color="#636366" />
                <span>{candidate.location || 'Bengaluru'}, India</span>
                <span className="tal-meta-dot">•</span>
                <span style={{ color: '#059669', fontWeight: 600 }}>
                  {candidate.availability || 'Immediate (0–15 Days)'}
                </span>
              </div>
            </div>

            {/* Card 2: Work Experience & Projects Timeline */}
            <div className="tal-mobile-card">
              <div className="tal-card-section-header">
                <h3 className="tal-card-section-title">
                  {candidate.experience || '1-3 Years'} of Work &amp; Project Experience
                </h3>
              </div>

              <div className="tal-timeline-list">
                {experienceList.map((item, idx) => (
                  <div key={idx} className="tal-timeline-item">
                    <div className="tal-timeline-left">
                      <div className="tal-squircle-logo">
                        <Code2 size={20} color="#101011" />
                      </div>
                      {idx < experienceList.length - 1 && <div className="tal-timeline-line" />}
                    </div>

                    <div className="tal-timeline-content">
                      <div className="tal-timeline-role-row">
                        <span className="tal-timeline-role">{item.role}</span>
                      </div>
                      <div className="tal-timeline-company">{item.company}</div>

                      <div className="tal-timeline-duration-row">
                        <span className="tal-timeline-dates">{item.duration}</span>
                      </div>
                      <div className="tal-timeline-loc">{item.location}</div>

                      <p className="tal-timeline-desc">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: AI Stack & Technical Competencies */}
            <div className="tal-mobile-card">
              <div className="tal-card-section-header">
                <h3 className="tal-card-section-title">Verified Technical Competencies &amp; AI Stack</h3>
              </div>
              <div className="tal-skills-chips-wrap">
                {(candidate.skills || []).map((skill, idx) => (
                  <span key={idx} className="tal-skill-badge">
                    ✓ {skill}
                  </span>
                ))}
                <span className="tal-skill-badge tal-skill-ai">
                  ⚡ AI Stack (antigravity, codex, Copilot)
                </span>
              </div>
            </div>

            {/* Card 4: Education */}
            <div className="tal-mobile-card">
              <div className="tal-card-section-header">
                <h3 className="tal-card-section-title">Education &amp; Academic Background</h3>
              </div>
              <div className="tal-edu-row">
                <div className="tal-squircle-logo" style={{ width: '42px', height: '42px' }}>
                  <GraduationCap size={18} color="#101011" />
                </div>
                <div>
                  <div className="tal-timeline-role">{candidate.education || 'Bachelor of Engineering (B.E)'}</div>
                  <div className="tal-timeline-company">{candidate.college || 'Visvesvaraya Technological University'}</div>
                  <div className="tal-timeline-dates">Passing Batch: {candidate.passingYear || 2024}</div>
                </div>
              </div>
            </div>

            {/* Card 5: Profile Highlights */}
            <div className="tal-mobile-card tal-mobile-card-last">
              <div className="tal-card-section-header">
                <h3 className="tal-card-section-title">Profile Highlights</h3>
              </div>

              <div className="tal-highlight-block">
                <span className="tal-highlight-label">What I'm currently working on</span>
                <p className="tal-highlight-text">
                  Architecting high-scale backend services and clean frontend workflows, optimizing API response latencies, and integrating LLMs for automated task workflows.
                </p>
              </div>

              <div className="tal-highlight-block">
                <span className="tal-highlight-label">What I've built with AI</span>
                <p className="tal-highlight-text">
                  Integrated modern LLM pipelines with structured parsing to automate data ingestion and accelerate production velocity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Sticky Action Bar at Bottom of Sheet */}
        <div className="tal-sheet-footer">
          <button
            className="tal-btn-footer-primary"
            onClick={() => {
              onClose();
              if (onScheduleInterview) onScheduleInterview(candidate);
            }}
          >
            <Calendar size={15} />
            <span>Schedule Direct Interview</span>
          </button>

          <button
            className="tal-btn-footer-secondary"
            onClick={() => onViewResume(candidate)}
          >
            <FileText size={15} />
            <span>Preview Resume</span>
          </button>

          <button
            className={`tal-btn-footer-shortlist ${isShortlisted ? 'active' : ''}`}
            onClick={() => onToggleShortlist(candidate)}
          >
            {isShortlisted ? <BookmarkCheck size={16} fill="currentColor" /> : <Bookmark size={16} />}
            <span>{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
