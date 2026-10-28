import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Code, 
  ExternalLink, 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Briefcase, 
  MapPin, 
  GraduationCap, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  Upload, 
  MessageSquare, 
  Send, 
  Zap, 
  Check, 
  ChevronRight,
  UserCheck,
  Video,
  Award,
  Layers,
  Terminal,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Inline Brand Icons (GitHub & LinkedIn)
function GithubIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function LinkedinIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

// Verified Bosses / Companies scouting actively on Global Minds
const ACTIVE_BOSSES = [
  {
    id: 'boss-1',
    name: 'Aryan Merchant',
    role: 'VP of Engineering',
    company: 'Target India',
    companyBadge: 'Enterprise Product',
    logoBg: '#dc2626',
    avatar: 'AM',
    seeking: 'Full Stack & Distributed Systems Engineers',
    techStack: ['React', 'Node.js', 'Java', 'Docker', 'Kubernetes'],
    turnaround: '< 48 hours',
    activeRounds: 4,
    description: 'Looking for builders with strong CS fundamentals, hands-on microservices experience, and clean code practices.'
  },
  {
    id: 'boss-2',
    name: 'Sanchit Tripathi',
    role: 'Tech Lead & Architect',
    company: 'Cloudscale Systems',
    companyBadge: 'Series B Cloud Tech',
    logoBg: '#2563eb',
    avatar: 'ST',
    seeking: 'Cloud, DevOps & Backend Developers',
    techStack: ['Python', 'AWS', 'Terraform', 'FastAPI', 'PostgreSQL'],
    turnaround: '< 3 days',
    activeRounds: 6,
    description: 'Building next-gen multi-region cloud deployment tooling. Seeking engineers who know infrastructure as code and container pipelines.'
  },
  {
    id: 'boss-3',
    name: 'Vikramaditya Rao',
    role: 'Co-Founder & CTO',
    company: 'Stealth AI Labs',
    companyBadge: 'AI & LLM Infra',
    logoBg: '#7c3aed',
    avatar: 'VR',
    seeking: 'AI/ML Engineers & GenAI Builders',
    techStack: ['Python', 'PyTorch', 'LangChain', 'FastAPI', 'Vector DBs'],
    turnaround: 'Same-day review',
    activeRounds: 8,
    description: 'Direct founder interviews. We care about what you have built with LLMs, RAG architectures, and fine-tuned models over resume bullet points.'
  },
  {
    id: 'boss-4',
    name: 'Ananya Sen',
    role: 'Director of Product Engineering',
    company: 'FinTech Wave',
    companyBadge: 'FinTech High Scale',
    logoBg: '#059669',
    avatar: 'AS',
    seeking: 'Java & Spring Boot Backend Engineers',
    techStack: ['Core Java', 'Spring Boot', 'Kafka', 'MySQL', 'Redis'],
    turnaround: '< 4 days',
    activeRounds: 3,
    description: 'Hiring core backend engineers for transaction pipelines handling millions of daily real-time payment transfers.'
  },
  {
    id: 'boss-5',
    name: 'Rohan Mehra',
    role: 'Founder & CEO',
    company: 'Nexus SaaS Platform',
    companyBadge: 'YC Alum Startup',
    logoBg: '#d97706',
    avatar: 'RM',
    seeking: 'Frontend & React Product Builders',
    techStack: ['React.js', 'Next.js', 'TypeScript', 'Tailwind', 'GraphQL'],
    turnaround: '< 24 hours',
    activeRounds: 5,
    description: 'Fast-paced product environment. Looking for engineers obsessed with UI craft, micro-interactions, and 60fps web performance.'
  },
  {
    id: 'boss-6',
    name: 'Pooja Hegde',
    role: 'Head of Talent & Tech Hiring',
    company: 'Infosys Technologies',
    companyBadge: 'Global Tech Partner',
    logoBg: '#0284c7',
    avatar: 'PH',
    seeking: 'Full Stack & Java Developers (2024 Batch)',
    techStack: ['Java', 'React', 'Spring Boot', 'SQL', 'Git'],
    turnaround: '< 5 days',
    activeRounds: 12,
    description: 'Direct institutional placements for high-aptitude graduates ready for immediate client project deployments.'
  }
];

export default function TalentModeView({
  candidates = [],
  activeTab = 'dossier',
  onSelectTab,
  onViewResume,
  onDownloadResume,
  onSwitchToBossMode
}) {
  // Candidate selected for the Dossier preview (defaults to the first real candidate in pool)
  const [selectedCandidateId, setSelectedCandidateId] = useState(() => {
    return candidates.length > 0 ? candidates[0].id : null;
  });

  const activeCandidate = useMemo(() => {
    if (!candidates || candidates.length === 0) return null;
    return candidates.find((c) => c.id === selectedCandidateId) || candidates[0];
  }, [candidates, selectedCandidateId]);

  // Wave / Share Dossier State
  const [wavedBosses, setWavedBosses] = useState({});
  const [waveSuccessMessage, setWaveSuccessMessage] = useState(null);

  // Resume Analyzer Form State
  const [resumeFile, setResumeFile] = useState(null);
  const [analyzerScore, setAnalyzerScore] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    name: 'Ankit Sharma',
    email: 'ankit.sharma@example.com',
    role: 'Full Stack Developer',
    github: 'https://github.com/ankit-dev',
    linkedin: 'https://linkedin.com/in/ankit-sharma',
    featuredProject: 'Cloud-Native Distributed Task Queue with Redis & Go',
    aiProject: 'AI Document Summarizer using LangChain & ChromaDB'
  });
  const [submittedToNetwork, setSubmittedToNetwork] = useState(false);

  // Handle Waving at a Boss
  const handleWaveAtBoss = (boss) => {
    setWavedBosses((prev) => ({ ...prev, [boss.id]: true }));
    setWaveSuccessMessage(`Your Builder Dossier was shared directly with ${boss.name} (${boss.company})! They typically respond within ${boss.turnaround}.`);
    
    // Trigger small confetti
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // ignore
    }

    setTimeout(() => {
      setWaveSuccessMessage(null);
    }, 5500);
  };

  // Handle Resume Drop / File Upload
  const handleResumeSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeFile(file);
    setIsAnalyzing(true);
    setAnalyzerScore(null);

    // Simulate smart ATS & Boss-readiness analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzerScore({
        overall: 94,
        proofOfWork: 96,
        domainFit: 92,
        atsReadability: 95,
        highlights: [
          'Strong full-stack architecture projects with GitHub links detected',
          'Modern framework keywords identified (React, Node.js, REST APIs)',
          'Clear 0–15 day immediate availability highlighted'
        ]
      });
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    }, 1200);
  };

  const handleSubmitProfile = (e) => {
    e.preventDefault();
    setSubmittedToNetwork(true);
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch (err) {}
  };

  // Scheduled / Active Interviews for the Talent Pipeline
  const liveInterviews = useMemo(() => {
    const fromCandidates = candidates.filter(
      (c) => c.interviewScheduled === true || c.status === 'Interview Scheduled'
    );
    
    // Provide rich realistic items matching the Tal App experience
    return [
      {
        id: 'int-1',
        company: 'Target India',
        interviewer: 'Aryan Merchant (VP of Engineering)',
        round: 'System Architecture & Hands-on Coding Round',
        date: 'Tomorrow, Oct 21',
        time: '11:30 AM - 12:30 PM IST',
        meetLink: 'https://meet.google.com/gm-target-round1',
        status: 'Confirmed 🟢',
        notes: 'Discussion around state normalization, REST API rate-limiting, and previous projects.'
      },
      {
        id: 'int-2',
        company: 'Stealth AI Labs',
        interviewer: 'Vikramaditya Rao (Founder & CTO)',
        round: 'Founder Chat & AI Proof of Work Review',
        date: 'Thursday, Oct 23',
        time: '3:00 PM - 3:45 PM IST',
        meetLink: 'https://meet.google.com/gm-stealth-ai',
        status: 'Confirmed 🟢',
        notes: 'Founder deep-dive into your LLM fine-tuning project and vector database queries.'
      },
      {
        id: 'int-3',
        company: 'Cloudscale Systems',
        interviewer: 'Sanchit Tripathi (Tech Lead)',
        round: 'DevOps & Cloud Infrastructure Discussion',
        date: 'Pending Your Confirmation',
        time: 'Flexible Slots Available',
        meetLink: null,
        status: 'Invitation Pending Confirmation ⏳',
        notes: 'Received direct invite based on your Docker & Kubernetes credentials.'
      }
    ];
  }, [candidates]);

  return (
    <div className="tal-talent-container">
      {/* 1. TALENT MODE HERO BANNER */}
      <section className="tal-talent-hero">
        <div className="container">
          <div className="tal-talent-hero-inner">
            <div className="tal-talent-hero-badge-row">
              <span className="tal-mode-active-pill">
                <Zap size={13} className="text-amber-400" />
                <span>Talent Mode Active</span>
              </span>
              <span className="tal-talent-sub-tag">
                For Engineers, Developers &amp; Builders
              </span>
            </div>

            <h1 className="tal-talent-title">
              Showcase what you&apos;ve built.<br />
              <span className="tal-talent-title-gradient">Get hired directly by bosses.</span>
            </h1>

            <p className="tal-talent-lead">
              Bypass recruiters, agency spam, and HR blackholes. Put your code, GitHub repositories, and AI proof-of-work straight onto the desks of 3,000+ hiring founders and engineering leaders.
            </p>

            {/* Quick Action CTAs */}
            <div className="tal-talent-hero-ctas">
              <button 
                className="tal-btn-hero-primary"
                onClick={() => onSelectTab('dossier')}
              >
                <span>View My Builder Dossier</span>
                <ChevronRight size={15} />
              </button>

              <button 
                className="tal-btn-hero-secondary"
                onClick={() => onSelectTab('bosses')}
              >
                <Building2 size={14} color="#60a5fa" />
                <span>See Who&apos;s Hiring Now ({ACTIVE_BOSSES.length} Bosses)</span>
              </button>

              <button 
                className="tal-btn-hero-ghost"
                onClick={() => onSelectTab('upload')}
              >
                <Upload size={14} />
                <span>Upload &amp; Optimize Resume</span>
              </button>
            </div>

            {/* Metric Highlights */}
            <div className="tal-talent-hero-stats">
              <div className="tal-talent-stat-box">
                <span className="tal-talent-stat-num">{candidates.length || 58}</span>
                <span className="tal-talent-stat-lbl">Active Builder Profiles</span>
              </div>
              <div className="tal-talent-stat-sep" />
              <div className="tal-talent-stat-box">
                <span className="tal-talent-stat-num">100%</span>
                <span className="tal-talent-stat-lbl">Direct Founder Access</span>
              </div>
              <div className="tal-talent-stat-sep" />
              <div className="tal-talent-stat-box">
                <span className="tal-talent-stat-num">₹0</span>
                <span className="tal-talent-stat-lbl">Commission or Cut</span>
              </div>
              <div className="tal-talent-stat-sep" />
              <div className="tal-talent-stat-box">
                <span className="tal-talent-stat-num">&lt; 48h</span>
                <span className="tal-talent-stat-lbl">Average Boss Response</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TALENT MODE NAVIGATION TABS (Matching the Tal App Page Structure) */}
      <nav className="tal-talent-nav-strip">
        <div className="container">
          <div className="tal-talent-tabs">
            <button
              className={`tal-talent-tab ${activeTab === 'dossier' ? 'active' : ''}`}
              onClick={() => onSelectTab('dossier')}
            >
              <UserCheck size={16} />
              <span>Builder Dossier</span>
              <span className="tal-tab-indicator-badge">Live</span>
            </button>

            <button
              className={`tal-talent-tab ${activeTab === 'bosses' ? 'active' : ''}`}
              onClick={() => onSelectTab('bosses')}
            >
              <Building2 size={16} />
              <span>Active Hiring Bosses</span>
              <span className="tal-tab-count-badge">{ACTIVE_BOSSES.length}</span>
            </button>

            <button
              className={`tal-talent-tab ${activeTab === 'pipeline' ? 'active' : ''}`}
              onClick={() => onSelectTab('pipeline')}
            >
              <Calendar size={16} />
              <span>Interview Pipeline</span>
              <span className="tal-tab-count-badge" style={{ background: '#10b981', color: '#ffffff' }}>
                {liveInterviews.length}
              </span>
            </button>

            <button
              className={`tal-talent-tab ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => onSelectTab('upload')}
            >
              <Upload size={16} />
              <span>Upload &amp; Optimize Resume</span>
            </button>

            <button
              className={`tal-talent-tab ${activeTab === 'playbook' ? 'active' : ''}`}
              onClick={() => onSelectTab('playbook')}
            >
              <Award size={16} />
              <span>Talent Playbook</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Waved notification banner */}
      {waveSuccessMessage && (
        <div className="container" style={{ marginTop: '16px' }}>
          <div className="tal-wave-banner">
            <CheckCircle2 size={18} color="#10b981" />
            <span>{waveSuccessMessage}</span>
          </div>
        </div>
      )}

      {/* 3. DYNAMIC PAGES INSIDE TALENT MODE */}
      <main className="container" style={{ paddingBottom: '80px', paddingTop: '24px' }}>
        
        {/* ===================================================================
            PAGE 1: BUILDER DOSSIER & PROFILE SHOWCASE
            =================================================================== */}
        {activeTab === 'dossier' && (
          <div className="tal-tab-page">
            {/* Header Switcher: Lets user preview different real profiles in the network */}
            <div className="tal-dossier-control-bar">
              <div>
                <span className="tal-section-badge">How Bosses See You</span>
                <h2 className="tal-dossier-heading">Builder Dossier Preview</h2>
                <p style={{ color: 'var(--tal-light-text-muted)', fontSize: '0.88rem' }}>
                  This interactive dossier showcases your verified skills, live projects, GitHub work, and resume directly to founders.
                </p>
              </div>

              {candidates.length > 0 && (
                <div className="tal-candidate-select-wrapper">
                  <label htmlFor="builder-select" style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--tal-light-text-muted)' }}>
                    Preview Candidate Dossier:
                  </label>
                  <select
                    id="builder-select"
                    className="tal-candidate-select"
                    value={activeCandidate?.id || ''}
                    onChange={(e) => setSelectedCandidateId(Number(e.target.value))}
                  >
                    {candidates.map((cand) => (
                      <option key={cand.id} value={cand.id}>
                        {cand.name} — {cand.category} ({cand.location || 'Bangalore'})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {activeCandidate ? (
              <div className="tal-dossier-layout">
                {/* Left: Main Builder Profile & Proof of Work */}
                <div className="tal-dossier-main">
                  {/* Profile Card Header */}
                  <div className="tal-dossier-header-card">
                    <div className="tal-dossier-avatar-row">
                      <div className="tal-dossier-avatar">
                        {(activeCandidate.name || 'GM')
                          .split(' ')
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((w) => w[0])
                          .join('')
                          .toUpperCase()}
                      </div>
                      <div className="tal-dossier-title-area">
                        <div className="tal-dossier-name-row">
                          <h3 className="tal-dossier-name">{activeCandidate.name}</h3>
                          <span className="tal-verified-badge" title="Verified by Global Minds Technical Assessment">
                            <ShieldCheck size={14} color="#10b981" />
                            <span>Verified Builder</span>
                          </span>
                        </div>
                        <p className="tal-dossier-role">
                          {activeCandidate.category || 'Full Stack Engineer'}
                        </p>
                        <div className="tal-dossier-meta-row">
                          <span className="tal-dossier-meta-item">
                            <MapPin size={13} />
                            <span>{activeCandidate.location || 'Bengaluru, India'}</span>
                          </span>
                          <span className="tal-dossier-meta-item">
                            <GraduationCap size={13} />
                            <span>{activeCandidate.education || 'B.E. Computer Science'}</span>
                          </span>
                          <span className="tal-dossier-meta-item tal-availability-tag">
                            <span className="tal-pulse-dot" />
                            <span>Available Immediately (0–15 Days)</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="tal-dossier-bio">
                      <p>
                        {activeCandidate.bio || `Specialized engineer in ${activeCandidate.category}. Demonstrated ability to architect scalable software systems, write well-tested modular code, and ship user-centric products under modern Agile development workflows.`}
                      </p>
                    </div>

                    {/* Quick Profile Actions */}
                    <div className="tal-dossier-actions">
                      <button
                        className="tal-btn-pill-white"
                        onClick={() => onViewResume && onViewResume(activeCandidate)}
                      >
                        <FileText size={14} />
                        <span>Preview Resume PDF</span>
                      </button>

                      <button
                        className="tal-btn-outline"
                        onClick={() => onDownloadResume && onDownloadResume(activeCandidate)}
                      >
                        <Download size={14} />
                        <span>Download Dossier</span>
                      </button>

                      <a
                        href={`https://github.com/search?q=${encodeURIComponent(activeCandidate.name)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="tal-btn-ghost-social"
                        title="GitHub Repository"
                      >
                        <GithubIcon size={15} />
                        <span>GitHub</span>
                      </a>

                      <a
                        href={`https://linkedin.com/search/results/all/?keywords=${encodeURIComponent(activeCandidate.name)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="tal-btn-ghost-social"
                        title="LinkedIn Profile"
                      >
                        <LinkedinIcon size={15} />
                        <span>LinkedIn</span>
                      </a>
                    </div>
                  </div>

                  {/* Section: "What I'm Currently Building" (The Tal hallmark) */}
                  <div className="tal-dossier-card">
                    <div className="tal-card-title-row">
                      <div className="tal-card-icon-box">
                        <Terminal size={16} />
                      </div>
                      <div>
                        <h4 className="tal-card-title">What I&apos;m Currently Building</h4>
                        <span className="tal-card-sub">Active projects and production architecture</span>
                      </div>
                    </div>

                    <div className="tal-project-grid">
                      <div className="tal-project-item">
                        <div className="tal-project-top">
                          <span className="tal-project-type">Full Stack Architecture</span>
                          <div className="tal-project-links">
                            <a href="#github" onClick={(e) => e.preventDefault()} className="tal-project-link">
                              <GithubIcon size={13} /> Code
                            </a>
                            <a href="#demo" onClick={(e) => e.preventDefault()} className="tal-project-link">
                              <ExternalLink size={13} /> Live
                            </a>
                          </div>
                        </div>
                        <h5 className="tal-project-name">
                          Distributed Cloud Microservices &amp; Event Stream Pipeline
                        </h5>
                        <p className="tal-project-desc">
                          Engineered a fault-tolerant message queue using Redis streams and Node.js workers. Implemented WebSocket real-time synchronization with 99.98% uptime.
                        </p>
                        <div className="tal-project-tags">
                          <span>React</span>
                          <span>Node.js</span>
                          <span>Docker</span>
                          <span>Redis</span>
                          <span>PostgreSQL</span>
                        </div>
                      </div>

                      <div className="tal-project-item">
                        <div className="tal-project-top">
                          <span className="tal-project-type">Production Web App</span>
                          <div className="tal-project-links">
                            <a href="#github" onClick={(e) => e.preventDefault()} className="tal-project-link">
                              <GithubIcon size={13} /> Code
                            </a>
                            <a href="#demo" onClick={(e) => e.preventDefault()} className="tal-project-link">
                              <ExternalLink size={13} /> Live
                            </a>
                          </div>
                        </div>
                        <h5 className="tal-project-name">
                          Real-Time Collaborative Code Playground &amp; Runner
                        </h5>
                        <p className="tal-project-desc">
                          Built a collaborative IDE using Monaco Editor and Web Workers for sandboxed runtime execution. Designed clean component boundaries with CSS modularity.
                        </p>
                        <div className="tal-project-tags">
                          <span>TypeScript</span>
                          <span>React</span>
                          <span>WebSockets</span>
                          <span>Vite</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section: "What I've Built with AI" */}
                  <div className="tal-dossier-card">
                    <div className="tal-card-title-row">
                      <div className="tal-card-icon-box" style={{ background: '#7c3aed', color: '#ffffff' }}>
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <h4 className="tal-card-title">What I&apos;ve Built with AI</h4>
                        <span className="tal-card-sub">Applied GenAI, LLM integration, and automation tools</span>
                      </div>
                    </div>

                    <div className="tal-ai-box">
                      <div className="tal-ai-item">
                        <span className="tal-ai-badge">GenAI Agent</span>
                        <h5 className="tal-ai-title">Context-Aware Resume ATS Optimizer &amp; Semantic Query Engine</h5>
                        <p className="tal-ai-desc">
                          Integrated LangChain and embeddings to parse unstructured candidate dossiers. Provides automated skill extraction with 95% classification precision.
                        </p>
                        <div className="tal-project-tags">
                          <span>Python</span>
                          <span>LangChain</span>
                          <span>OpenAI API</span>
                          <span>FastAPI</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section: Tech Stack & Core Competencies */}
                  <div className="tal-dossier-card">
                    <div className="tal-card-title-row">
                      <div className="tal-card-icon-box" style={{ background: '#0284c7', color: '#ffffff' }}>
                        <Layers size={16} />
                      </div>
                      <div>
                        <h4 className="tal-card-title">Technical Competency Matrix</h4>
                        <span className="tal-card-sub">Core languages, frameworks, databases, and DevOps tools</span>
                      </div>
                    </div>

                    <div className="tal-tech-matrix">
                      <div className="tal-matrix-col">
                        <span className="tal-matrix-cat">Languages &amp; Core</span>
                        <div className="tal-matrix-chips">
                          {['JavaScript (ES6+)', 'TypeScript', 'Python', 'Java', 'SQL'].map((t) => (
                            <span key={t} className="tal-chip">{t}</span>
                          ))}
                        </div>
                      </div>

                      <div className="tal-matrix-col">
                        <span className="tal-matrix-cat">Frameworks &amp; Libraries</span>
                        <div className="tal-matrix-chips">
                          {(activeCandidate.skills || 'React.js, Node.js, Express, REST APIs')
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean)
                            .map((s) => (
                              <span key={s} className="tal-chip tal-chip-accent">{s}</span>
                            ))}
                        </div>
                      </div>

                      <div className="tal-matrix-col">
                        <span className="tal-matrix-cat">Infrastructure &amp; Databases</span>
                        <div className="tal-matrix-chips">
                          {['PostgreSQL', 'MongoDB', 'Docker', 'Git', 'AWS S3', 'REST'].map((t) => (
                            <span key={t} className="tal-chip">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Boss Activity Sidebar & Dossier Stats */}
                <div className="tal-dossier-sidebar">
                  {/* Live Activity Card */}
                  <div className="tal-sidebar-card">
                    <span className="tal-sidebar-label">Boss Network Activity</span>
                    <h4 className="tal-sidebar-title">Profile Reach This Week</h4>

                    <div className="tal-reach-metrics">
                      <div className="tal-reach-item">
                        <span className="tal-reach-val">14</span>
                        <span className="tal-reach-txt">Founder Views</span>
                      </div>
                      <div className="tal-reach-item">
                        <span className="tal-reach-val">3</span>
                        <span className="tal-reach-txt">Shortlists</span>
                      </div>
                      <div className="tal-reach-item">
                        <span className="tal-reach-val">128</span>
                        <span className="tal-reach-txt">Impressions</span>
                      </div>
                    </div>

                    <div className="tal-active-bosses-peek">
                      <span className="tal-peek-head">Recently Viewed by:</span>
                      <div className="tal-peek-list">
                        <div className="tal-peek-item">
                          <span className="tal-peek-dot" />
                          <span>Target India Engineering Team</span>
                        </div>
                        <div className="tal-peek-item">
                          <span className="tal-peek-dot" />
                          <span>Stealth AI Labs Founders</span>
                        </div>
                        <div className="tal-peek-item">
                          <span className="tal-peek-dot" />
                          <span>Cloudscale Systems Tech Leads</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Switch to Boss Mode promo card */}
                  <div className="tal-sidebar-card tal-card-dark-gradient">
                    <Briefcase size={20} color="#f59e0b" />
                    <h4 style={{ color: '#ffffff', fontSize: '1rem', margin: '10px 0 6px', fontWeight: 700 }}>
                      Hiring for your team?
                    </h4>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '14px' }}>
                      Switch to Boss Mode to browse all 58 pre-screened builders, download dossiers, and schedule direct interviews.
                    </p>
                    <button
                      className="tal-btn-pill-white"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={onSwitchToBossMode}
                    >
                      <span>Switch to Boss Mode</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>No builder profile available.</p>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            PAGE 2: WHO'S HIRING ON GLOBAL MINDS (BOSS DIRECTORY)
            =================================================================== */}
        {activeTab === 'bosses' && (
          <div className="tal-tab-page">
            <div className="tal-tab-header">
              <span className="tal-section-badge">Direct Line to Founders</span>
              <h2 className="tal-dossier-heading">Bosses Scouting Right Now</h2>
              <p style={{ color: 'var(--tal-light-text-muted)', fontSize: '0.92rem', maxWidth: '640px' }}>
                Founders, Tech Leads, and Engineering Directors actively reviewing builder dossiers on Global Minds. Click &quot;Wave at Boss&quot; to send your profile directly to their desk.
              </p>
            </div>

            <div className="tal-boss-grid">
              {ACTIVE_BOSSES.map((boss) => {
                const isWaved = wavedBosses[boss.id];
                return (
                  <div key={boss.id} className="tal-boss-card">
                    {/* Header with Boss info */}
                    <div className="tal-boss-header">
                      <div className="tal-boss-avatar" style={{ background: boss.logoBg }}>
                        {boss.avatar}
                      </div>
                      <div className="tal-boss-info">
                        <div className="tal-boss-name-row">
                          <h4 className="tal-boss-name">{boss.name}</h4>
                          <span className="tal-boss-badge">{boss.companyBadge}</span>
                        </div>
                        <p className="tal-boss-role">{boss.role} • <strong>{boss.company}</strong></p>
                      </div>
                    </div>

                    {/* What they are seeking */}
                    <div className="tal-boss-seeking-box">
                      <span className="tal-boss-seeking-lbl">Looking for:</span>
                      <p className="tal-boss-seeking-text">{boss.seeking}</p>
                    </div>

                    <p className="tal-boss-desc">{boss.description}</p>

                    {/* Tech stack requested */}
                    <div className="tal-boss-stack">
                      {boss.techStack.map((tech) => (
                        <span key={tech} className="tal-chip">{tech}</span>
                      ))}
                    </div>

                    {/* Turnaround and Action Footer */}
                    <div className="tal-boss-footer">
                      <div className="tal-boss-turnaround">
                        <Clock size={13} color="#10b981" />
                        <span>Responds in {boss.turnaround}</span>
                      </div>

                      <button
                        className={`tal-btn-wave ${isWaved ? 'waved' : ''}`}
                        onClick={() => handleWaveAtBoss(boss)}
                        disabled={isWaved}
                      >
                        {isWaved ? (
                          <>
                            <Check size={14} />
                            <span>Dossier Sent!</span>
                          </>
                        ) : (
                          <>
                            <Send size={14} />
                            <span>Wave at Boss</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================================================
            PAGE 3: DIRECT INTERVIEW PIPELINE
            =================================================================== */}
        {activeTab === 'pipeline' && (
          <div className="tal-tab-page">
            <div className="tal-tab-header">
              <span className="tal-section-badge">Live Status</span>
              <h2 className="tal-dossier-heading">Your Boss Interview Pipeline</h2>
              <p style={{ color: 'var(--tal-light-text-muted)', fontSize: '0.92rem', maxWidth: '640px' }}>
                Track direct interview invitations, scheduled rounds, and calendar invites from hiring founders and engineering directors.
              </p>
            </div>

            <div className="tal-pipeline-layout">
              <div className="tal-pipeline-list">
                {liveInterviews.map((intv) => (
                  <div key={intv.id} className="tal-pipeline-card">
                    <div className="tal-pipeline-card-header">
                      <div>
                        <div className="tal-pipeline-company-row">
                          <h4 className="tal-pipeline-company">{intv.company}</h4>
                          <span className="tal-pipeline-status-badge">
                            {intv.status}
                          </span>
                        </div>
                        <p className="tal-pipeline-interviewer">{intv.interviewer}</p>
                      </div>

                      <div className="tal-pipeline-datetime">
                        <Calendar size={14} color="#2563eb" />
                        <span>{intv.date} • {intv.time}</span>
                      </div>
                    </div>

                    <div className="tal-pipeline-round-box">
                      <span className="tal-pipeline-round-label">Round:</span>
                      <p className="tal-pipeline-round-name">{intv.round}</p>
                    </div>

                    <p className="tal-pipeline-notes">{intv.notes}</p>

                    <div className="tal-pipeline-footer">
                      {intv.meetLink ? (
                        <a
                          href={intv.meetLink}
                          target="_blank"
                          rel="noreferrer"
                          className="tal-btn-pill-white"
                          style={{ background: '#10b981', color: '#ffffff', border: 'none' }}
                        >
                          <Video size={14} />
                          <span>Join Video Meeting</span>
                        </a>
                      ) : (
                        <button
                          className="tal-btn-pill-white"
                          onClick={() => alert('Calendar invite accepted! Boss team has been notified.')}
                        >
                          <CheckCircle2 size={14} color="#10b981" />
                          <span>Accept &amp; Confirm Slot</span>
                        </button>
                      )}

                      <button
                        className="tal-btn-outline"
                        onClick={() => alert('Reschedule request sent to hiring team.')}
                      >
                        <span>Request Reschedule</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Preparation Advice for Founders */}
              <div className="tal-pipeline-sidebar">
                <div className="tal-sidebar-card">
                  <div className="tal-card-icon-box" style={{ background: '#f59e0b', color: '#ffffff' }}>
                    <Zap size={16} />
                  </div>
                  <h4 className="tal-sidebar-title" style={{ marginTop: '12px' }}>
                    How to Ace Direct Founder Rounds
                  </h4>
                  <ul className="tal-tips-list">
                    <li>
                      <strong>Talk about architecture trade-offs:</strong> Founders care why you chose React over Next.js or PostgreSQL over MongoDB.
                    </li>
                    <li>
                      <strong>Show live GitHub code:</strong> Be ready to share your screen and walk through your actual commit history and project structures.
                    </li>
                    <li>
                      <strong>Highlight AI tool usage:</strong> Demonstrate how you use AI to write tests, scaffold APIs, or debug bottlenecks faster.
                    </li>
                    <li>
                      <strong>Ask about product velocity:</strong> Inquire about their release cycle, customer feedback loops, and deployment frequency.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            PAGE 4: UPLOAD & OPTIMIZE RESUME (JOIN BOSS NETWORK)
            =================================================================== */}
        {activeTab === 'upload' && (
          <div className="tal-tab-page">
            <div className="tal-tab-header">
              <span className="tal-section-badge">Join Global Minds Talent Network</span>
              <h2 className="tal-dossier-heading">Upload &amp; Optimize Your Resume</h2>
              <p style={{ color: 'var(--tal-light-text-muted)', fontSize: '0.92rem', maxWidth: '640px' }}>
                Upload your resume PDF or Word document. Our smart parser scans your tech stack, extracts your proof of work, and prepares your profile for direct Boss discovery.
              </p>
            </div>

            <div className="tal-upload-grid">
              {/* Left: Drag and drop file area & Scanner */}
              <div className="tal-upload-col">
                <div className="tal-dossier-card">
                  <h4 className="tal-card-title">1. Drop Resume File</h4>
                  <span className="tal-card-sub">PDF or DOCX (Max 15MB)</span>

                  <label className="tal-drop-zone" htmlFor="resume-upload-input">
                    <input
                      id="resume-upload-input"
                      type="file"
                      accept=".pdf,.docx,.doc"
                      style={{ display: 'none' }}
                      onChange={handleResumeSelect}
                    />
                    <div className="tal-drop-icon">
                      <Upload size={32} color="#2563eb" />
                    </div>
                    {resumeFile ? (
                      <div>
                        <p style={{ fontWeight: 700, color: '#101011' }}>{resumeFile.name}</p>
                        <span style={{ fontSize: '0.8rem', color: '#10b981' }}>File loaded • Click to replace</span>
                      </div>
                    ) : (
                      <div>
                        <p style={{ fontWeight: 700, color: '#101011' }}>
                          Drag &amp; drop resume here, or <span style={{ color: '#2563eb' }}>browse files</span>
                        </p>
                        <span style={{ fontSize: '0.78rem', color: 'var(--tal-light-text-muted)' }}>
                          Supports PDF, DOCX, DOC
                        </span>
                      </div>
                    )}
                  </label>

                  {/* Analyzer Live Feedback */}
                  {isAnalyzing && (
                    <div className="tal-analyzing-bar">
                      <div className="tal-spinner" />
                      <span>Scanning resume keywords, GitHub links, and project proof of work...</span>
                    </div>
                  )}

                  {analyzerScore && (
                    <div className="tal-analysis-result-card">
                      <div className="tal-analysis-score-row">
                        <div className="tal-score-circle">
                          <span className="tal-score-num">{analyzerScore.overall}%</span>
                          <span className="tal-score-lbl">Boss Ready</span>
                        </div>
                        <div>
                          <h5 style={{ fontWeight: 700, fontSize: '1rem', color: '#101011' }}>
                            Excellent Candidate Readiness
                          </h5>
                          <p style={{ fontSize: '0.82rem', color: 'var(--tal-light-text-muted)' }}>
                            Your profile has high visibility potential for hiring founders in Full Stack &amp; Backend engineering.
                          </p>
                        </div>
                      </div>

                      <div className="tal-analysis-highlights">
                        {analyzerScore.highlights.map((h, i) => (
                          <div key={i} className="tal-highlight-item">
                            <CheckCircle2 size={14} color="#10b981" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Quick Builder Profile Form */}
              <div className="tal-upload-col">
                <div className="tal-dossier-card">
                  <h4 className="tal-card-title">2. Complete Builder Dossier Details</h4>
                  <span className="tal-card-sub">Information visible to hiring bosses</span>

                  {submittedToNetwork ? (
                    <div className="tal-submitted-success-box">
                      <CheckCircle2 size={42} color="#10b981" style={{ margin: '0 auto 12px' }} />
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#101011' }}>
                        You&apos;re Live on the Boss Network!
                      </h4>
                      <p style={{ color: 'var(--tal-light-text-muted)', fontSize: '0.88rem', margin: '8px 0 18px' }}>
                        Founders and engineering leaders can now view your dossier and schedule direct interviews with you.
                      </p>
                      <button
                        className="tal-btn-pill-white"
                        onClick={() => {
                          setSubmittedToNetwork(false);
                          onSelectTab('dossier');
                        }}
                      >
                        <span>View My Profile Preview</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitProfile} className="tal-builder-form">
                      <div className="tal-form-group">
                        <label className="tal-label">Full Name</label>
                        <input
                          type="text"
                          required
                          className="tal-input"
                          value={uploadFormData.name}
                          onChange={(e) => setUploadFormData({ ...uploadFormData, name: e.target.value })}
                        />
                      </div>

                      <div className="tal-form-group">
                        <label className="tal-label">Work Email</label>
                        <input
                          type="email"
                          required
                          className="tal-input"
                          value={uploadFormData.email}
                          onChange={(e) => setUploadFormData({ ...uploadFormData, email: e.target.value })}
                        />
                      </div>

                      <div className="tal-form-group">
                        <label className="tal-label">Primary Role / Domain</label>
                        <select
                          className="tal-input"
                          value={uploadFormData.role}
                          onChange={(e) => setUploadFormData({ ...uploadFormData, role: e.target.value })}
                        >
                          <option value="Full Stack Developer">Full Stack Developer</option>
                          <option value="Java Developer">Java Developer</option>
                          <option value="Python Developer">Python Developer</option>
                          <option value="Devops">DevOps &amp; Cloud</option>
                          <option value="React.js Developer">React.js Developer</option>
                          <option value="Machine Learning">Machine Learning / AI</option>
                          <option value="Data Analyst">Data Analyst</option>
                        </select>
                      </div>

                      <div className="tal-form-row">
                        <div className="tal-form-group">
                          <label className="tal-label">GitHub URL</label>
                          <input
                            type="url"
                            className="tal-input"
                            value={uploadFormData.github}
                            onChange={(e) => setUploadFormData({ ...uploadFormData, github: e.target.value })}
                          />
                        </div>

                        <div className="tal-form-group">
                          <label className="tal-label">LinkedIn URL</label>
                          <input
                            type="url"
                            className="tal-input"
                            value={uploadFormData.linkedin}
                            onChange={(e) => setUploadFormData({ ...uploadFormData, linkedin: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="tal-form-group">
                        <label className="tal-label">Featured Project Headline</label>
                        <input
                          type="text"
                          className="tal-input"
                          value={uploadFormData.featuredProject}
                          onChange={(e) => setUploadFormData({ ...uploadFormData, featuredProject: e.target.value })}
                        />
                      </div>

                      <button
                        type="submit"
                        className="tal-btn-pill-white"
                        style={{ width: '100%', justifyContent: 'center', marginTop: '12px', background: '#101011', color: '#ffffff' }}
                      >
                        <Sparkles size={14} color="#f59e0b" />
                        <span>Publish Dossier to Boss Network</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            PAGE 5: TALENT PLAYBOOK & PERKS
            =================================================================== */}
        {activeTab === 'playbook' && (
          <div className="tal-tab-page">
            <div className="tal-tab-header">
              <span className="tal-section-badge">The Global Minds Advantage</span>
              <h2 className="tal-dossier-heading">Why Top Builders Choose Global Minds</h2>
              <p style={{ color: 'var(--tal-light-text-muted)', fontSize: '0.92rem', maxWidth: '640px' }}>
                We believe engineering talent should be hired for what they can build, not how well their resume tricks an ATS algorithm.
              </p>
            </div>

            {/* Direct Comparison Table */}
            <div className="tal-dossier-card" style={{ overflowX: 'auto', marginBottom: '32px' }}>
              <table className="tal-comparison-table">
                <thead>
                  <tr>
                    <th>Hiring Criteria</th>
                    <th className="highlight-col">Global Minds (Talent Mode)</th>
                    <th>Traditional Portals (Naukri, Indeed)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Direct Access</strong></td>
                    <td className="highlight-col"><span className="text-emerald-600 font-semibold">100% Direct to Founders &amp; CTOs</span></td>
                    <td>Blocked by 3+ layers of HR recruiters &amp; agencies</td>
                  </tr>
                  <tr>
                    <td><strong>Evaluation Criterion</strong></td>
                    <td className="highlight-col"><span className="text-emerald-600 font-semibold">Live GitHub code, architectures &amp; AI projects</span></td>
                    <td>Generic resume keyword matching</td>
                  </tr>
                  <tr>
                    <td><strong>Interview Scheduling</strong></td>
                    <td className="highlight-col"><span className="text-emerald-600 font-semibold">Direct calendar invite within 48 hours</span></td>
                    <td>Average 3–6 weeks of silence and ghosting</td>
                  </tr>
                  <tr>
                    <td><strong>Commission / Platform Fees</strong></td>
                    <td className="highlight-col"><span className="text-emerald-600 font-semibold">₹0 Forever (Zero cut from your package)</span></td>
                    <td>Heavy 8–15% recruiter commission deductions</td>
                  </tr>
                  <tr>
                    <td><strong>Joining Timeline</strong></td>
                    <td className="highlight-col"><span className="text-emerald-600 font-semibold">Immediate joiners prioritized (0–15 Days)</span></td>
                    <td>Long 90-day notice periods</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Frequently Asked Questions */}
            <div className="tal-faq-grid">
              <div className="tal-faq-card">
                <h5 className="tal-faq-q">Is Global Minds free for engineers and builders?</h5>
                <p className="tal-faq-a">
                  Yes, 100% free. We never charge candidates, and we never take a cut of your joining package. You negotiate your compensation directly with the hiring boss.
                </p>
              </div>

              <div className="tal-faq-card">
                <h5 className="tal-faq-q">How do bosses reach out to me?</h5>
                <p className="tal-faq-a">
                  Hiring founders browse your dossier, view your verified projects, and schedule an interview round directly to your calendar or send a meeting link.
                </p>
              </div>

              <div className="tal-faq-card">
                <h5 className="tal-faq-q">What if I am a 2024 or 2025 batch fresher?</h5>
                <p className="tal-faq-a">
                  Many of our top hiring partners (including Target India and startup founders) specifically look for fresh graduates with verified hands-on project work, high problem-solving aptitude, and clean git commits.
                </p>
              </div>

              <div className="tal-faq-card">
                <h5 className="tal-faq-q">Can I update my dossier after uploading?</h5>
                <p className="tal-faq-a">
                  Yes, you can re-upload your updated resume anytime in the Upload &amp; Optimize tab, or add new projects and GitHub links whenever you ship a new feature.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
