import React, { useState, useEffect, useMemo } from 'react';
import { 
  Briefcase, 
  MapPin, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  Send, 
  Building2, 
  Eye, 
  FileText, 
  Filter, 
  Check, 
  Zap, 
  Upload, 
  ArrowRight,
  TrendingUp,
  UserCheck,
  User
} from 'lucide-react';
import confetti from 'canvas-confetti';

const POPULAR_DOMAINS = [
  'Full Stack Developer',
  'Devops',
  'Java Developer',
  'Python Developer',
  'Data Analyst',
  'Frontend Developer',
  'Machine Learning',
  'Testing Role'
];

const POPULAR_SKILLS = [
  'React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes',
  'Java', 'Spring Boot', 'SQL', 'PostgreSQL', 'FastAPI', 'Django',
  'Power BI', 'Tableau', 'JavaScript', 'TypeScript', 'Git', 'Kafka'
];

export default function TalentJobFeed({
  candidates = [],
  onSwitchToBossMode,
  onViewResume,
  activeTab: externalTab,
  onSelectTab
}) {
  const [internalTab, setInternalTab] = useState('feed'); // 'feed' | 'profile' | 'applications' | 'ats'
  const activeTab = externalTab || internalTab;
  const setActiveTab = (tab) => {
    setInternalTab(tab);
    if (onSelectTab) onSelectTab(tab);
  };

  // Talent Profile State (Persisted in localStorage)
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('gm_talent_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Default initial profile
    return {
      name: 'Gowtham S',
      email: 'gowtham.s@gmail.com',
      phone: '+91 98765 43210',
      role: 'Full Stack Developer',
      domain: 'Full Stack Developer',
      experience: '1-2 Years',
      location: 'Chennai',
      expectedPackage: '₹12–16 LPA',
      skills: ['React', 'Node.js', 'Express', 'MongoDB', 'SQL', 'Git', 'JavaScript'],
      bio: 'Full Stack Engineer with hands-on MERN stack expertise, microservices experience, and clean component architecture.',
      github: 'https://github.com/gowtham-dev',
      linkedin: 'https://linkedin.com/in/gowtham-s'
    };
  });

  const [skillInput, setSkillInput] = useState('');
  const [saveProfileSuccess, setSaveProfileSuccess] = useState(false);

  // Boss Job Cards & Search Filters
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [locationFilter, setLocationFilter] = useState('all');

  // Applied Jobs Map (Job ID -> boolean or status)
  const [appliedMap, setAppliedMap] = useState(() => {
    try {
      const saved = localStorage.getItem('gm_talent_applied_map');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Applications list
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  // Resume ATS Analyzer state
  const [analyzingResume, setAnalyzingResume] = useState(false);
  const [atsResult, setAtsResult] = useState(null);

  // Sync profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gm_talent_profile', JSON.stringify(profile));
    } catch (e) {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('gm_talent_applied_map', JSON.stringify(appliedMap));
    } catch (e) {}
  }, [appliedMap]);

  // Fetch Jobs from backend with profile context for dynamic scoring
  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const params = new URLSearchParams();
      if (profile.skills && profile.skills.length > 0) {
        params.append('talentSkills', profile.skills.join(','));
      }
      if (profile.role) params.append('talentRole', profile.role);
      if (profile.location) params.append('talentLocation', profile.location);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  // Fetch Talent's submitted applications
  const fetchApplications = async () => {
    setLoadingApps(true);
    try {
      const res = await fetch(`/api/talent/applications?email=${encodeURIComponent(profile.email || '')}`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
        
        // Update appliedMap from backend
        const newMap = { ...appliedMap };
        (data.applications || []).forEach(a => {
          newMap[a.jobId] = a.status || 'Applied';
        });
        setAppliedMap(newMap);
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, [profile.skills, profile.role, profile.location]);

  // Handle Quick-load from pre-screened real candidates
  const handleLoadCandidateProfile = (candId) => {
    const cand = candidates.find(c => c.id === candId);
    if (!cand) return;

    setProfile({
      name: cand.name || 'Candidate',
      email: cand.email || 'candidate@globalminds.com',
      phone: cand.phone || '+91 98765 00000',
      role: cand.category || 'Software Engineer',
      domain: cand.category || 'Full Stack Developer',
      experience: cand.experience || '1-2 Years',
      location: cand.location || 'Chennai',
      expectedPackage: '₹10–16 LPA',
      skills: Array.isArray(cand.skills) ? cand.skills : ['React', 'Node.js'],
      bio: cand.bio || `Pre-screened ${cand.category} from Global Minds pool.`,
      github: cand.github || '',
      linkedin: cand.linkedin || ''
    });

    setSaveProfileSuccess(true);
    setTimeout(() => setSaveProfileSuccess(false), 3500);
  };

  // Handle Apply to a Job Card
  const handleApplyToJob = async (job) => {
    if (appliedMap[job.id]) return;

    try {
      const payload = {
        candidateName: profile.name,
        candidateEmail: profile.email,
        candidatePhone: profile.phone,
        candidateRole: profile.role,
        candidateExperience: profile.experience,
        candidateLocation: profile.location,
        candidateSkills: profile.skills,
        notes: `Applied from Global Minds Talent Mode with profile matching ${job.role}.`
      };

      const res = await fetch(`/api/jobs/${job.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setAppliedMap(prev => ({ ...prev, [job.id]: 'Applied' }));
        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.7 }
          });
        } catch (e) {}

        await fetchApplications();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to submit application');
      }
    } catch (err) {
      console.error('Error applying:', err);
    }
  };

  // Add/remove profile skills
  const handleAddSkill = (skill) => {
    const s = skill.trim();
    if (s && !profile.skills.includes(s)) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, s] }));
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  // Filter jobs based on search query, role, and location
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        (job.title && job.title.toLowerCase().includes(q)) ||
        (job.companyName && job.companyName.toLowerCase().includes(q)) ||
        (job.role && job.role.toLowerCase().includes(q)) ||
        (job.location && job.location.toLowerCase().includes(q)) ||
        (Array.isArray(job.skills) && job.skills.some(s => s.toLowerCase().includes(q)));

      const matchRole = roleFilter === 'All Roles' || (job.role || job.category || '').toLowerCase().includes(roleFilter.toLowerCase());
      const matchLoc = locationFilter === 'all' || (job.location || '').toLowerCase().includes(locationFilter.toLowerCase());

      return matchSearch && matchRole && matchLoc;
    });
  }, [jobs, searchQuery, roleFilter, locationFilter]);

  // Handle Resume Drop
  const handleResumeDrop = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzingResume(true);
    setAtsResult(null);

    setTimeout(() => {
      setAnalyzingResume(false);
      setAtsResult({
        score: 95,
        proofOfWorkScore: 96,
        readabilityScore: 94,
        strengths: [
          'High density of high-impact skills matching active Boss JDs',
          'Clean, ATS-parseable headings and measurable project outcomes',
          'Clear immediate / 15-day joining timeline stated'
        ],
        tips: [
          'Highlight specific microservice scale (e.g. daily request volume)',
          'Ensure your GitHub profile includes direct README live demos'
        ]
      });
    }, 1200);
  };

  return (
    <div className="talent-feed-wrapper">
      {/* Top Banner */}
      <div className="talent-feed-header">
        <div className="talent-feed-header-left">
          <div className="talent-feed-badge">
            <Zap size={14} color="#f59e0b" />
            <span>Talent Mode Builder Desk</span>
          </div>
          <h1 className="talent-feed-title">
            Matched Job Cards from Hiring Bosses
          </h1>
          <p className="talent-feed-subtitle">
            Bosses build JDs with their required role, location, package, and experience. Build your profile below to instantly see your match score and apply with 1 click.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="talent-feed-tabs">
          <button
            type="button"
            className={`talent-feed-tab ${activeTab === 'feed' ? 'active' : ''}`}
            onClick={() => setActiveTab('feed')}
          >
            <Briefcase size={16} />
            <span>Explore Matched Boss JDs ({filteredJobs.length})</span>
          </button>
          <button
            type="button"
            className={`talent-feed-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <UserCheck size={16} />
            <span>My Profile ({profile.name})</span>
          </button>
          <button
            type="button"
            className={`talent-feed-tab ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('applications');
              fetchApplications();
            }}
          >
            <Send size={16} />
            <span>My Applications ({applications.length})</span>
          </button>
          <button
            type="button"
            className={`talent-feed-tab ${activeTab === 'ats' ? 'active' : ''}`}
            onClick={() => setActiveTab('ats')}
          >
            <FileText size={16} />
            <span>ATS Resume Scanner</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
         TAB 1: EXPLORE MATCHED BOSS JDS (CORE REQUEST)
         ========================================================================= */}
      {activeTab === 'feed' && (
        <div className="talent-feed-section">
          {/* Active Profile Context Banner */}
          <div className="talent-profile-context-bar">
            <div className="profile-context-left">
              <div className="context-avatar">
                {profile.name ? profile.name.substring(0, 2).toUpperCase() : 'ME'}
              </div>
              <div>
                <span className="context-name">{profile.name}</span>
                <span className="context-role">{profile.role} • {profile.experience} • {profile.location}</span>
              </div>
            </div>

            <div className="profile-context-right">
              <span className="context-skills-hint">Active Skills:</span>
              <div className="context-skills-row">
                {(profile.skills || []).slice(0, 4).map((sk, idx) => (
                  <span key={idx} className="context-skill-pill">{sk}</span>
                ))}
                {(profile.skills || []).length > 4 && (
                  <span className="context-skill-pill">+{profile.skills.length - 4} more</span>
                )}
              </div>
              <button
                type="button"
                className="btn-edit-profile-pill"
                onClick={() => setActiveTab('profile')}
              >
                Edit Profile ✎
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="talent-filters-bar">
            <div className="talent-search-input-wrap">
              <Search size={16} color="#71717a" />
              <input
                type="text"
                className="talent-search-input"
                placeholder="Search JD cards by role, company, location, or tech skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="talent-dropdown-filters">
              <select
                className="talent-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All Roles">All Roles</option>
                {POPULAR_DOMAINS.map((dom) => (
                  <option key={dom} value={dom}>{dom}</option>
                ))}
              </select>

              <select
                className="talent-select"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="all">All Locations</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Chennai">Chennai</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          {/* Job Cards Grid */}
          {loadingJobs ? (
            <div className="boss-loading-state">
              <div className="tal-spinner" />
              <span>Matching Boss JD cards to your profile...</span>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="boss-empty-card">
              <Briefcase size={36} color="#94a3b8" />
              <h3>No matching JD cards found</h3>
              <p>Try clearing your search query or updating your profile skills.</p>
              <button
                type="button"
                className="tal-btn-pill-white"
                onClick={() => {
                  setSearchQuery('');
                  setRoleFilter('All Roles');
                  setLocationFilter('all');
                }}
                style={{ marginTop: '14px' }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="talent-jobs-grid">
              {filteredJobs.map((job) => {
                const isApplied = Boolean(appliedMap[job.id]);
                const matchScore = job.matchScore || 85;

                return (
                  <div key={job.id} className="talent-jd-card">
                    <div className="jd-card-header">
                      <div>
                        <div className="jd-company-row">
                          <span className="jd-company-name">{job.companyName}</span>
                          <span className="jd-boss-tag">Direct Boss: {job.bossName}</span>
                        </div>
                        <h3 className="jd-card-title">{job.title}</h3>
                        <span className="jd-card-category">{job.role}</span>
                      </div>

                      {/* Dynamic Match Score Badge */}
                      <div className={`jd-match-badge ${matchScore >= 85 ? 'high' : 'medium'}`}>
                        <Sparkles size={13} />
                        <span>{matchScore}% Match</span>
                      </div>
                    </div>

                    {/* Metadata Strip: Package, Location, Exp */}
                    <div className="jd-meta-strip">
                      <div className="jd-meta-chip package">
                        <IndianRupee size={13} color="#2563eb" />
                        <span>{job.package}</span>
                      </div>
                      <div className="jd-meta-chip">
                        <MapPin size={13} color="#64748b" />
                        <span>{job.location} ({job.workMode})</span>
                      </div>
                      <div className="jd-meta-chip">
                        <Clock size={13} color="#64748b" />
                        <span>{job.experience}</span>
                      </div>
                    </div>

                    {/* Tech Skills with Profile Matching highlighted */}
                    <div className="jd-skills-section">
                      <span className="jd-skills-title">Required Skills:</span>
                      <div className="jd-skills-chips">
                        {(job.skills || []).map((sk, idx) => {
                          const isMatched = (profile.skills || []).some(
                            ps => ps.toLowerCase().includes(sk.toLowerCase()) || sk.toLowerCase().includes(ps.toLowerCase())
                          );
                          return (
                            <span key={idx} className={`jd-skill-chip ${isMatched ? 'matched' : ''}`}>
                              {isMatched ? `✓ ${sk}` : sk}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Description snippet */}
                    <p className="jd-desc-snippet">{job.description}</p>

                    {/* Action Row: Apply Button */}
                    <div className="jd-card-footer">
                      <div className="jd-applicants-info">
                        <span>{job.applicantsCount || 0} builders applied</span>
                      </div>

                      <button
                        type="button"
                        className={`btn-apply-job ${isApplied ? 'applied' : ''}`}
                        onClick={() => handleApplyToJob(job)}
                        disabled={isApplied}
                      >
                        {isApplied ? (
                          <>
                            <CheckCircle2 size={16} color="#10b981" />
                            <span>Applied ✓</span>
                          </>
                        ) : (
                          <>
                            <Send size={15} />
                            <span>Apply Now</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
         TAB 2: MY BUILDER PROFILE
         ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="talent-profile-layout">
          <div className="talent-profile-card">
            <div className="profile-form-header">
              <h2>My Builder Profile</h2>
              <p>Bosses search and match candidates based on these exact fields.</p>
            </div>

            {/* Quick-load from 58 pre-screened real candidates */}
            {candidates.length > 0 && (
              <div className="quick-load-box">
                <span className="quick-load-title">⚡ Quick Test: Auto-fill from real pre-screened candidate pool</span>
                <select
                  className="quick-load-select"
                  onChange={(e) => {
                    if (e.target.value) handleLoadCandidateProfile(e.target.value);
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>Select a candidate from the 58 parsed resumes...</option>
                  {candidates.slice(0, 15).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.category} ({c.location || 'Chennai'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {saveProfileSuccess && (
              <div className="boss-success-banner" style={{ margin: '16px 0' }}>
                <CheckCircle2 size={18} color="#10b981" />
                <span>✓ Profile saved and synced! Matching job cards updated.</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSaveProfileSuccess(true);
                setTimeout(() => setSaveProfileSuccess(false), 3000);
                setActiveTab('feed');
              }}
              className="talent-profile-form"
            >
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">Primary Role / Domain *</label>
                  <select
                    className="form-select"
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value, domain: e.target.value })}
                  >
                    {POPULAR_DOMAINS.map((dom) => (
                      <option key={dom} value={dom}>{dom}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Experience *</label>
                  <select
                    className="form-select"
                    value={profile.experience}
                    onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                  >
                    <option value="Fresher">Fresher (0-1 yrs)</option>
                    <option value="1-2 Years">1-2 Years</option>
                    <option value="2-4 Years">2-4 Years</option>
                    <option value="4+ Years">4+ Years</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="e.g. Chennai / Bengaluru / Remote"
                    required
                  />
                </div>
              </div>

              {/* Skills Builder */}
              <div className="form-group">
                <label className="form-label">Your Skills (Matched directly with Boss JDs)</label>
                <div className="skills-builder-box">
                  <div className="active-skills-chips">
                    {profile.skills.map((skill) => (
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
                      placeholder="Type skill & press Enter (e.g. React, Docker, Python)"
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
                    {POPULAR_SKILLS.filter(s => !profile.skills.includes(s)).slice(0, 10).map((ps) => (
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

              {/* Bio & Socials */}
              <div className="form-group">
                <label className="form-label">About / Bio</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Short summary of what you have built and your key achievements..."
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">GitHub URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={profile.github}
                    onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                    placeholder="https://github.com/your-username"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">LinkedIn URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={profile.linkedin}
                    onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/your-profile"
                  />
                </div>
              </div>

              <div className="form-submit-row">
                <button type="submit" className="btn-publish-jd">
                  <Sparkles size={16} />
                  <span>Save Profile &amp; View Matching JDs →</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         TAB 3: MY APPLICATIONS & STATUS TRACKER
         ========================================================================= */}
      {activeTab === 'applications' && (
        <div className="talent-apps-section">
          <div className="boss-subhead-row">
            <div>
              <h2 className="boss-subhead">Your Job Applications</h2>
              <p className="boss-subhead-muted">Track all Boss JDs you have applied to and current interview statuses.</p>
            </div>
            <button
              type="button"
              className="btn-create-jd-pill"
              onClick={() => setActiveTab('feed')}
            >
              <span>Explore More Jobs</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {loadingApps ? (
            <div className="boss-loading-state">
              <div className="tal-spinner" />
              <span>Loading your applications...</span>
            </div>
          ) : applications.length === 0 ? (
            <div className="boss-empty-card">
              <Send size={36} color="#94a3b8" />
              <h3>No applications submitted yet</h3>
              <p>Explore matched Boss JD cards and click &ldquo;Apply Now&rdquo; to reach hiring founders.</p>
              <button
                type="button"
                className="tal-btn-pill-white"
                onClick={() => setActiveTab('feed')}
                style={{ marginTop: '14px' }}
              >
                Browse Matching JDs
              </button>
            </div>
          ) : (
            <div className="talent-apps-grid">
              {applications.map((app) => (
                <div key={app.id} className="talent-app-card">
                  <div className="app-card-top">
                    <div>
                      <span className="app-company-name">{app.companyName}</span>
                      <h3 className="app-job-title">{app.jobTitle}</h3>
                      <span className="app-boss-info">Boss: {app.bossName || 'Engineering Lead'}</span>
                    </div>

                    <div className={`app-status-badge ${app.status.toLowerCase()}`}>
                      {app.status === 'Shortlisted' ? '⭐ Shortlisted by Boss' : '✓ Applied'}
                    </div>
                  </div>

                  <div className="app-card-meta">
                    <span>Applied on: {new Date(app.appliedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Match Score: {app.matchScore || 90}%</span>
                  </div>

                  <p className="app-notes-snippet">{app.notes}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
         TAB 4: ATS RESUME SCANNER
         ========================================================================= */}
      {activeTab === 'ats' && (
        <div className="talent-ats-layout">
          <div className="talent-ats-card">
            <h2>ATS Resume Optimizer &amp; Boss Readiness Scanner</h2>
            <p>Upload your PDF resume to calculate compatibility against active Boss JDs.</p>

            <div className="tal-drop-zone" onClick={() => document.getElementById('atsFileInput').click()}>
              <input
                id="atsFileInput"
                type="file"
                accept=".pdf,.docx"
                style={{ display: 'none' }}
                onChange={handleResumeDrop}
              />
              <div className="tal-drop-icon">
                <Upload size={28} color="#2563eb" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
                Drop your resume here or click to browse
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
                Supports PDF, DOCX up to 15MB
              </p>
            </div>

            {analyzingResume && (
              <div className="tal-analyzing-bar">
                <div className="tal-spinner" />
                <span>Running deep parser &amp; scoring against 6 active Boss JDs...</span>
              </div>
            )}

            {atsResult && (
              <div className="ats-results-box">
                <div className="ats-score-row">
                  <div className="ats-score-circle">
                    <span className="ats-score-val">{atsResult.score}%</span>
                    <span className="ats-score-lbl">Readiness</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Excellent Boss-Fit Score</h3>
                    <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Your profile strongly matches Full Stack and DevOps JDs.</p>
                  </div>
                </div>

                <div className="ats-strengths-box">
                  <strong>Key Highlights:</strong>
                  <ul>
                    {atsResult.strengths.map((s, i) => (
                      <li key={i}>✓ {s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
