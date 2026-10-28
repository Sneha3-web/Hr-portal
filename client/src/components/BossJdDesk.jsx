import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  MapPin, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  Search, 
  Users, 
  UserCheck, 
  Eye, 
  Calendar, 
  Bookmark, 
  Trash2, 
  ArrowRight, 
  Filter, 
  Layers,
  Building2,
  FileText,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

const POPULAR_ROLES = [
  'Full Stack Developer',
  'Devops',
  'Java Developer',
  'Python Developer',
  'Data Analyst',
  'Frontend Developer',
  'Machine Learning',
  'Testing Role'
];

const POPULAR_LOCATIONS = [
  'Bengaluru',
  'Chennai',
  'Hyderabad',
  'Remote',
  'Coimbatore',
  'Pune',
  'Mumbai'
];

const POPULAR_SKILLS = [
  'React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 
  'Java', 'Spring Boot', 'SQL', 'PostgreSQL', 'FastAPI', 'Django', 
  'Power BI', 'Tableau', 'JavaScript', 'TypeScript', 'Git', 'Kafka'
];

export default function BossJdDesk({
  onViewResume,
  onScheduleInterview,
  user
}) {
  const [activeTab, setActiveTab] = useState('jds'); // 'jds' | 'builder' | 'applicants'
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  
  // Selected Job for viewing matched profiles
  const [selectedJob, setSelectedJob] = useState(null);
  const [matchedCandidates, setMatchedCandidates] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  // Shortlisted candidate tracking
  const [shortlistedMap, setShortlistedMap] = useState({});

  // Direct Applicants
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  // New JD Form State
  const [formData, setFormData] = useState({
    title: 'Senior Full Stack Engineer',
    role: 'Full Stack Developer',
    companyName: user?.companyName || 'Target India',
    bossName: user?.name || 'Aryan Merchant',
    bossEmail: user?.email || 'aryan.merchant@target.com',
    location: 'Bengaluru',
    workMode: 'Hybrid',
    package: '₹14–22 LPA',
    experience: '1-3 Years',
    skills: ['React', 'Node.js', 'SQL', 'Git', 'PostgreSQL'],
    description: 'Looking for a talented builder to own scalable web dashboards, microservices, and reliable cloud deployments.',
    requirements: 'Strong CS fundamentals, hands-on project experience with modern React & Node.js, and clean code habits.'
  });

  const [skillInput, setSkillInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(null);

  // Fetch Jobs from backend
  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await fetch('/api/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
        if (data.jobs && data.jobs.length > 0 && !selectedJob) {
          selectJobAndLoadMatches(data.jobs[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Load matches for a selected job
  const selectJobAndLoadMatches = async (job) => {
    setSelectedJob(job);
    setLoadingMatches(true);
    try {
      const res = await fetch(`/api/jobs/${job.id}/matches`);
      if (res.ok) {
        const data = await res.json();
        setMatchedCandidates(data.matches || []);
      }
    } catch (err) {
      console.error('Failed to load matches for job:', err);
    } finally {
      setLoadingMatches(false);
    }
  };

  // Load direct applicants for a selected job
  const loadApplicants = async (jobId) => {
    setLoadingApplicants(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}/applicants`);
      if (res.ok) {
        const data = await res.json();
        setApplicants(data.applicants || []);
      }
    } catch (err) {
      console.error('Failed to load applicants:', err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  // Handle Skill Tag addition
  const handleAddSkill = (skill) => {
    const s = skill.trim();
    if (s && !formData.skills.includes(s)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, s] }));
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  // Handle Form Submission (Save & Publish JD Card)
  const handlePublishJob = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setPublishSuccess(null);

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const data = await res.json();
        setPublishSuccess(`✓ Job Card "${data.job.title}" published successfully! Matching candidate profiles loaded below.`);
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        } catch (e) {}

        await fetchJobs();
        selectJobAndLoadMatches(data.job);
        setActiveTab('jds');
      } else {
        const err = await res.json();
        alert('Error publishing job: ' + (err.error || 'Failed to save'));
      }
    } catch (err) {
      console.error('Failed to publish job:', err);
      alert('Network error while saving job card.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Shortlisting a Candidate
  const handleShortlistCandidate = async (candidate) => {
    if (!selectedJob) return;

    try {
      const res = await fetch(`/api/jobs/${selectedJob.id}/shortlist-candidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId: candidate.id, status: 'Shortlisted' })
      });

      if (res.ok) {
        setShortlistedMap(prev => ({
          ...prev,
          [`${selectedJob.id}_${candidate.id}`]: true
        }));
        try {
          confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
        } catch (e) {}
      }
    } catch (err) {
      console.error('Failed to shortlist:', err);
    }
  };

  // Delete Job Card
  const handleDeleteJob = async (jobId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this JD card?')) return;
    try {
      const res = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchJobs();
        if (selectedJob?.id === jobId) {
          setSelectedJob(null);
          setMatchedCandidates([]);
        }
      }
    } catch (err) {
      console.error('Failed to delete job:', err);
    }
  };

  return (
    <div id="boss-jd-desk" className="boss-desk-wrapper">
      {/* Top Banner / Controls */}
      <div className="boss-desk-header">
        <div className="boss-desk-header-left">
          <div className="boss-desk-badge">
            <Briefcase size={14} />
            <span>Boss Mode Hiring Desk</span>
          </div>
          <h1 className="boss-desk-title">
            Build Job Descriptions &amp; Hire Matching Talent
          </h1>
          <p className="boss-desk-subtitle">
            Fill your role, location, package, and experience. We instantly generate your live JD card and match pre-screened builders from the Global Minds network.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="boss-desk-tabs">
          <button
            type="button"
            className={`boss-desk-tab ${activeTab === 'jds' ? 'active' : ''}`}
            onClick={() => setActiveTab('jds')}
          >
            <Layers size={16} />
            <span>Posted JDs &amp; Matched Profiles ({jobs.length})</span>
          </button>
          <button
            type="button"
            className={`boss-desk-tab ${activeTab === 'builder' ? 'active' : ''}`}
            onClick={() => setActiveTab('builder')}
          >
            <Plus size={16} />
            <span>Build New JD Card</span>
          </button>
        </div>
      </div>

      {publishSuccess && (
        <div className="boss-success-banner">
          <CheckCircle2 size={18} color="#10b981" />
          <span>{publishSuccess}</span>
          <button type="button" onClick={() => setPublishSuccess(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#065f46' }}>✕</button>
        </div>
      )}

      {/* =========================================================================
         TAB 1: POSTED JDS & MATCHED PROFILES
         ========================================================================= */}
      {activeTab === 'jds' && (
        <div className="boss-jds-section">
          {/* Section: Select a JD Card */}
          <div className="boss-subhead-row">
            <div>
              <h2 className="boss-subhead">1. Your Active Job Description Cards</h2>
              <p className="boss-subhead-muted">Click any card below to view matching candidate profiles and direct applicants.</p>
            </div>
            <button
              type="button"
              className="btn-create-jd-pill"
              onClick={() => setActiveTab('builder')}
            >
              <Plus size={15} />
              <span>Post New JD</span>
            </button>
          </div>

          {loadingJobs ? (
            <div className="boss-loading-state">
              <div className="tal-spinner" />
              <span>Loading your active job cards...</span>
            </div>
          ) : jobs.length === 0 ? (
            <div className="boss-empty-card">
              <AlertCircle size={36} color="#94a3b8" />
              <h3>No Job Description cards posted yet</h3>
              <p>Build your first JD card by specifying the role, location, package, and skills.</p>
              <button 
                type="button" 
                className="tal-btn-pill-white" 
                onClick={() => setActiveTab('builder')}
                style={{ marginTop: '14px' }}
              >
                <span>Build JD Card Now</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div className="boss-jobs-grid">
              {jobs.map((job) => {
                const isSelected = selectedJob?.id === job.id;
                return (
                  <div
                    key={job.id}
                    className={`boss-job-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      selectJobAndLoadMatches(job);
                      loadApplicants(job.id);
                    }}
                  >
                    <div className="boss-job-card-top">
                      <div>
                        <span className="boss-company-pill">{job.companyName}</span>
                        <h3 className="boss-job-title">{job.title}</h3>
                        <span className="boss-job-role">{job.role}</span>
                      </div>
                      <button
                        type="button"
                        className="boss-btn-del"
                        onClick={(e) => handleDeleteJob(job.id, e)}
                        title="Delete JD card"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="boss-job-meta-strip">
                      <div className="boss-meta-chip">
                        <MapPin size={13} color="#64748b" />
                        <span>{job.location} ({job.workMode})</span>
                      </div>
                      <div className="boss-meta-chip highlight">
                        <IndianRupee size={13} color="#2563eb" />
                        <span>{job.package}</span>
                      </div>
                      <div className="boss-meta-chip">
                        <Clock size={13} color="#64748b" />
                        <span>{job.experience}</span>
                      </div>
                    </div>

                    <div className="boss-job-skills-row">
                      {(job.skills || []).slice(0, 5).map((sk, idx) => (
                        <span key={idx} className="boss-skill-tag">{sk}</span>
                      ))}
                      {(job.skills || []).length > 5 && (
                        <span className="boss-skill-tag more">+{job.skills.length - 5}</span>
                      )}
                    </div>

                    <div className="boss-job-card-foot">
                      <span className="boss-applicants-count">
                        <Users size={14} />
                        <span>{job.applicantsCount || 0} Direct Applicants</span>
                      </span>
                      <span className="boss-card-action-text">
                        {isSelected ? 'Viewing Matches ✓' : 'Click to View Matches →'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* =========================================================================
             SECTION: MATCHED PROFILES FOR THE SELECTED JD
             ========================================================================= */}
          {selectedJob && (
            <div className="boss-matches-container">
              <div className="boss-matches-header-card">
                <div className="boss-matches-header-info">
                  <div className="boss-match-title-row">
                    <Sparkles size={20} color="#f59e0b" />
                    <h2>
                      Matching Candidate Profiles for &ldquo;{selectedJob.title}&rdquo;
                    </h2>
                  </div>
                  <p className="boss-matches-desc">
                    Showing candidates from the Global Minds database matching <strong>{selectedJob.role}</strong>, 
                    skills ({selectedJob.skills?.join(', ')}), experience ({selectedJob.experience}), and location ({selectedJob.location}).
                  </p>
                </div>

                <div className="boss-matches-counts">
                  <div className="match-count-badge">
                    <span className="count-num">{matchedCandidates.length}</span>
                    <span className="count-label">Profiles Matched</span>
                  </div>
                </div>
              </div>

              {/* Matched Candidates List */}
              {loadingMatches ? (
                <div className="boss-loading-state">
                  <div className="tal-spinner" />
                  <span>Computing profile compatibility and skill matches...</span>
                </div>
              ) : matchedCandidates.length === 0 ? (
                <div className="boss-empty-card">
                  <p>No candidates match the current criteria. Try expanding skills in your JD.</p>
                </div>
              ) : (
                <div className="boss-matched-grid">
                  {matchedCandidates.map((cand) => {
                    const isShortlisted = shortlistedMap[`${selectedJob.id}_${cand.id}`];
                    return (
                      <div key={cand.id} className="boss-candidate-match-card">
                        <div className="cand-match-top">
                          <div className="cand-match-avatar">
                            {cand.name ? cand.name.substring(0, 2).toUpperCase() : 'GM'}
                          </div>
                          <div className="cand-match-identity">
                            <div className="cand-name-row">
                              <h3 className="cand-name">{cand.name}</h3>
                              <span className="cand-verified-badge">Pre-Screened</span>
                            </div>
                            <span className="cand-category">{cand.category}</span>
                            <div className="cand-sub-meta">
                              <span>{cand.location || 'Chennai'}</span>
                              <span>•</span>
                              <span>{cand.experience || '1-2 Years'}</span>
                              <span>•</span>
                              <span style={{ color: '#059669', fontWeight: 600 }}>{cand.availability || 'Immediate'}</span>
                            </div>
                          </div>

                          {/* Match Score Badge */}
                          <div className="cand-score-pill">
                            <span className="score-num">{cand.matchScore || 85}%</span>
                            <span className="score-lbl">Match</span>
                          </div>
                        </div>

                        {/* Matching Skills Highlight */}
                        <div className="cand-skills-section">
                          <span className="cand-skills-title">Matched Skills:</span>
                          <div className="cand-skills-chips">
                            {(cand.matchingSkills || []).map((ms, idx) => (
                              <span key={idx} className="cand-skill-chip matched">
                                ✓ {ms}
                              </span>
                            ))}
                            {(cand.skills || [])
                              .filter(s => !(cand.matchingSkills || []).includes(s))
                              .slice(0, 4)
                              .map((s, idx) => (
                                <span key={idx} className="cand-skill-chip">
                                  {s}
                                </span>
                              ))}
                          </div>
                        </div>

                        {cand.education && (
                          <div className="cand-edu-strip">
                            <span>🎓 {cand.education}</span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="cand-actions-row">
                          <button
                            type="button"
                            className={`boss-btn-shortlist ${isShortlisted ? 'shortlisted' : ''}`}
                            onClick={() => handleShortlistCandidate(cand)}
                          >
                            <Bookmark size={14} fill={isShortlisted ? 'currentColor' : 'none'} />
                            <span>{isShortlisted ? 'Shortlisted ⭐' : 'Shortlist'}</span>
                          </button>

                          <button
                            type="button"
                            className="boss-btn-preview"
                            onClick={() => onViewResume && onViewResume(cand)}
                          >
                            <Eye size={14} />
                            <span>Preview Resume</span>
                          </button>

                          <button
                            type="button"
                            className="boss-btn-schedule"
                            onClick={() => onScheduleInterview && onScheduleInterview(cand)}
                          >
                            <Calendar size={14} />
                            <span>Schedule</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
         TAB 2: BUILD NEW JD CARD FORM
         ========================================================================= */}
      {activeTab === 'builder' && (
        <div className="boss-builder-layout">
          <div className="boss-form-card">
            <div className="boss-form-header">
              <h2 className="boss-form-title">Build a New Job Description (JD)</h2>
              <p className="boss-form-subtitle">Fill role details below. Our portal converts your requirement into an active card and matches qualified builders.</p>
            </div>

            <form onSubmit={handlePublishJob} className="boss-jd-form">
              {/* Row 1: Role & Domain */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Job Title / Headline *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Senior Full Stack Engineer"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Primary Role / Category *</label>
                  <select
                    className="form-select"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value, category: e.target.value })}
                  >
                    {POPULAR_ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Company & Location */}
              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Target India / MyTech"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <select
                    className="form-select"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  >
                    {POPULAR_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Work Mode *</label>
                  <select
                    className="form-select"
                    value={formData.workMode}
                    onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Package & Experience */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Package / CTC Budget *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.package}
                    onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                    placeholder="e.g. ₹12–18 LPA or ₹8–14 LPA"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Experience Required *</label>
                  <div className="form-stepper-row">
                    <button
                      type="button"
                      className="form-step-btn"
                      onClick={() => {
                        const exps = ['Fresher', '1-3 Years', '3-5 Years', '5+ Years'];
                        const idx = exps.indexOf(formData.experience);
                        if (idx > 0) setFormData({ ...formData, experience: exps[idx - 1] });
                      }}
                      disabled={formData.experience === 'Fresher'}
                      title="Decrease Experience Required (-)"
                      aria-label="Decrease Experience Required"
                    >
                      -
                    </button>
                    <select
                      className="form-select"
                      style={{ flex: 1 }}
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    >
                      <option value="Fresher">Fresher (0-1 yrs)</option>
                      <option value="1-3 Years">1-3 Years</option>
                      <option value="3-5 Years">3-5 Years</option>
                      <option value="5+ Years">5+ Years</option>
                    </select>
                    <button
                      type="button"
                      className="form-step-btn"
                      onClick={() => {
                        const exps = ['Fresher', '1-3 Years', '3-5 Years', '5+ Years'];
                        const idx = exps.indexOf(formData.experience);
                        if (idx < exps.length - 1 && idx >= 0) {
                          setFormData({ ...formData, experience: exps[idx + 1] });
                        }
                      }}
                      disabled={formData.experience === '5+ Years'}
                      title="Increase Experience Required (+)"
                      aria-label="Increase Experience Required"
                    >
                      +
                    </button>
                  </div>

                  {/* 1-Tap Quick Experience Pills */}
                  <div className="form-pills-row">
                    {['Fresher', '1-3 Years', '3-5 Years', '5+ Years'].map((exp) => (
                      <button
                        key={exp}
                        type="button"
                        className={`form-pill-btn ${formData.experience === exp ? 'active' : ''}`}
                        onClick={() => setFormData({ ...formData, experience: exp })}
                      >
                        {formData.experience === exp ? `✓ ${exp}` : exp}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skills Selector */}
              <div className="form-group">
                <label className="form-label">Required Tech Skills (Chips)</label>
                <div className="skills-builder-box">
                  <div className="active-skills-chips">
                    {formData.skills.map((skill) => (
                      <span key={skill} className="skill-removable-pill">
                        {skill}
                        <button type="button" onClick={() => handleRemoveSkill(skill)}>✕</button>
                      </span>
                    ))}
                  </div>

                  <div className="skill-input-row">
                    <input
                      type="text"
                      className="form-input-skill"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill(skillInput);
                        }
                      }}
                      placeholder="Type skill & press Enter (e.g. Docker, GraphQL, Redis)"
                    />
                    <button
                      type="button"
                      className="btn-add-skill"
                      onClick={() => handleAddSkill(skillInput)}
                    >
                      Add
                    </button>
                  </div>

                  <div className="popular-skills-hints">
                    <span className="hint-label">Quick add:</span>
                    {POPULAR_SKILLS.filter(s => !formData.skills.includes(s)).slice(0, 10).map((ps) => (
                      <button
                        key={ps}
                        type="button"
                        className="btn-skill-hint"
                        onClick={() => handleAddSkill(ps)}
                      >
                        + {ps}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description & Requirements */}
              <div className="form-group">
                <label className="form-label">Job Summary &amp; Description</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the day-to-day work, architecture, or mission of this role..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Candidate Requirements</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="Key competencies, project proof of work, or turnaround expectations..."
                />
              </div>

              {/* Submit Button */}
              <div className="form-submit-row">
                <button
                  type="submit"
                  className="btn-publish-jd"
                  disabled={submitting}
                >
                  <Sparkles size={16} />
                  <span>{submitting ? 'Publishing JD Card...' : 'Save & Publish Job Card ⚡'}</span>
                </button>
                <button
                  type="button"
                  className="btn-cancel-jd"
                  onClick={() => setActiveTab('jds')}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview of the JD Card */}
          <div className="boss-preview-sidebar">
            <div className="preview-sticky-card">
              <span className="preview-label">Live JD Card Preview</span>
              
              <div className="boss-job-card preview">
                <div className="boss-job-card-top">
                  <div>
                    <span className="boss-company-pill">{formData.companyName || 'Target India'}</span>
                    <h3 className="boss-job-title">{formData.title || 'Senior Full Stack Engineer'}</h3>
                    <span className="boss-job-role">{formData.role}</span>
                  </div>
                </div>

                <div className="boss-job-meta-strip">
                  <div className="boss-meta-chip">
                    <MapPin size={13} color="#64748b" />
                    <span>{formData.location} ({formData.workMode})</span>
                  </div>
                  <div className="boss-meta-chip highlight">
                    <IndianRupee size={13} color="#2563eb" />
                    <span>{formData.package}</span>
                  </div>
                  <div className="boss-meta-chip">
                    <Clock size={13} color="#64748b" />
                    <span>{formData.experience}</span>
                  </div>
                </div>

                <div className="boss-job-skills-row">
                  {formData.skills.map((sk, idx) => (
                    <span key={idx} className="boss-skill-tag">{sk}</span>
                  ))}
                </div>

                <p className="preview-desc-text">{formData.description}</p>

                <div className="boss-job-card-foot">
                  <span className="boss-applicants-count">
                    <Users size={14} />
                    <span>0 Applicants</span>
                  </span>
                  <span className="boss-card-action-text">Matches Ready on Save</span>
                </div>
              </div>

              <div className="preview-guidance">
                <strong>💡 Automatic Talent Matching:</strong>
                <p>Once you click Publish, this JD will be saved to the database. All talent in the Global Minds pool will be scored against your skills and requirements.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
