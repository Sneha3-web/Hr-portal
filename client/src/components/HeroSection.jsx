import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Briefcase, 
  ArrowRight,
  Code2,
  Cpu,
  Layers,
  Terminal,
  Database
} from 'lucide-react';

const PROFILE_CHOICES = [
  {
    id: 'fullstack',
    category: 'Full Stack',
    icon: Code2,
    name: 'Aryan Merchant',
    role: 'Senior Full Stack Engineer',
    companyTag: 'Target India Alumni',
    exp: '3+ Years',
    ctc: '₹18–24 LPA',
    availability: '0–15 Days Notice',
    skills: ['React', 'Node.js', 'Next.js', 'TypeScript', 'PostgreSQL'],
    img: '/mock/boss-mockup-1.webp',
    accent: '#3b82f6',
    score: '98% Boss Match'
  },
  {
    id: 'aiml',
    category: 'AI & Python',
    icon: Cpu,
    name: 'Sanchit Tripathi',
    role: 'AI / LLM Systems Engineer',
    companyTag: 'Product Tech Lead',
    exp: '4+ Years',
    ctc: '₹22–30 LPA',
    availability: 'Immediate Joining',
    skills: ['Python', 'FastAPI', 'PyTorch', 'RAG & LangChain', 'VectorDB'],
    img: '/mock/boss-mockup-2.webp',
    accent: '#8b5cf6',
    score: '99% Boss Match'
  },
  {
    id: 'backend',
    category: 'Java Backend',
    icon: Layers,
    name: 'Vikram Aditya',
    role: 'Lead Backend Architect',
    companyTag: 'FinTech Systems Lead',
    exp: '5+ Years',
    ctc: '₹26–34 LPA',
    availability: '15 Days Notice',
    skills: ['Java 21', 'Spring Boot', 'Microservices', 'Kafka', 'Redis'],
    img: '/mock/boss-mockup-3.webp',
    accent: '#10b981',
    score: '96% Boss Match'
  },
  {
    id: 'devops',
    category: 'Cloud & DevOps',
    icon: Terminal,
    name: 'Ananya Nair',
    role: 'Cloud & Kubernetes Specialist',
    companyTag: 'SaaS Infrastructure',
    exp: '4 Years',
    ctc: '₹20–28 LPA',
    availability: 'Immediate Joining',
    skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD Pipelines'],
    img: '/mock/boss-mockup-2.webp',
    accent: '#f59e0b',
    score: '97% Boss Match'
  },
  {
    id: 'data',
    category: 'Data & Analytics',
    icon: Database,
    name: 'Rahul Sen',
    role: 'Senior Data Engineer',
    companyTag: 'Data Platform Co.',
    exp: '3.5 Years',
    ctc: '₹18–25 LPA',
    availability: 'Immediate Joining',
    skills: ['Python', 'SQL', 'Snowflake', 'Apache Spark', 'PowerBI'],
    img: '/mock/boss-mockup-1.webp',
    accent: '#ec4899',
    score: '95% Boss Match'
  }
];

export default function HeroSection({
  stats = {},
  appMode = 'boss',
  onToggleMode
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const total = PROFILE_CHOICES.length;

  // Touch and mouse drag swipe state
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);
  const isDragging = useRef(false);

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev === 1 + total - 1 ? 0 : (prev + 1) % total));
  };

  // Touch swipe support
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const onTouchMove = (e) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const onTouchEnd = () => {
    if (touchDeltaX.current > 45) {
      handlePrev();
    } else if (touchDeltaX.current < -45) {
      handleNext();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  // Mouse drag swipe support
  const onMouseDown = (e) => {
    isDragging.current = true;
    touchStartX.current = e.clientX;
    touchDeltaX.current = 0;
  };

  const onMouseMove = (e) => {
    if (!isDragging.current || touchStartX.current === null) return;
    touchDeltaX.current = e.clientX - touchStartX.current;
  };

  const onMouseUp = () => {
    if (!isDragging.current) return;
    if (touchDeltaX.current > 50) {
      handlePrev();
    } else if (touchDeltaX.current < -50) {
      handleNext();
    }
    isDragging.current = false;
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  const activeProfile = PROFILE_CHOICES[activeIdx];
  const prevIdx = (activeIdx - 1 + total) % total;
  const nextIdx = (activeIdx + 1) % total;

  return (
    <section id="top" className="tal-hero-stage">
      {/* Background ambient lighting (Hands removed per user instruction) */}
      <div className="tal-hero-ambient-glow" aria-hidden="true" />

      <div className="tal-hero-content">
        {/* Main Headline */}
        <h1 className="tal-hero-title">
          The platform where bosses hire directly
        </h1>

        {/* Subtitle matching tal.club */}
        <p className="tal-hero-subtitle">
          Over 3000 bosses from startups &amp; product companies hire directly on Global Minds everyday.
        </p>

        {/* ===================================================================
            SWIPEABLE PROFILE CHOICES SHOWCASE (IN CENTER OF HOMEPAGE)
            =================================================================== */}
        <div className="tal-profile-swipe-section">
          {/* 2 Split Standalone Mode Buttons */}
          <div className="tal-hero-modes-button-row">
            <button
              type="button"
              className={`tal-btn-split-mode ${appMode === 'boss' ? 'active-boss' : ''}`}
              onClick={() => onToggleMode && onToggleMode('boss')}
            >
              <Briefcase size={16} />
              <span>Boss Mode (Hiring)</span>
            </button>
            <button
              type="button"
              className={`tal-btn-split-mode ${appMode === 'talent' ? 'active-talent' : ''}`}
              onClick={() => onToggleMode && onToggleMode('talent')}
            >
              <Sparkles size={16} />
              <span>Candidate Mode (Talent)</span>
            </button>
          </div>

          {/* 2. Interactive 3D Swipeable Stack */}
          <div 
            className="tal-swipe-card-wrapper"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {/* Left Prev Arrow Button */}
            <button 
              type="button" 
              className="tal-swipe-nav-btn tal-swipe-nav-prev"
              onClick={handlePrev}
              title="Previous Profile"
              aria-label="Previous Profile"
            >
              <ChevronLeft size={22} />
            </button>

            {/* 3D Stack Container */}
            <div className="tal-swipe-stack">
              {/* Background Left Card */}
              <div 
                className="tal-swipe-card tal-swipe-card-left"
                onClick={handlePrev}
                title={`Swipe to ${PROFILE_CHOICES[prevIdx].name}`}
              >
                <img 
                  src={PROFILE_CHOICES[prevIdx].img} 
                  alt="" 
                  className="tal-swipe-card-img" 
                />
                <div className="tal-swipe-card-overlay-blur">
                  <span className="tal-swipe-card-name-mini">{PROFILE_CHOICES[prevIdx].name}</span>
                  <span className="tal-swipe-card-role-mini">{PROFILE_CHOICES[prevIdx].role}</span>
                </div>
              </div>

              {/* Background Right Card */}
              <div 
                className="tal-swipe-card tal-swipe-card-right"
                onClick={handleNext}
                title={`Swipe to ${PROFILE_CHOICES[nextIdx].name}`}
              >
                <img 
                  src={PROFILE_CHOICES[nextIdx].img} 
                  alt="" 
                  className="tal-swipe-card-img" 
                />
                <div className="tal-swipe-card-overlay-blur">
                  <span className="tal-swipe-card-name-mini">{PROFILE_CHOICES[nextIdx].name}</span>
                  <span className="tal-swipe-card-role-mini">{PROFILE_CHOICES[nextIdx].role}</span>
                </div>
              </div>

              {/* Center Active Foreground Card */}
              <div 
                className="tal-swipe-card tal-swipe-card-active"
                onClick={() => onToggleMode && onToggleMode('boss')}
                title="Click to hire directly in Boss Mode"
              >
                <img 
                  src={activeProfile.img} 
                  alt={activeProfile.name}
                  className="tal-swipe-card-img" 
                />

                {/* Top Floating Match Badge */}
                <div className="tal-swipe-top-badge">
                  <span className="tal-swipe-match-pill" style={{ borderColor: activeProfile.accent }}>
                    <Sparkles size={12} color={activeProfile.accent} />
                    <span>{activeProfile.score}</span>
                  </span>
                  <span className="tal-swipe-status-pill">
                    <span className="tal-green-dot" />
                    <span>{activeProfile.availability}</span>
                  </span>
                </div>

                {/* Bottom Profile Details Glass Sheet */}
                <div className="tal-swipe-glass-info">
                  <div className="tal-swipe-header-row">
                    <div>
                      <div className="tal-swipe-candidate-name">
                        <span>{activeProfile.name}</span>
                        <CheckCircle2 size={16} color="#38bdf8" />
                      </div>
                      <div className="tal-swipe-candidate-role">
                        {activeProfile.role} • <span style={{ color: '#cbd5e1' }}>{activeProfile.companyTag}</span>
                      </div>
                    </div>
                  </div>

                  {/* Skills Pills */}
                  <div className="tal-swipe-skills">
                    {activeProfile.skills.map((s) => (
                      <span key={s} className="tal-swipe-skill-tag">
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Metrics Row & Action */}
                  <div className="tal-swipe-footer-row">
                    <div className="tal-swipe-metrics">
                      <span className="tal-swipe-metric-val">{activeProfile.exp}</span>
                      <span className="tal-swipe-metric-sep">•</span>
                      <span className="tal-swipe-metric-val">{activeProfile.ctc}</span>
                    </div>

                    <div className="tal-swipe-cta-hint">
                      <span>Direct Chat in Boss Mode</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Next Arrow Button */}
            <button 
              type="button" 
              className="tal-swipe-nav-btn tal-swipe-nav-next"
              onClick={handleNext}
              title="Next Profile"
              aria-label="Next Profile"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Dots Pagination & Swipe Hint */}
          <div className="tal-swipe-controls">
            <div className="tal-swipe-dots">
              {PROFILE_CHOICES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`tal-swipe-dot ${i === activeIdx ? 'active' : ''}`}
                  onClick={() => setActiveIdx(i)}
                  aria-label={`Go to profile ${i + 1}`}
                />
              ))}
            </div>
            <div className="tal-swipe-hint-text">
              <span>👈 Swipe or click cards to explore profile choices 👉</span>
            </div>
          </div>
        </div>

        {/* Minimalist Facts Strip matching tal.club */}
        <div className="tal-hero-facts">
          <div className="tal-fact-item">
            <span className="tal-fact-value">{stats.totalCandidates ?? '3,000+'}</span>
            <span className="tal-fact-label">pre-screened builders</span>
          </div>
          <div className="tal-fact-divider" />
          <div className="tal-fact-item">
            <span className="tal-fact-value">₹0</span>
            <span className="tal-fact-label">recruiter fees</span>
          </div>
          <div className="tal-fact-divider" />
          <div className="tal-fact-item">
            <span className="tal-fact-value">0–15 days</span>
            <span className="tal-fact-label">joining turnaround</span>
          </div>
          <div className="tal-fact-divider" />
          <div className="tal-fact-item">
            <span className="tal-fact-value">48 hrs</span>
            <span className="tal-fact-label">direct interview scheduling</span>
          </div>
        </div>
      </div>
    </section>
  );
}
