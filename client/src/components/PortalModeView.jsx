import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  Search, 
  Check, 
  X, 
  Sparkles, 
  Briefcase, 
  UserCheck, 
  Clock, 
  Building2, 
  Send, 
  FileText, 
  MessageSquare,
  Bookmark,
  CheckCircle2,
  Lock,
  Upload,
  Eye,
  EyeOff,
  Download,
  Calendar,
  ExternalLink,
  Home,
  Plus,
  Minus
} from 'lucide-react';

/* ==========================================================================
   CONSTANTS FOR BOSS MODE
   ========================================================================== */
const DEFAULT_BOSS_TITLES = [
  'Full Stack Developer',
  'Java Developer',
  'Python Developer',
  'Devops',
  'Data Analyst',
  'Frontend Developer',
  'Machine Learning',
  'Testing Role',
  'React.js Developer'
];

const DEFAULT_BOSS_SKILLS = [
  'React.js',
  'Node.js',
  'Core Java',
  'Spring Boot',
  'Python',
  'Django',
  'Docker',
  'Kubernetes',
  'AWS',
  'SQL',
  'Power BI',
  'Selenium WebDriver',
  'Machine Learning'
];

// Rich builder profiles with complete resume dossiers
const VERIFIED_BUILDERS = [
  {
    id: 'res-1',
    initials: 'AM',
    name: 'Aryan Merchant',
    role: 'Technical Project Manager / Engineering Lead',
    companyTag: 'Target India Alumni',
    location: 'Bengaluru (Hybrid)',
    exp: '4.5 Years',
    expNum: 4.5,
    ctc: '₹22 LPA',
    ctcNum: 22,
    notice: 'Immediate',
    score: '98% Match',
    skills: ['Jira Administration', 'Risk Management', 'Roadmap Planning', 'Release Management', 'Process Mapping'],
    summary: 'Senior Engineering Manager with 4.5+ years directing multi-tier distributed systems and release workflows. Led cross-functional teams acrossTarget India delivery pipelines.',
    experienceHistory: [
      {
        company: 'Target India',
        role: 'Technical Project Manager',
        period: '2023 – Present',
        bullets: [
          'Spearheaded rollout of automated deployment pipelines reducing cycle time by 42%.',
          'Orchestrated roadmap planning & sprint governance across 4 squads (35 engineers).',
          'Managed enterprise Jira administration and risk registers for mission-critical services.'
        ]
      },
      {
        company: 'Cognizant Digital',
        role: 'Senior Software Engineer & Scrum Lead',
        period: '2021 – 2023',
        bullets: [
          'Developed cloud microservices using Node.js & AWS Lambda with 99.98% uptime.',
          'Facilitated agile ceremonies and release mapping across global business units.'
        ]
      }
    ],
    education: 'B.Tech in Computer Science & Engineering (2017 – 2021)',
    certifications: ['PMP® Certified', 'AWS Certified Solutions Architect', 'Professional Scrum Master (PSM II)'],
    email: 'aryan.merchant@example.com',
    phone: '+91 98450 12345'
  },
  {
    id: 'res-2',
    initials: 'ST',
    name: 'Sanchit Tripathi',
    role: 'Engineering Program Manager',
    companyTag: 'Product Tech Lead',
    location: 'Bengaluru',
    exp: '5.0 Years',
    expNum: 5,
    ctc: '₹26 LPA',
    ctcNum: 26,
    notice: '15 Days',
    score: '99% Match',
    skills: ['Roadmap Planning', 'AI Automation', 'Cloud Architecture', 'ERP Integration', 'Risk Management'],
    summary: 'Technical Program Manager & AI systems architect. Specialized in scaling production LLM agentic pipelines and cross-functional team execution.',
    experienceHistory: [
      {
        company: 'Global AI Labs',
        role: 'Lead Engineering Program Manager',
        period: '2023 – Present',
        bullets: [
          'Directing agentic LLM orchestration platform serving 150k monthly active requests.',
          'Formulated AI automation frameworks cutting operational overhead by 55%.',
          'Managed vendor integrations and enterprise ERP synchronization.'
        ]
      },
      {
        company: 'Infosys FinTech',
        role: 'Senior Systems Engineer',
        period: '2021 – 2023',
        bullets: [
          'Architected high-throughput data processing workflows with Kafka & PostgreSQL.'
        ]
      }
    ],
    education: 'B.E. Information Technology (2017 – 2021)',
    certifications: ['DeepLearning.AI Agentic Systems', 'Certified Agile Leader (CAL)'],
    email: 'sanchit.tripathi@example.com',
    phone: '+91 97123 45678'
  },
  {
    id: 'res-3',
    initials: 'AK',
    name: 'Aarav Kumar',
    role: 'Member of Technical Staff / Release Manager',
    companyTag: 'SaaS Platform Lead',
    location: 'Bengaluru',
    exp: '3.5 Years',
    expNum: 3.5,
    ctc: '₹18 LPA',
    ctcNum: 18,
    notice: 'Immediate',
    score: '96% Match',
    skills: ['Release Management', 'Jira Administration', 'Process Mapping', 'Cloud Architecture'],
    summary: 'Release Manager with high-impact track record in zero-downtime CI/CD governance, artifact signing, and deployment stability.',
    experienceHistory: [
      {
        company: 'ScaleX SaaS',
        role: 'Release & Infrastructure Manager',
        period: '2022 – Present',
        bullets: [
          'Supervised 60+ seamless major production releases without rolled-back deployment.',
          'Automated Jira change verification and compliance audit trails.'
        ]
      }
    ],
    education: 'B.Tech Software Engineering (2018 – 2022)',
    certifications: ['Docker & Kubernetes Certified Administrator', 'Jira Service Management Specialist'],
    email: 'aarav.kumar@example.com',
    phone: '+91 99234 56789'
  },
  {
    id: 'res-4',
    initials: 'VA',
    name: 'Vikram Aditya',
    role: 'Lead Systems Architect & TPM',
    companyTag: 'FinTech Systems Lead',
    location: 'Chennai / Hybrid',
    exp: '6.0 Years',
    expNum: 6,
    ctc: '₹30 LPA',
    ctcNum: 30,
    notice: 'Immediate',
    score: '97% Match',
    skills: ['Cloud Architecture', 'Process Mapping', 'Risk Management', 'ERP Integration', 'Roadmap Planning'],
    summary: 'Solutions architect and technical program lead with expertise in payment gateways, core banking rails, and fault-tolerant cloud infrastructure.',
    experienceHistory: [
      {
        company: 'FinPay Infrastructure',
        role: 'Lead Architect & Delivery Manager',
        period: '2021 – Present',
        bullets: [
          'Engineered transaction engine handling 3,500 TPS with sub-80ms p99 latency.',
          'Managed enterprise risk matrices, SOC-2 compliance, and quarterly product delivery.'
        ]
      }
    ],
    education: 'M.Tech Software Systems, BITS Pilani (2018 – 2020)',
    certifications: ['AWS Solutions Architect Professional', 'TOGAF 9.2 Certified'],
    email: 'vikram.aditya@example.com',
    phone: '+91 94450 67890'
  }
];

/* ==========================================================================
   CONSTANTS FOR CANDIDATE MODE
   ========================================================================== */
const CAND_JOB_FUNCTIONS = [
  'Engineering',
  'Product Management',
  'Marketing & Growth',
  'Strategy/Generalist',
  'Design',
  'Accounting',
  'Finance',
  'Human Resources',
  'Venture Capital',
  'Legal',
  'Operations',
  'Sales'
];

const CAND_JOB_FUNCTION_CATEGORIES = {
  all: 'All Functions',
  tech: 'Tech & Engineering',
  product: 'Product & Design',
  business: 'Business & HR'
};

const CATEGORIZED_FUNCTIONS = {
  tech: ['Engineering', 'Operations'],
  product: ['Product Management', 'Design', 'Strategy/Generalist'],
  business: ['Marketing & Growth', 'Human Resources', 'Sales', 'Finance', 'Accounting', 'Venture Capital', 'Legal']
};

const CAND_LOCATIONS = [
  ['Bengaluru', 'Karnataka'],
  ['Chennai', 'Tamil Nadu'],
  ['Hyderabad', 'Telangana'],
  ['Pune', 'Maharashtra'],
  ['Mumbai', 'Maharashtra'],
  ['Delhi NCR', 'Delhi'],
  ['Kolkata', 'West Bengal'],
  ['Remote', 'Anywhere in India']
];

const CAND_AI_STACK = [
  'antigravity', 'claude code', 'claude', 'codex', 'cursor', 'dalle', 
  'deepmind', 'deepseek', 'elevenlabs', 'gemini', 'gemini cli', 
  'github copilot', 'grok', 'hugging face', 'kilo code', 'kimi', 
  'kiro', 'langchain', 'chatgpt', 'perplexity', 'midjourney', 'n8n'
];

const CAND_DEFAULT_SKILLS = [
  'Project portfolio management',
  'Resource capacity planning',
  'Workflow automation',
  'KPI dashboarding',
  'Process mapping',
  'Vendor management',
  'Risk and issue management',
  'ServiceNow'
];

const PORTAL_DOMAINS = [
  'Full Stack Developer',
  'Python Developer',
  'Devops',
  'Java Developer',
  'Data Analyst',
  'Frontend Developer',
  'Machine Learning',
  'Testing Role'
];

function inferDomain(fnList = [], skillsList = []) {
  const combined = `${(fnList || []).join(' ')} ${(skillsList || []).join(' ')}`.toLowerCase();
  if (combined.includes('devops') || combined.includes('docker') || combined.includes('kubernetes') || combined.includes('aws') || combined.includes('cloud')) return 'Devops';
  if (combined.includes('python') || combined.includes('django') || combined.includes('fastapi')) return 'Python Developer';
  if (combined.includes('java') || combined.includes('spring') || combined.includes('hibernate')) return 'Java Developer';
  if (combined.includes('data') || combined.includes('power bi') || combined.includes('tableau') || combined.includes('sql')) return 'Data Analyst';
  if (combined.includes('machine learning') || combined.includes('pytorch') || combined.includes('tensorflow') || combined.includes('ai')) return 'Machine Learning';
  if (combined.includes('test') || combined.includes('qa') || combined.includes('selenium') || combined.includes('postman')) return 'Testing Role';
  if (combined.includes('frontend') || combined.includes('react') || combined.includes('vue') || combined.includes('next.js')) return 'Frontend Developer';
  return 'Full Stack Developer';
}

export default function PortalModeView({ 
  mode = 'boss', 
  onGoHome, 
  onSwitchMode, 
  candidates = [],
  onCandidateCreated,
  user = null,
  onRecordView = null,
  shortlist = [],
  onToggleShortlist = null,
  onPromptLogin = null,
  onRefreshBossActivity = null
}) {
  // Navigation step within active mode
  const [step, setStep] = useState(0);
  const [stepHistory, setStepHistory] = useState([]);

  // Real candidates from resume folder (c:\Users\sneha\OneDrive\Desktop\Resumes)
  const [realCandidates, setRealCandidates] = useState(candidates || []);

  useEffect(() => {
    if (candidates && candidates.length > 0) {
      setRealCandidates(candidates);
    } else {
      fetch('/api/candidates')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.candidates && data.candidates.length > 0) {
            setRealCandidates(data.candidates);
          }
        })
        .catch((err) => console.error('Failed to load real candidates:', err));
    }
  }, [candidates]);

  /* =========================================================================
     BOSS MODE STATE
     ========================================================================= */
  const [goal, setGoal] = useState('');
  const [title, setTitle] = useState('');
  const [titleSearch, setTitleSearch] = useState('');
  const [customTitleInput, setCustomTitleInput] = useState('');
  const [titlesList, setTitlesList] = useState(DEFAULT_BOSS_TITLES);
  const [expRange, setExpRange] = useState([2, 4]);

  // Minimum & Maximum CTC
  const [minCtc, setMinCtc] = useState(10);
  const [maxCtc, setMaxCtc] = useState(25);

  // Skill selection (starts empty so no options are pre-selected)
  const [skillsList, setSkillsList] = useState(DEFAULT_BOSS_SKILLS);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [bossCustomSkill, setBossCustomSkill] = useState('');

  // Finding animation state
  const [progress, setProgress] = useState(0);
  const [matchCandidateText, setMatchCandidateText] = useState('');
  const [matchBadge, setMatchBadge] = useState('');

  // Resume Modal & View State
  const [previewResumeTarget, setPreviewResumeTarget] = useState(null);
  const [interviewRequestedIds, setInterviewRequestedIds] = useState([]);

  // Compute matching resumes from real candidates in the resume folder
  const matchingResumes = useMemo(() => {
    const source = realCandidates && realCandidates.length > 0 ? realCandidates : VERIFIED_BUILDERS;
    const mapped = source.map((cand) => {
      if (cand.initials && cand.companyTag && !cand.filename) return cand;

      const initials = cand.name
        ? cand.name.split(' ').map((n) => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
        : 'GM';

      return {
        id: cand.id,
        initials,
        name: cand.name,
        role: cand.category ? `${cand.category} Specialist` : 'Software Engineer',
        category: cand.category || 'Engineering',
        companyTag: cand.source || 'Verified Global Minds Candidate',
        location: cand.location || 'Bengaluru / Hybrid',
        exp: cand.experience || '1-2 Years',
        expNum: parseFloat(cand.experience) || 2,
        ctc: cand.expectedCtc ? `₹${cand.expectedCtc} LPA` : '₹12–18 LPA',
        notice: cand.availability || 'Immediate (0 - 15 Days)',
        score: `${cand.score || 95}% Match`,
        skills: Array.isArray(cand.skills) && cand.skills.length > 0 ? cand.skills : ['Core Skills', 'Problem Solving'],
        summary: cand.bio || `Pre-screened ${cand.category || 'technology'} engineer from Global Minds. Verified proof-of-work and available for immediate direct hiring.`,
        email: cand.email || 'candidate@globalminds.com',
        phone: cand.phone || '+91 98450 12345',
        education: cand.education || 'B.E / B.Tech Computer Science',
        certifications: [
          'Global Minds Proof-of-Work Verified',
          cand.category ? `${cand.category} Certified` : 'Technical Certified'
        ],
        filename: cand.filename || cand.originalFilename
      };
    });

    let list = mapped;

    // Filter by title if selected
    if (title && title.trim()) {
      const t = title.toLowerCase().trim();
      const matched = list.filter((c) =>
        (c.category && c.category.toLowerCase().includes(t)) ||
        (c.role && c.role.toLowerCase().includes(t)) ||
        (c.skills && c.skills.some((s) => s.toLowerCase().includes(t)))
      );
      if (matched.length > 0) list = matched;
    }

    // Sort by matched skills if selectedSkills are chosen
    if (selectedSkills && selectedSkills.length > 0) {
      const sLower = selectedSkills.map((s) => s.toLowerCase());
      list = [...list].sort((a, b) => {
        const matchA = a.skills.filter((s) => sLower.some((req) => s.toLowerCase().includes(req))).length;
        const matchB = b.skills.filter((s) => sLower.some((req) => s.toLowerCase().includes(req))).length;
        return matchB - matchA;
      });
    }

    return list;
  }, [realCandidates, title, selectedSkills]);

  /* =========================================================================
     CANDIDATE MODE STATE
     ========================================================================= */
  const [candName, setCandName] = useState('');
  const [candCategory, setCandCategory] = useState('');
  const [candFile, setCandFile] = useState(null);
  const [createdCandidate, setCreatedCandidate] = useState(null);
  const [isSavingCand, setIsSavingCand] = useState(false);

  const [candFn, setCandFn] = useState([]);
  const [candFnSearch, setCandFnSearch] = useState('');
  const [candFnCategory, setCandFnCategory] = useState('all');
  const [candExp, setCandExp] = useState(3.0);
  const [candLoc, setCandLoc] = useState('');
  const [candLocSearch, setCandLocSearch] = useState('');
  const [candCurrentCtc, setCandCurrentCtc] = useState(10);
  const [candExpectedCtc, setCandExpectedCtc] = useState(15);
  const [candAIStack, setCandAIStack] = useState([]);
  const [candAISearch, setCandAISearch] = useState('');
  const [candSkillsList, setCandSkillsList] = useState(CAND_DEFAULT_SKILLS);
  const [candSkills, setCandSkills] = useState([]);
  const [candCustomSkill, setCandCustomSkill] = useState('');
  const [candResume, setCandResume] = useState(null);
  const [candCountdown, setCandCountdown] = useState(3);
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  // Toast message
  const [toast, setToast] = useState('');
  const fileInputRef = useRef(null);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  // Reset steps when switching between boss and talent
  useEffect(() => {
    setStep(0);
    setStepHistory([]);
  }, [mode]);

  const goToStep = (nextStep, pushHistory = true) => {
    if (pushHistory) {
      setStepHistory((prev) => [...prev, step]);
    }
    setStep(nextStep);
  };

  const goBack = () => {
    if (stepHistory.length > 0) {
      const prev = stepHistory[stepHistory.length - 1];
      setStepHistory((prevHist) => prevHist.slice(0, -1));
      setStep(prev);
    } else {
      setStep(0);
    }
  };

  const handleExit = () => {
    setStepHistory([]);
    setStep(0);
    if (onGoHome) onGoHome();
  };

  // Add custom title in Step 1
  const handleAddCustomTitle = () => {
    const val = customTitleInput.trim();
    if (!val) return;
    if (!titlesList.includes(val)) {
      setTitlesList((prev) => [val, ...prev]);
    }
    setTitle(val);
    setCustomTitleInput('');
    triggerToast(`Selected: ${val}`);
  };

  // Finding animation in Boss Mode (Step 5)
  useEffect(() => {
    if (mode === 'boss' && step === 5) {
      setProgress(0);
      setMatchCandidateText('Figuring out the candidate resumes that match your criteria');
      setMatchBadge('');

      const names = realCandidates && realCandidates.length > 0
        ? realCandidates.slice(0, 8).map((c) => `${c.name} · ${c.category || 'Engineering'} profile matched`)
        : [
            'Abishek V P · Devops profile matched',
            'Aditya · Python Developer matched',
            'Verified proof-of-work engineering dossiers loaded'
          ];
      let p = 0;
      let nameIdx = 0;

      const interval = setInterval(() => {
        p += 5;
        if (p > 100) p = 100;
        setProgress(p);

        if (p % 25 === 0) {
          setMatchCandidateText(names[nameIdx % names.length]);
          setMatchBadge('✓ Matched');
          nameIdx++;
        }

        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            goToStep(6, false);
          }, 400);
        }
      }, 120);

      return () => clearInterval(interval);
    }
  }, [mode, step, realCandidates]);

  // Submit Candidate Profile to backend to persist under respective domain
  const handleSubmitCandidateProfile = async () => {
    if (createdCandidate) return;
    setIsSavingCand(true);

    const chosenDomain = candCategory || inferDomain(candFn, candSkills);
    const resolvedName = candName.trim() || (candFn.length > 0 ? `${candFn[0]} Specialist` : 'Candidate Engineer');

    try {
      const formData = new FormData();
      formData.append('name', resolvedName);
      formData.append('category', chosenDomain);
      formData.append('targetFunction', candFn.join(', ') || 'Engineering');
      formData.append('experience', candExp);
      formData.append('location', candLoc || 'Bengaluru');
      formData.append('currentCtc', candCurrentCtc);
      formData.append('expectedCtc', candExpectedCtc);
      formData.append('skills', JSON.stringify(candSkills));
      formData.append('aiStack', JSON.stringify(candAIStack));
      if (candFile) {
        formData.append('resume', candFile);
      } else if (candResume) {
        formData.append('filename', candResume);
      }

      const res = await fetch('/api/candidate-profile', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.candidate) {
        setCreatedCandidate(data.candidate);
        if (onCandidateCreated) {
          onCandidateCreated(data.candidate);
        }
        triggerToast(`✓ Profile stored under ${chosenDomain} domain on Home Page!`);
      }
    } catch (err) {
      console.error('Error saving candidate profile:', err);
    } finally {
      setIsSavingCand(false);
    }
  };

  // Countdown in Candidate Mode (Step 8) -> Submit Profile to Server
  useEffect(() => {
    if (mode === 'talent' && step === 8) {
      handleSubmitCandidateProfile();
      setCandCountdown(3);
      const interval = setInterval(() => {
        setCandCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setTimeout(() => {
              goToStep(9, false);
            }, 300);
            return 0;
          }
          return prev - 1;
        });
      }, 950);

      return () => clearInterval(interval);
    }
  }, [mode, step]);

  // Download Candidate Profile Summary
  const handleDownloadCandProfile = () => {
    const textContent = `===========================================================
GLOBAL MINDS DIRECT HIRING - VERIFIED CANDIDATE PROFILE
===========================================================
Target Function    : ${candFn.join(', ') || 'Engineering'}
Total Experience   : ${candExp} Years
Preferred Location : ${candLoc || 'Flexible'}
Expected CTC       : ₹${candExpectedCtc} LPA
Current CTC        : ₹${candCurrentCtc} LPA
Uploaded Resume    : ${candResume || 'Verified Resume Document'}

DAILY AI STACK:
${candAIStack.length ? candAIStack.join(', ') : 'Frontier AI workflows'}

SELECTED COMPETENCIES:
${candSkills.length ? candSkills.join(', ') : 'Core Software Engineering'}

===========================================================
Status: Verified & Live in Global Minds Talent Network
Direct Outreach: Enabled (Zero Recruiter Commission)
===========================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GlobalMinds_Candidate_Profile.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast('Profile Dossier downloaded!');
  };

  // Download Resume Helper (Uses real resume PDF if available, or structured dossier)
  const handleDownloadResume = (res) => {
    if (!res) return;
    if (onRecordView) onRecordView(res);
    const filename = res.filename || res.originalFilename || '';
    const safeName = (res.name || 'Candidate').replace(/\s+/g, '_');
    const downloadUrl = `/api/candidates/${encodeURIComponent(res.id || safeName)}/download?filename=${encodeURIComponent(filename)}&name=${encodeURIComponent(res.name || 'Candidate')}&category=${encodeURIComponent(res.category || res.role || '')}`;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename || `${safeName}_Resume.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`Downloading verified resume for ${res.name || 'Candidate'}`);
  };


  const handleToggleCandidateShortlist = (res) => {
    if (!res) return;
    if (onToggleShortlist) {
      onToggleShortlist(res);
      const isAlreadyShortlisted = (shortlist || []).some(
        (s) => s.id === res.id || (s.name && res.name && s.name.toLowerCase().trim() === res.name.toLowerCase().trim())
      );
      triggerToast(isAlreadyShortlisted ? `Removed ${res.name} from Shortlist` : `✓ Added ${res.name} to Shortlist!`);
    } else {
      if (onPromptLogin) {
        onPromptLogin('Shortlist Candidates');
      } else {
        triggerToast('Please log in with Boss credentials to save shortlisted candidates');
      }
    }
  };

  const handleRequestInterview = async (candIdOrObj, name) => {
    const id = typeof candIdOrObj === 'object' ? candIdOrObj.id : candIdOrObj;
    const candName = typeof candIdOrObj === 'object' ? candIdOrObj.name : name;

    const boss = user || JSON.parse(localStorage.getItem('hr_portal_user') || 'null');
    if (!boss || !boss.email) {
      if (onPromptLogin) {
        onPromptLogin('Schedule Interview');
      } else {
        triggerToast('Please log in as Boss to schedule direct interviews');
      }
      return;
    }

    setInterviewRequestedIds((prev) => [...prev, id]);

    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: boss.companyName || 'Corporate Boss Desk',
          recruiterName: boss.name || 'Hiring Boss',
          recruiterEmail: boss.email,
          recruiterPhone: boss.phone || '+91 98450 12345',
          candidateIds: [id],
          candidateSchedules: [{
            candidateId: id,
            name: candName,
            category: typeof candIdOrObj === 'object' ? candIdOrObj.category : 'Engineering',
            interviewDate: 'Earliest Available (Within 48 Hours)',
            timeSlot: '10:00 AM - 10:45 AM',
            interviewMode: 'Virtual (Google Meet / Zoom)',
            ctcBudget: '4.5 - 7.5 LPA'
          }]
        })
      });
      if (onRefreshBossActivity) onRefreshBossActivity();
    } catch (e) {
      console.error('Failed to submit interview inquiry:', e);
    }

    triggerToast(`48-Hour Direct Interview requested with ${candName}!`);
  };

  // CTA disabled conditions
  const isBossCtaDisabled = () => {
    if (step === 0) return !goal;
    if (step === 1) return !title;
    if (step === 3) return minCtc > maxCtc;
    return false;
  };

  const isCandCtaDisabled = () => {
    if (step === 0) return candFn.length === 0;
    if (step === 2) return !candLoc;
    if (step === 3 || step === 4) return candCurrentCtc > candExpectedCtc;
    if (step === 5) return candAIStack.length === 0;
    if (step === 6) return candSkills.length === 0;
    return false;
  };

  const handleBossCtaClick = () => {
    if (isBossCtaDisabled()) return;
    if (step === 0) {
      if (goal === 'none') goToStep(6);
      else goToStep(1);
    } else if (step === 1) goToStep(2);
    else if (step === 2) goToStep(3);
    else if (step === 3) goToStep(4);
    else if (step === 4) goToStep(5);
  };

  const handleCandCtaClick = () => {
    if (isCandCtaDisabled()) return;
    if (step === 0) goToStep(1);
    else if (step === 1) goToStep(2);
    else if (step === 2) goToStep(3);
    else if (step === 3) goToStep(5);
    else if (step === 4) goToStep(5);
    else if (step === 5) goToStep(6);
    else if (step === 6) goToStep(7);
    else if (step === 7) goToStep(8);
  };

  // Overall Progress %
  const bossProgressPercent = step <= 4 ? ((step + 1) / 5) * 100 : 100;
  const candProgressPercent = step <= 7 ? ((step + 1) / 8) * 100 : 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#09090b', color: '#f3f4f7' }}>
      
      {/* Sleek Breadcrumb inside Portal Mode View */}
      <div style={{
        maxWidth: (mode === 'boss' && step === 6) || (mode === 'talent' && step === 9) ? '760px' : '540px',
        margin: '20px auto 0',
        padding: '0 8px',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <button
          type="button"
          onClick={onGoHome}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: '#a1a1aa',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '6px'
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseOut={(e) => (e.currentTarget.style.color = '#a1a1aa')}
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </button>

        <span style={{ fontSize: '12px', color: '#71717a', fontWeight: 600 }}>
          {mode === 'boss' ? 'Boss Direct Hiring Desk' : 'Candidate Profile Builder'}
        </span>
      </div>

      {/* =====================================================================
          MAIN CARD CONTAINER
          ===================================================================== */}
      <div className="tal-boss-stage">
        <main className="tal-boss-app" id="app" style={{ maxWidth: (mode === 'boss' && step === 6) || (mode === 'talent' && step === 9) ? '760px' : '540px', transition: 'max-width 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          
          {/* Top Progress Line */}
          <div className="tal-boss-prog">
            <i 
              className="tal-boss-prog-fill" 
              style={{ width: `${mode === 'boss' ? bossProgressPercent : candProgressPercent}%` }} 
            />
          </div>

          {/* Navigation Controls: Back Circle & Exit/Skip */}
          <div className="tal-boss-nav">
            <button
              type="button"
              className="tal-boss-circle-btn"
              onClick={goBack}
              style={{ 
                visibility: (step === 0 || (mode === 'boss' ? step === 5 : step === 8)) ? 'hidden' : 'visible' 
              }}
              aria-label="Back"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              className="tal-boss-exit-btn"
              onClick={() => {
                if (mode === 'talent' && step === 7) {
                  goToStep(8);
                } else {
                  handleExit();
                }
              }}
              style={{ 
                visibility: (mode === 'boss' ? step >= 5 : step >= 8) ? 'hidden' : 'visible' 
              }}
            >
              {mode === 'talent' && step === 7 ? 'Skip' : 'Exit'}
            </button>
          </div>

          {/* =================================================================
              BOSS MODE FLOW (Steps 0–6)
              ================================================================= */}
          {mode === 'boss' && (
            <>
              {/* Step 0: Goal selection */}
              {step === 0 && (
                <section className="tal-boss-body">
                  <h1 className="tal-boss-title">What brings you here as a boss?</h1>
                  <div className="tal-boss-opts">
                    <label 
                      className={`tal-boss-opt ${goal === 'hire' ? 'selected' : ''}`}
                      onClick={() => setGoal('hire')}
                    >
                      <span>I or my team are hiring</span>
                      <div className="tal-boss-rd"><div className="tal-boss-rd-inner" /></div>
                    </label>

                    <label 
                      className={`tal-boss-opt ${goal === 'ref' ? 'selected' : ''}`}
                      onClick={() => setGoal('ref')}
                    >
                      <span>I can refer people to my company</span>
                      <div className="tal-boss-rd"><div className="tal-boss-rd-inner" /></div>
                    </label>

                    <label 
                      className={`tal-boss-opt ${goal === 'none' ? 'selected' : ''}`}
                      onClick={() => setGoal('none')}
                    >
                      <span>I’m not hiring right now</span>
                      <div className="tal-boss-rd"><div className="tal-boss-rd-inner" /></div>
                    </label>
                  </div>
                </section>
              )}

              {/* Step 1: Target Role Title with "+ Something else" text field */}
              {step === 1 && (
                <section className="tal-boss-body">
                  <h1 className="tal-boss-title">Which job title should we search talent for?</h1>
                  <label className="tal-boss-search">
                    <Search size={18} color="#a1a1aa" />
                    <input
                      type="text"
                      placeholder="Search talent type..."
                      value={titleSearch}
                      onChange={(e) => setTitleSearch(e.target.value)}
                    />
                    {titleSearch && (
                      <button
                        type="button"
                        onClick={() => setTitleSearch('')}
                        style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: 0 }}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </label>

                  {/* 1-Tap Popular Role Chips (No Scrolling Needed) */}
                  <div className="tal-quick-loc-chips" style={{ marginBottom: '14px' }}>
                    {['Full Stack', 'Java', 'Python', 'Devops', 'Data Analyst', 'Frontend', 'Machine Learning', 'Testing'].map((role) => {
                      const matchRole = titlesList.find((t) => t.toLowerCase().includes(role.toLowerCase())) || role;
                      const isSel = title === matchRole;
                      return (
                        <button
                          key={role}
                          type="button"
                          className={`tal-quick-loc-chip ${isSel ? 'active' : ''}`}
                          onClick={() => setTitle(matchRole)}
                        >
                          {isSel ? `✓ ${role}` : role}
                        </button>
                      );
                    })}
                  </div>

                  {/* 2-column Grid of Tiles */}
                  <div className="tal-boss-grid">
                    {titlesList.filter((t) => t.toLowerCase().includes(titleSearch.toLowerCase())).map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`tal-boss-tile ${title === t ? 'active' : ''}`}
                        onClick={() => setTitle(t)}
                      >
                        <span>{t}</span>
                      </button>
                    ))}
                  </div>

                  {/* Dedicated "+ Something else" text field option */}
                  <div className="tal-boss-custom-title-row">
                    <input
                      type="text"
                      className="tal-boss-custom-title-input"
                      placeholder="+ Something else (Type custom role & press Enter)"
                      value={customTitleInput}
                      onChange={(e) => setCustomTitleInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddCustomTitle();
                      }}
                    />
                    <button
                      type="button"
                      className="tal-boss-custom-title-btn"
                      onClick={handleAddCustomTitle}
                    >
                      Add &amp; Select
                    </button>
                  </div>
                </section>
              )}

              {/* Step 2: Experience */}
              {step === 2 && (
                <section className="tal-boss-body">
                  <h1 className="tal-boss-title">What kind of experience would you look at?</h1>
                  <p className="tal-boss-sub">Use + / - buttons, tap presets, or drag to set your required experience range.</p>

                  <div className="tal-boss-big-number" style={{ fontSize: '56px', margin: '14px 0 2px' }}>
                    {expRange[0]} – {expRange[1]}{expRange[1] >= 30 ? '+' : ''}
                  </div>
                  <div className="tal-boss-unit" style={{ marginBottom: '16px' }}>Years Experience</div>

                  {/* Dual Experience Cards: Minimum Experience & Maximum Experience with + and - */}
                  <div className="tal-boss-ctc-dual-wrap">
                    {/* Minimum Experience Card */}
                    <div className="tal-boss-ctc-card active">
                      <div className="tal-boss-ctc-lbl">Minimum Experience</div>
                      <div className="tal-boss-ctc-val">{expRange[0]}</div>
                      <div className="tal-boss-ctc-unit">Years</div>

                      <div className="tal-boss-ctc-stepper">
                        <button
                          type="button"
                          className="tal-boss-ctc-step-btn"
                          onClick={() => {
                            const newMin = Math.max(0, expRange[0] - 1);
                            setExpRange([newMin, expRange[1]]);
                          }}
                          disabled={expRange[0] <= 0}
                          title="Decrease Minimum Experience (-)"
                          aria-label="Decrease Minimum Experience"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          className="tal-boss-ctc-step-btn"
                          onClick={() => {
                            const newMin = Math.min(expRange[1], expRange[0] + 1);
                            setExpRange([newMin, expRange[1]]);
                          }}
                          disabled={expRange[0] >= expRange[1]}
                          title="Increase Minimum Experience (+)"
                          aria-label="Increase Minimum Experience"
                        >
                          +
                        </button>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={expRange[0]}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setExpRange(([_, max]) => [val, Math.max(val, max)]);
                        }}
                        style={{ width: '100%', marginTop: '16px', accentColor: '#ffffff' }}
                      />
                    </div>

                    {/* Maximum Experience Card */}
                    <div className="tal-boss-ctc-card active">
                      <div className="tal-boss-ctc-lbl">Maximum Experience</div>
                      <div className="tal-boss-ctc-val">{expRange[1] >= 30 ? '30+' : expRange[1]}</div>
                      <div className="tal-boss-ctc-unit">Years</div>

                      <div className="tal-boss-ctc-stepper">
                        <button
                          type="button"
                          className="tal-boss-ctc-step-btn"
                          onClick={() => {
                            const newMax = Math.max(expRange[0], expRange[1] - 1);
                            setExpRange([expRange[0], newMax]);
                          }}
                          disabled={expRange[1] <= expRange[0]}
                          title="Decrease Maximum Experience (-)"
                          aria-label="Decrease Maximum Experience"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          className="tal-boss-ctc-step-btn"
                          onClick={() => {
                            const newMax = Math.min(30, expRange[1] + 1);
                            setExpRange([expRange[0], newMax]);
                          }}
                          disabled={expRange[1] >= 30}
                          title="Increase Maximum Experience (+)"
                          aria-label="Increase Maximum Experience"
                        >
                          +
                        </button>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={expRange[1]}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setExpRange(([min, _]) => [Math.min(min, val), val]);
                        }}
                        style={{ width: '100%', marginTop: '16px', accentColor: '#ffffff' }}
                      />
                    </div>
                  </div>

                  {/* 1-Click Quick Preset Chips */}
                  <div className="tal-exp-presets-container">
                    <span className="tal-exp-presets-label">Quick Presets:</span>
                    <div className="tal-exp-presets-chips">
                      {[
                        { label: 'Fresher (0 - 1 yr)', range: [0, 1] },
                        { label: '1 – 3 yrs', range: [1, 3] },
                        { label: '3 – 5 yrs', range: [3, 5] },
                        { label: '5 – 8 yrs', range: [5, 8] },
                        { label: '8 – 12 yrs', range: [8, 12] },
                        { label: '12+ yrs', range: [12, 30] },
                        { label: 'Any Exp (0-30+)', range: [0, 30] }
                      ].map((preset) => {
                        const isSelected = expRange[0] === preset.range[0] && expRange[1] === preset.range[1];
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            className={`tal-exp-preset-chip ${isSelected ? 'active' : ''}`}
                            onClick={() => setExpRange(preset.range)}
                          >
                            {isSelected ? `✓ ${preset.label}` : preset.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dual Range Track */}
                  <div className="tal-boss-rng-wrap" style={{ marginTop: '16px' }}>
                    <div className="tal-boss-rng-track" />
                    <div
                      className="tal-boss-rng-fill"
                      style={{
                        left: `${(expRange[0] / 30) * 100}%`,
                        right: `${100 - (expRange[1] / 30) * 100}%`
                      }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={expRange[0]}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setExpRange(([_, max]) => [val, Math.max(val, max)]);
                      }}
                      className="tal-boss-rng-input"
                    />
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={expRange[1]}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setExpRange(([min, _]) => [Math.min(min, val), val]);
                      }}
                      className="tal-boss-rng-input"
                    />
                  </div>

                  <div className="tal-boss-rng-ends">
                    <span onClick={() => setExpRange([0, expRange[1]])} style={{ cursor: 'pointer' }} title="Set Min to 0 Years">
                      0 Years
                    </span>
                    <span onClick={() => setExpRange([expRange[0], 30])} style={{ cursor: 'pointer' }} title="Set Max to 30+ Years">
                      30+ Years
                    </span>
                  </div>
                </section>
              )}

              {/* Step 3: Minimum CTC AND Maximum CTC */}
              {step === 3 && (
                <section className="tal-boss-body">
                  <h1 className="tal-boss-title">What is your compensation budget?</h1>
                  <p className="tal-boss-sub">Set your minimum and maximum CTC in lakhs per annum.</p>

                  <div className="tal-boss-big-number" style={{ fontSize: '56px', margin: '14px 0 2px' }}>
                    ₹{minCtc} – {maxCtc}
                  </div>
                  <div className="tal-boss-unit" style={{ marginBottom: '20px' }}>Lakhs Per Annum (LPA)</div>

                  {/* Dual CTC Cards: Minimum CTC & Maximum CTC */}
                  <div className="tal-boss-ctc-dual-wrap">
                    {/* Minimum CTC Card */}
                    <div className="tal-boss-ctc-card active">
                      <div className="tal-boss-ctc-lbl">Minimum CTC</div>
                      <div className="tal-boss-ctc-val">{minCtc}</div>
                      <div className="tal-boss-ctc-unit">LPA</div>

                      <div className="tal-boss-ctc-stepper">
                        <button
                          type="button"
                          className="tal-boss-ctc-step-btn"
                          onClick={() => setMinCtc((c) => Math.max(1, c - 1))}
                        >
                          -
                        </button>
                        <button
                          type="button"
                          className="tal-boss-ctc-step-btn"
                          onClick={() => setMinCtc((c) => Math.min(maxCtc, c + 1))}
                        >
                          +
                        </button>
                      </div>

                      <input
                        type="range"
                        min="1"
                        max="60"
                        value={minCtc}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10);
                          setMinCtc(v);
                          if (v > maxCtc) setMaxCtc(v);
                        }}
                        style={{ width: '100%', marginTop: '16px', accentColor: '#ffffff' }}
                      />
                    </div>

                    {/* Maximum CTC Card */}
                    <div className="tal-boss-ctc-card active">
                      <div className="tal-boss-ctc-lbl">Maximum CTC</div>
                      <div className="tal-boss-ctc-val">{maxCtc}</div>
                      <div className="tal-boss-ctc-unit">LPA</div>

                      <div className="tal-boss-ctc-stepper">
                        <button
                          type="button"
                          className="tal-boss-ctc-step-btn"
                          onClick={() => setMaxCtc((c) => Math.max(minCtc, c - 1))}
                        >
                          -
                        </button>
                        <button
                          type="button"
                          className="tal-boss-ctc-step-btn"
                          onClick={() => setMaxCtc((c) => Math.min(80, c + 1))}
                        >
                          +
                        </button>
                      </div>

                      <input
                        type="range"
                        min="5"
                        max="80"
                        value={maxCtc}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10);
                          setMaxCtc(v);
                          if (v < minCtc) setMinCtc(v);
                        }}
                        style={{ width: '100%', marginTop: '16px', accentColor: '#ffffff' }}
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* Step 4: Required Skills */}
              {step === 4 && (
                <section className="tal-boss-body">
                  <h1 className="tal-boss-title">What skills should they already have?</h1>
                  <p className="tal-boss-sub">Tap skills to select required competencies for this role.</p>

                  {/* Quick Skills Selection Bar */}
                  <div className="tal-fn-quick-bar">
                    <span>
                      {selectedSkills.length === 0 ? (
                        'No skills selected'
                      ) : (
                        <b style={{ color: '#38bdf8' }}>
                          {selectedSkills.length} skill{selectedSkills.length === 1 ? '' : 's'} selected
                        </b>
                      )}
                    </span>
                    <div className="tal-fn-quick-actions">
                      <button
                        type="button"
                        className="tal-fn-quick-action-btn"
                        onClick={() => {
                          const core = ['React.js', 'Node.js', 'Core Java', 'Spring Boot', 'Python', 'Docker', 'AWS', 'SQL'];
                          setSelectedSkills((prev) => Array.from(new Set([...prev, ...core])));
                        }}
                      >
                        + Select Core Skills
                      </button>
                      {selectedSkills.length > 0 && (
                        <button
                          type="button"
                          className="tal-fn-quick-action-btn"
                          onClick={() => setSelectedSkills([])}
                          style={{ color: '#ef4444' }}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="tal-boss-chips">
                    {skillsList.map((s) => {
                      const active = selectedSkills.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          className={`tal-boss-chip ${active ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedSkills((prev) =>
                              prev.includes(s) ? prev.filter((i) => i !== s) : [...prev, s]
                            );
                          }}
                        >
                          {active ? `✓ ${s}` : s}
                        </button>
                      );
                    })}
                  </div>

                  <input
                    type="text"
                    className="tal-cand-addin"
                    placeholder="+ Something else, then press Enter"
                    value={bossCustomSkill}
                    onChange={(e) => setBossCustomSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && bossCustomSkill.trim()) {
                        const val = bossCustomSkill.trim();
                        if (!skillsList.includes(val)) setSkillsList((prev) => [...prev, val]);
                        if (!selectedSkills.includes(val)) setSelectedSkills((prev) => [...prev, val]);
                        setBossCustomSkill('');
                      }
                    }}
                  />

                  <div className="tal-boss-brief">
                    <b>Your brief so far</b>
                    <span>
                      {title || 'Your role'} · {expRange[0]}–{expRange[1]} yrs · ₹{minCtc}–{maxCtc} LPA ·{' '}
                      {selectedSkills.length ? selectedSkills.join(', ') : 'Any skills work'}
                    </span>
                  </div>
                </section>
              )}

              {/* Step 5: Finding matches animation */}
              {step === 5 && (
                <section className="tal-boss-body tal-boss-find-stage">
                  <h1 className="tal-boss-title">Finding related resumes for you!</h1>
                  <div className="tal-boss-stack">
                    <div className="tal-boss-ph" />
                    <div className="tal-boss-ph" />
                    <div className="tal-boss-ph" />
                    <div className="tal-boss-mag">🔍</div>
                  </div>

                  <div className="tal-boss-pb">
                    <div className="tal-boss-pb-track">
                      <i className="tal-boss-pb-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '14px', minWidth: '40px', textAlign: 'right' }}>
                      {progress}%
                    </span>
                  </div>

                  <div className="tal-boss-eta">
                    <span>ETA: <b>{Math.max(0, Math.ceil((100 - progress) / 11))} secs</b></span>
                    <span>Matching proof-of-work profiles</span>
                  </div>

                  <div className="tal-boss-match-card">
                    <div>
                      <div style={{ fontSize: '14.5px', color: '#f3f4f7' }}>
                        Figuring out the candidate resumes that match your criteria
                      </div>
                      <small>{matchCandidateText}</small>
                    </div>
                    {matchBadge && <span className="tal-boss-match-ok">{matchBadge}</span>}
                  </div>
                </section>
              )}

              {/* =============================================================
                  STEP 6: RELATED RESUMES WITH PREVIEW & DOWNLOAD
                  (Bottom tabs and simulated swipe cards removed completely!)
                  ============================================================= */}
              {step === 6 && (
                <section className="tal-resumes-results-stage">
                  
                  {/* Results Header */}
                  <div className="tal-resumes-results-header">
                    <div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                        Related Candidate Resumes
                      </div>
                      <div className="tal-resumes-criteria-pill">
                        <span>🎯 {title || 'All Verified Roles'}</span>
                        <span>•</span>
                        <span>{expRange[0]}–{expRange[1]} Yrs</span>
                        <span>•</span>
                        <span>₹{minCtc}–{maxCtc} LPA</span>
                        <span>•</span>
                        <span>{matchingResumes.length} Resumes Found</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => goToStep(1)}
                        style={{
                          padding: '7px 16px',
                          borderRadius: '9999px',
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#ffffff',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        ✏ Modify Criteria
                      </button>

                      {Array.isArray(shortlist) && shortlist.length > 0 && (
                        <div
                          style={{
                            padding: '7px 14px',
                            borderRadius: '9999px',
                            background: '#ffffff',
                            color: '#09090b',
                            fontSize: '13px',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Bookmark size={14} fill="#09090b" />
                          <span>Shortlisted ({shortlist.length})</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Resumes List */}
                  <div className="tal-resumes-grid">
                    {matchingResumes.map((res) => {
                      const isShortlisted = (shortlist || []).some(
                        (s) => s.id === res.id || (s.name && res.name && s.name.toLowerCase().trim() === res.name.toLowerCase().trim())
                      );
                      return (
                        <div key={res.id} className="tal-resume-card">
                          
                          {/* Card Header: Avatar, Name, Role & Match Score */}
                          <div className="tal-resume-card-head">
                            <div className="tal-resume-identity">
                              <div className="tal-resume-avatar">{res.initials}</div>
                              <div>
                                <div className="tal-resume-name">
                                  <span>{res.name}</span>
                                  <CheckCircle2 size={16} color="#10b981" />
                                </div>
                                <div className="tal-resume-role">
                                  {res.role} • <span style={{ color: '#ffffff', fontWeight: 600 }}>{res.companyTag}</span>
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className="tal-resume-score">{res.score}</span>
                            </div>
                          </div>

                          {/* Facts Strip */}
                          <div className="tal-resume-card-facts">
                            <span>💼 <b>{res.exp}</b> Exp</span>
                            <span>•</span>
                            <span>💰 <b>{res.ctc}</b> Expected</span>
                            <span>•</span>
                            <span>📍 <b>{res.location}</b></span>
                            <span>•</span>
                            <span style={{ color: '#34d399' }}>🟢 {res.notice}</span>
                          </div>

                          {/* Primary Actions: PREVIEW, DOWNLOAD RESUME & SHORTLIST */}
                          <div className="tal-resume-card-actions">
                            {/* Preview Resume Button */}
                            <button
                              type="button"
                              className="tal-btn-resume-preview"
                              onClick={() => {
                                setPreviewResumeTarget(res);
                                if (onRecordView) onRecordView(res);
                              }}
                              title="Preview full resume document"
                            >
                              <Eye size={15} />
                              <span>Preview Resume</span>
                            </button>

                            {/* Download Resume Button */}
                            <button
                              type="button"
                              className="tal-btn-resume-download"
                              onClick={() => handleDownloadResume(res)}
                              title="Download verified resume"
                            >
                              <Download size={15} />
                              <span>Download Resume</span>
                            </button>

                            {/* Shortlist Button (Replaced scheduled / direct interview button) */}
                            <button
                              type="button"
                              className={`tal-btn-resume-shortlist ${isShortlisted ? 'shortlisted' : ''}`}
                              onClick={() => handleToggleCandidateShortlist(res)}
                              title={isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
                            >
                              <Bookmark size={15} fill={isShortlisted ? '#000000' : 'none'} />
                              <span>{isShortlisted ? 'Shortlisted ✓' : 'Shortlist'}</span>
                            </button>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </section>
              )}

              {/* Boss Bottom CTA (Steps 0–4) */}
              {step <= 4 && (
                <div className="tal-boss-foot">
                  <button
                    type="button"
                    className="tal-boss-cta"
                    disabled={isBossCtaDisabled()}
                    onClick={handleBossCtaClick}
                  >
                    {step === 4 ? 'Save' : 'Continue'}
                  </button>
                </div>
              )}
            </>
          )}

          {/* =================================================================
              CANDIDATE MODE FLOW (CP Steps)
              ================================================================= */}
          {mode === 'talent' && (
            <>
              {/* Candidate Step 0: Target Job Function (2-Column Grid to Eliminate Scrolling) */}
              {step === 0 && (
                <section className="tal-boss-body">
                  <h1 className="tal-boss-title">Select your target job function</h1>
                  <p className="tal-boss-sub">Pick one or more roles you are interested in. Multiple selections allowed.</p>

                  <label className="tal-boss-search">
                    <Search size={18} color="#a1a1aa" />
                    <input
                      type="text"
                      placeholder="Search job function (e.g. Engineering, Design, Product)..."
                      value={candFnSearch}
                      onChange={(e) => setCandFnSearch(e.target.value)}
                    />
                    {candFnSearch && (
                      <button
                        type="button"
                        onClick={() => setCandFnSearch('')}
                        style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: 0 }}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </label>

                  {/* Category Filter Pills */}
                  <div className="tal-fn-filter-bar">
                    {Object.entries(CAND_JOB_FUNCTION_CATEGORIES).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        className={`tal-fn-filter-pill ${candFnCategory === key ? 'active' : ''}`}
                        onClick={() => setCandFnCategory(key)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Selection counter & Quick Select/Clear */}
                  <div className="tal-fn-quick-bar">
                    <span>
                      {candFn.length === 0 ? (
                        'No function selected'
                      ) : (
                        <b style={{ color: '#38bdf8' }}>
                          {candFn.length} function{candFn.length === 1 ? '' : 's'} selected
                        </b>
                      )}
                    </span>
                    <div className="tal-fn-quick-actions">
                      <button
                        type="button"
                        className="tal-fn-quick-action-btn"
                        onClick={() => {
                          const allAvailable = CAND_JOB_FUNCTIONS.filter((fn) => {
                            const matchesSearch = fn.toLowerCase().includes(candFnSearch.toLowerCase());
                            const matchesCat = candFnCategory === 'all' || (CATEGORIZED_FUNCTIONS[candFnCategory] && CATEGORIZED_FUNCTIONS[candFnCategory].includes(fn));
                            return matchesSearch && matchesCat;
                          });
                          setCandFn((prev) => Array.from(new Set([...prev, ...allAvailable])));
                        }}
                      >
                        Select Visible
                      </button>
                      {candFn.length > 0 && (
                        <button
                          type="button"
                          className="tal-fn-quick-action-btn"
                          onClick={() => setCandFn([])}
                          style={{ color: '#ef4444' }}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 2-Column Compact Interactive Grid (Eliminates excessive scrolling!) */}
                  <div className="tal-fn-grid">
                    {CAND_JOB_FUNCTIONS.filter((fn) => {
                      const matchesSearch = fn.toLowerCase().includes(candFnSearch.toLowerCase());
                      const matchesCat = candFnCategory === 'all' || (CATEGORIZED_FUNCTIONS[candFnCategory] && CATEGORIZED_FUNCTIONS[candFnCategory].includes(fn));
                      return matchesSearch && matchesCat;
                    }).map((fn) => {
                      const checked = candFn.includes(fn);
                      return (
                        <div
                          key={fn}
                          className={`tal-fn-card ${checked ? 'selected' : ''}`}
                          onClick={() => {
                            setCandFn((prev) =>
                              prev.includes(fn) ? prev.filter((f) => f !== fn) : [...prev, fn]
                            );
                          }}
                        >
                          <span>{fn}</span>
                          <div className="tal-fn-check">
                            {checked && <Check size={14} strokeWidth={3} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Candidate Step 1: Experience with + and - Steppers & Presets */}
              {step === 1 && (
                <section className="tal-boss-body">
                  <h1 className="tal-boss-title">How many years of experience do you have?</h1>
                  <p className="tal-boss-sub">Use + / - buttons, tap presets, or drag to adjust your experience level.</p>

                  <div className="tal-boss-exp-adjuster-wrap">
                    <button
                      type="button"
                      className="tal-boss-exp-step-btn"
                      onClick={() => setCandExp((c) => Math.max(0, Math.round((c - 0.5) * 10) / 10))}
                      disabled={candExp <= 0}
                      aria-label="Decrease experience by 0.5 years"
                      title="Decrease by 0.5 years (-)"
                    >
                      <Minus size={22} strokeWidth={2.5} />
                    </button>

                    <div className="tal-boss-big-number" aria-live="polite">
                      {candExp >= 15 ? '15+' : candExp % 1 === 0 ? candExp.toFixed(0) : candExp.toFixed(1)}
                    </div>

                    <button
                      type="button"
                      className="tal-boss-exp-step-btn"
                      onClick={() => setCandExp((c) => Math.min(15, Math.round((c + 0.5) * 10) / 10))}
                      disabled={candExp >= 15}
                      aria-label="Increase experience by 0.5 years"
                      title="Increase by 0.5 years (+)"
                    >
                      <Plus size={22} strokeWidth={2.5} />
                    </button>
                  </div>
                  <div className="tal-boss-unit">Years</div>

                  {/* Multi-step controls: -1 yr / -0.5 yr / +0.5 yr / +1 yr buttons */}
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="tal-exp-step-badge-btn"
                      onClick={() => setCandExp((c) => Math.max(0, Math.round((c - 1) * 10) / 10))}
                      disabled={candExp < 1}
                      title="Step down 1 full year"
                    >
                      -1.0 Year
                    </button>
                    <button
                      type="button"
                      className="tal-exp-step-badge-btn"
                      onClick={() => setCandExp((c) => Math.max(0, Math.round((c - 0.5) * 10) / 10))}
                      disabled={candExp < 0.5}
                      title="Step down 0.5 year"
                    >
                      -0.5 Year
                    </button>
                    <button
                      type="button"
                      className="tal-exp-step-badge-btn"
                      onClick={() => setCandExp((c) => Math.min(15, Math.round((c + 0.5) * 10) / 10))}
                      disabled={candExp >= 14.5}
                      title="Step up 0.5 year"
                    >
                      +0.5 Year
                    </button>
                    <button
                      type="button"
                      className="tal-exp-step-badge-btn"
                      onClick={() => setCandExp((c) => Math.min(15, Math.round((c + 1) * 10) / 10))}
                      disabled={candExp >= 14}
                      title="Step up 1 full year"
                    >
                      +1.0 Year
                    </button>
                  </div>

                  {/* 1-Click Quick Preset Chips */}
                  <div className="tal-exp-presets-container" style={{ margin: '0 0 16px' }}>
                    <span className="tal-exp-presets-label">Quick Presets:</span>
                    <div className="tal-exp-presets-chips">
                      {[
                        { label: 'Fresher (0 yr)', val: 0 },
                        { label: '1 Year', val: 1 },
                        { label: '2 Years', val: 2 },
                        { label: '3 Years', val: 3 },
                        { label: '5 Years', val: 5 },
                        { label: '7 Years', val: 7 },
                        { label: '10+ Years', val: 10 },
                        { label: '15+ Years', val: 15 }
                      ].map((preset) => {
                        const isSelected = candExp === preset.val;
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            className={`tal-exp-preset-chip ${isSelected ? 'active' : ''}`}
                            onClick={() => setCandExp(preset.val)}
                          >
                            {isSelected ? `✓ ${preset.label}` : preset.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="tal-boss-rng-wrap">
                    <div className="tal-boss-rng-track" />
                    <div
                      className="tal-boss-rng-fill"
                      style={{
                        left: '0%',
                        right: `${100 - (candExp / 15) * 100}%`
                      }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="15"
                      step="0.5"
                      value={candExp}
                      onChange={(e) => setCandExp(parseFloat(e.target.value))}
                      className="tal-boss-rng-input"
                    />
                  </div>

                  <div className="tal-boss-rng-ends">
                    <span 
                      onClick={() => setCandExp(0)}
                      style={{ cursor: 'pointer' }}
                      title="Set to 0 Years"
                    >
                      0 Years
                    </span>
                    <span 
                      onClick={() => setCandExp(15)}
                      style={{ cursor: 'pointer' }}
                      title="Set to 15+ Years"
                    >
                      15+ Years
                    </span>
                  </div>

                  <div className="tal-cand-vis">
                    <Eye size={16} />
                    <span>Visible on your profile</span>
                  </div>
                </section>
              )}

              {/* Candidate Step 2: Locality (Popular Chips & 2-Column Grid) */}
              {step === 2 && (
                <section className="tal-boss-body">
                  <h1 className="tal-boss-title">Add your locality so we can show jobs near you</h1>
                  <p className="tal-boss-sub">Choose your preferred city or remote work location.</p>

                  <label className="tal-boss-search">
                    <Search size={18} color="#a1a1aa" />
                    <input
                      type="text"
                      placeholder="Search location (e.g. Bengaluru, Remote, Pune)..."
                      value={candLocSearch}
                      onChange={(e) => setCandLocSearch(e.target.value)}
                    />
                    {candLocSearch && (
                      <button
                        type="button"
                        onClick={() => setCandLocSearch('')}
                        style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: 0 }}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </label>

                  {/* 1-Tap Popular City Chips (Zero Scrolling!) */}
                  <div className="tal-quick-loc-chips">
                    {['Bengaluru', 'Hyderabad', 'Pune', 'Chennai', 'Mumbai', 'Delhi NCR', 'Remote'].map((city) => (
                      <button
                        key={city}
                        type="button"
                        className={`tal-quick-loc-chip ${candLoc === city ? 'active' : ''}`}
                        onClick={() => setCandLoc(city)}
                      >
                        {candLoc === city ? `✓ ${city}` : city}
                      </button>
                    ))}
                  </div>

                  {/* 2-Column Compact Grid */}
                  <div className="tal-cand-loc-grid">
                    {CAND_LOCATIONS.filter(([c, s]) =>
                      c.toLowerCase().includes(candLocSearch.toLowerCase()) ||
                      s.toLowerCase().includes(candLocSearch.toLowerCase())
                    ).map(([city, state]) => {
                      const isSel = candLoc === city;
                      return (
                        <button
                          key={city}
                          type="button"
                          className={`tal-cand-loc ${isSel ? 'on' : ''}`}
                          onClick={() => setCandLoc(city)}
                        >
                          <div>
                            <b>{city}</b>
                            <small>{state}</small>
                          </div>
                          <i>{isSel ? '✓' : '›'}</i>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Candidate Step 3 (and 4): Current & Expected Compensation Range (Matches Boss Page Layout) */}
              {(step === 3 || step === 4) && (
                <section className="tal-boss-body">
                  <h1 className="tal-boss-title">What is your compensation range?</h1>
                  <p className="tal-boss-sub">Set your current and expected CTC in lakhs per annum.</p>

                  <div className="tal-boss-big-number" style={{ fontSize: '56px', margin: '14px 0 2px' }}>
                    ₹{candCurrentCtc} – {candExpectedCtc}
                  </div>
                  <div className="tal-boss-unit" style={{ marginBottom: '20px' }}>Lakhs Per Annum (LPA)</div>

                  {/* Dual CTC Cards: Current CTC & Expected CTC */}
                  <div className="tal-boss-ctc-dual-wrap">
                    {/* Current CTC Card */}
                    <div className="tal-boss-ctc-card active">
                      <div className="tal-boss-ctc-lbl">Current CTC</div>
                      <div className="tal-boss-ctc-val">{candCurrentCtc}</div>
                      <div className="tal-boss-ctc-unit">LPA</div>

                      <div className="tal-boss-ctc-stepper">
                        <button
                          type="button"
                          className="tal-boss-ctc-step-btn"
                          onClick={() => setCandCurrentCtc((c) => Math.max(1, c - 1))}
                        >
                          -
                        </button>
                        <button
                          type="button"
                          className="tal-boss-ctc-step-btn"
                          onClick={() => setCandCurrentCtc((c) => Math.min(candExpectedCtc, c + 1))}
                        >
                          +
                        </button>
                      </div>

                      <input
                        type="range"
                        min="1"
                        max="60"
                        value={candCurrentCtc}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10);
                          setCandCurrentCtc(v);
                          if (v > candExpectedCtc) setCandExpectedCtc(v);
                        }}
                        style={{ width: '100%', marginTop: '16px', accentColor: '#ffffff' }}
                      />

                      <div className="tal-cand-vis" style={{ marginTop: '14px', justifyContent: 'center' }}>
                        <EyeOff size={14} />
                        <span>Hidden on your profile</span>
                      </div>
                    </div>

                    {/* Expected CTC Card */}
                    <div className="tal-boss-ctc-card active">
                      <div className="tal-boss-ctc-lbl">Expected CTC</div>
                      <div className="tal-boss-ctc-val">{candExpectedCtc}</div>
                      <div className="tal-boss-ctc-unit">LPA</div>

                      <div className="tal-boss-ctc-stepper">
                        <button
                          type="button"
                          className="tal-boss-ctc-step-btn"
                          onClick={() => setCandExpectedCtc((c) => Math.max(candCurrentCtc, c - 1))}
                        >
                          -
                        </button>
                        <button
                          type="button"
                          className="tal-boss-ctc-step-btn"
                          onClick={() => setCandExpectedCtc((c) => Math.min(80, c + 1))}
                        >
                          +
                        </button>
                      </div>

                      <input
                        type="range"
                        min="1"
                        max="80"
                        value={candExpectedCtc}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10);
                          setCandExpectedCtc(v);
                          if (v < candCurrentCtc) setCandCurrentCtc(v);
                        }}
                        style={{ width: '100%', marginTop: '16px', accentColor: '#ffffff' }}
                      />

                      <div className="tal-cand-vis" style={{ marginTop: '14px', justifyContent: 'center' }}>
                        <Eye size={14} color="#38bdf8" />
                        <span>Visible on your profile</span>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Candidate Step 5: AI Stack */}
              {step === 5 && (
                <section className="tal-boss-body">
                  <h1 className="tal-boss-title">What’s your AI stack?</h1>
                  <p className="tal-boss-sub">Pick up to 6 products you leverage daily.</p>

                  <label className="tal-boss-search">
                    <Search size={18} color="#a1a1aa" />
                    <input
                      type="text"
                      placeholder="Search products"
                      value={candAISearch}
                      onChange={(e) => setCandAISearch(e.target.value)}
                    />
                  </label>

                  <div className="tal-boss-chips">
                    {CAND_AI_STACK.filter((a) => a.toLowerCase().includes(candAISearch.toLowerCase())).map((tool) => {
                      const active = candAIStack.includes(tool);
                      return (
                        <button
                          key={tool}
                          type="button"
                          className={`tal-boss-chip ${active ? 'active' : ''}`}
                          onClick={() => {
                            setCandAIStack((prev) => {
                              if (prev.includes(tool)) return prev.filter((t) => t !== tool);
                              if (prev.length < 6) return [...prev, tool];
                              triggerToast('Maximum 6 AI tools allowed');
                              return prev;
                            });
                          }}
                        >
                          {active ? `✓ ${tool}` : tool}
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Candidate Step 6: Skills */}
              {step === 6 && (
                <section className="tal-boss-body">
                  <h1 className="tal-boss-title">Which skills do you want to use?</h1>
                  <p className="tal-boss-sub">Tap the ones you want to use every day.</p>

                  {/* Quick Skills Selection Bar */}
                  <div className="tal-fn-quick-bar">
                    <span>
                      {candSkills.length === 0 ? (
                        'No skills selected'
                      ) : (
                        <b style={{ color: '#38bdf8' }}>
                          {candSkills.length} skill{candSkills.length === 1 ? '' : 's'} selected
                        </b>
                      )}
                    </span>
                    <div className="tal-fn-quick-actions">
                      <button
                        type="button"
                        className="tal-fn-quick-action-btn"
                        onClick={() => {
                          setCandSkills(Array.from(new Set([...candSkills, ...candSkillsList])));
                        }}
                      >
                        + Select All Suggested
                      </button>
                      {candSkills.length > 0 && (
                        <button
                          type="button"
                          className="tal-fn-quick-action-btn"
                          onClick={() => setCandSkills([])}
                          style={{ color: '#ef4444' }}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="tal-boss-chips">
                    {candSkillsList.map((s) => {
                      const active = candSkills.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          className={`tal-boss-chip ${active ? 'active' : ''}`}
                          onClick={() => {
                            setCandSkills((prev) =>
                              prev.includes(s) ? prev.filter((i) => i !== s) : [...prev, s]
                            );
                          }}
                        >
                          {active ? `✓ ${s}` : s}
                        </button>
                      );
                    })}
                  </div>

                  <input
                    type="text"
                    className="tal-cand-addin"
                    placeholder="+ Something else, then press Enter"
                    value={candCustomSkill}
                    onChange={(e) => setCandCustomSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && candCustomSkill.trim()) {
                        const val = candCustomSkill.trim();
                        if (!candSkillsList.includes(val)) setCandSkillsList((prev) => [...prev, val]);
                        if (!candSkills.includes(val)) setCandSkills((prev) => [...prev, val]);
                        setCandCustomSkill('');
                      }
                    }}
                  />

                  <div className="tal-boss-brief" style={{ marginTop: '20px' }}>
                    <b>Your job search so far</b>
                    <span>
                      {candFn.join(', ') || 'Any function'} · {candExp} yrs · {candLoc || 'Any location'} ·{' '}
                      {candSkills.length ? candSkills.join(', ') : 'Any of these works'}
                    </span>
                  </div>
                </section>
              )}

              {/* Candidate Step 7: Add Resume & Confirm Domain */}
              {step === 7 && (
                <section className="tal-boss-body">
                  <h1 className="tal-boss-title">Final Step: Add your resume to activate profile</h1>
                  <p className="tal-boss-sub">Your profile will be stored in your respective domain on the Global Minds Home Page.</p>

                  {/* Candidate Name Input */}
                  <div style={{ width: '100%', maxWidth: '520px', margin: '0 auto 16px', textAlign: 'left' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#a1a1aa', fontWeight: 600, marginBottom: '6px' }}>
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      className="tal-cand-addin"
                      style={{ width: '100%', boxSizing: 'border-box', background: '#18181b', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', padding: '12px 16px' }}
                      placeholder="e.g. Siddharth Verma"
                      value={candName}
                      onChange={(e) => setCandName(e.target.value)}
                    />
                  </div>

                  {/* Respective Domain Selection for Home Page Storage */}
                  <div style={{ width: '100%', maxWidth: '520px', margin: '0 auto 20px', textAlign: 'left' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#a1a1aa', fontWeight: 600, marginBottom: '8px' }}>
                      Select Domain Category (Stored under this domain on Home Page)
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {PORTAL_DOMAINS.map((dom) => {
                        const active = (candCategory || inferDomain(candFn, candSkills)) === dom;
                        return (
                          <button
                            key={dom}
                            type="button"
                            className={`tal-boss-chip ${active ? 'active' : ''}`}
                            style={{ padding: '6px 14px', fontSize: '12.5px' }}
                            onClick={() => setCandCategory(dom)}
                          >
                            {active ? `✓ ${dom}` : dom}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Resume Upload Dropzone */}
                  <button
                    type="button"
                    className="tal-cand-zone"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  >
                    <Upload size={38} color="#ffffff" />
                    <strong>Tap to select resume (PDF or DOCX)</strong>
                    <small>
                      Supported formats: <em>PDF</em> <em>DOCX</em> · Max file size: <em>15MB</em>
                    </small>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];
                      if (file) {
                        setCandFile(file);
                        setCandResume(file.name);
                        if (!candName) {
                          const cleanName = file.name
                            .replace(/\.[^/.]+$/, '')
                            .replace(/[-_]/g, ' ')
                            .replace(/\b(resume|cv|latest|profile|candidate)\b/gi, '')
                            .trim();
                          if (cleanName.length > 2) {
                            setCandName(cleanName.replace(/\b\w/g, (l) => l.toUpperCase()));
                          }
                        }
                        triggerToast(`Resume attached: ${file.name}`);
                      }
                    }}
                  />

                  {candResume && (
                    <p style={{ textAlign: 'center', marginTop: '16px', color: '#10b981', fontWeight: 600 }}>
                      ✓ Attached: {candResume}
                    </p>
                  )}
                </section>
              )}

              {/* Candidate Step 8: Countdown Ready Screen */}
              {step === 8 && (
                <section className="tal-boss-body tal-boss-find-stage">
                  <h1 className="tal-boss-title">Building and storing your candidate profile…</h1>
                  <p className="tal-boss-sub">
                    Saving to <b>{candCategory || inferDomain(candFn, candSkills)}</b> domain on Home Page in {candCountdown}…
                  </p>

                  <div className="tal-boss-stack">
                    <div className="tal-boss-ph" />
                    <div className="tal-boss-ph" />
                    <div className="tal-boss-ph" />
                    <div className="tal-boss-mag">✓</div>
                  </div>

                  <div className="tal-boss-pb">
                    <div className="tal-boss-pb-track">
                      <i className="tal-boss-pb-fill" style={{ width: `${((3 - candCountdown) / 3) * 100}%` }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '14px', minWidth: '40px', textAlign: 'right' }}>
                      100%
                    </span>
                  </div>
                </section>
              )}

              {/* =============================================================
                  CANDIDATE STEP 9: BUILT CANDIDATE PROFILE DOSSIER
                  (Stored under respective domain on home page!)
                  ============================================================= */}
              {step === 9 && (
                <section className="tal-cand-profile-stage">
                  {/* Success Banner */}
                  <div className="tal-cand-success-banner">
                    <div className="tal-cand-success-icon-wrap">
                      <CheckCircle2 size={36} color="#10b981" />
                    </div>
                    <div>
                      <div className="tal-cand-success-title">
                        Candidate Profile Built &amp; Stored on Home Page!
                      </div>
                      <p className="tal-cand-success-sub">
                        Your profile is now stored under the <b style={{ color: '#ffffff' }}>"{createdCandidate?.category || candCategory || inferDomain(candFn, candSkills)}"</b> domain on the Global Minds home page. Verified bosses and CTOs can now explore your resume and request direct 48-hour interviews.
                      </p>
                    </div>
                  </div>

                  {/* Built Profile Card */}
                  <div className="tal-cand-profile-card">
                    {/* Profile Header */}
                    <div className="tal-cand-profile-head">
                      <div className="tal-cand-profile-identity">
                        <div className="tal-cand-profile-avatar">
                          {(createdCandidate?.name || candName || candFn[0] || 'GM').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="tal-cand-profile-name-row">
                            <h2 className="tal-cand-profile-name">
                              {createdCandidate?.name || candName || (candFn.length > 0 ? candFn.join(' & ') : 'Software Professional')}
                            </h2>
                            <span className="tal-cand-status-pill">
                              <span className="tal-status-indicator" />
                              Active in {createdCandidate?.category || candCategory || inferDomain(candFn, candSkills)}
                            </span>
                          </div>
                          <div className="tal-cand-profile-meta">
                            <span>💼 <b>{candExp} Years</b> Experience</span>
                            <span>•</span>
                            <span>📍 <b>{candLoc || 'Preferred Location'}</b></span>
                            <span>•</span>
                            <span style={{ color: '#34d399' }}>⚡ 48-Hour Direct Outreach</span>
                          </div>
                        </div>
                      </div>

                      <div className="tal-cand-profile-actions-top">
                        <button
                          type="button"
                          className="tal-btn-cand-modify"
                          onClick={() => goToStep(0)}
                        >
                          ✏ Modify Profile
                        </button>
                      </div>
                    </div>

                    {/* Stats & Compensation Strip */}
                    <div className="tal-cand-comp-strip">
                      <div className="tal-cand-comp-box">
                        <span className="tal-cand-comp-lbl">Expected CTC</span>
                        <span className="tal-cand-comp-val">₹{candExpectedCtc} LPA</span>
                        <span className="tal-cand-comp-note">Public to hiring bosses</span>
                      </div>

                      <div className="tal-cand-comp-box">
                        <span className="tal-cand-comp-lbl">Current CTC</span>
                        <span className="tal-cand-comp-val">₹{candCurrentCtc} LPA</span>
                        <span className="tal-cand-comp-note">Confidential to you</span>
                      </div>

                      <div className="tal-cand-comp-box">
                        <span className="tal-cand-comp-lbl">Target Role / Function</span>
                        <span className="tal-cand-comp-val" style={{ fontSize: '16px', fontWeight: 700 }}>
                          {candFn.join(', ') || 'Engineering'}
                        </span>
                        <span className="tal-cand-comp-note">Direct Boss Inbound</span>
                      </div>
                    </div>

                    {/* Uploaded Resume File */}
                    <div className="tal-cand-section-box">
                      <div className="tal-cand-section-lbl">Uploaded Verified Resume</div>
                      <div className="tal-cand-resume-file-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="tal-cand-file-icon">📄</div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '14.5px' }}>
                              {candResume || 'Verified_Resume_Document.pdf'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#10b981' }}>
                              ✓ Parsed &amp; Activated for Direct Boss Matching
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="tal-btn-cand-secondary"
                          onClick={() => goToStep(7)}
                        >
                          Replace File
                        </button>
                      </div>
                    </div>

                    {/* AI Stack Leveraged */}
                    {candAIStack.length > 0 && (
                      <div className="tal-cand-section-box">
                        <div className="tal-cand-section-lbl">Daily AI Stack &amp; Workflow Tools</div>
                        <div className="tal-cand-chips-display">
                          {candAIStack.map((tool) => (
                            <span key={tool} className="tal-cand-tag-chip">
                              ⚡ {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Verified Technical Skills */}
                    {candSkills.length > 0 && (
                      <div className="tal-cand-section-box">
                        <div className="tal-cand-section-lbl">Selected Core Competencies</div>
                        <div className="tal-cand-chips-display">
                          {candSkills.map((sk) => (
                            <span key={sk} className="tal-cand-tag-chip active">
                              ✓ {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Verification Checklist */}
                    <div className="tal-cand-checklist">
                      <div className="tal-cand-check-item">
                        <CheckCircle2 size={16} color="#10b981" />
                        <span>Profile published to verified Boss &amp; CTO discovery feed</span>
                      </div>
                      <div className="tal-cand-check-item">
                        <CheckCircle2 size={16} color="#10b981" />
                        <span>Zero recruiter commission: 100% direct interview requests</span>
                      </div>
                      <div className="tal-cand-check-item">
                        <CheckCircle2 size={16} color="#10b981" />
                        <span>Contact info protected until mutual interview confirmation</span>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="tal-cand-bottom-actions">
                      <button
                        type="button"
                        className="tal-btn-cand-primary"
                        onClick={handleDownloadCandProfile}
                      >
                        <Download size={15} />
                        <span>Download Profile Dossier</span>
                      </button>

                      <button
                        type="button"
                        className="tal-btn-cand-secondary"
                        onClick={() => {
                          const targetCat = createdCandidate?.category || candCategory || inferDomain(candFn, candSkills);
                          if (onGoHome) onGoHome(targetCat);
                        }}
                      >
                        <Home size={15} />
                        <span>View in {createdCandidate?.category || candCategory || inferDomain(candFn, candSkills)} Domain on Home</span>
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {/* Candidate Bottom CTA */}
              {step <= 7 && (
                <div className="tal-boss-foot">
                  <button
                    type="button"
                    className="tal-boss-cta"
                    disabled={isCandCtaDisabled()}
                    onClick={handleCandCtaClick}
                  >
                    {step === 5
                      ? `Continue (${candAIStack.length}/6)`
                      : step === 6
                      ? 'Save'
                      : 'Continue'}
                  </button>
                </div>
              )}
            </>
          )}

        </main>
      </div>

      {/* =====================================================================
          RESUME PREVIEW MODAL
          ===================================================================== */}
      {previewResumeTarget && (
        <div 
          className="tal-boss-modal-overlay"
          onClick={() => setPreviewResumeTarget(null)}
        >
          <div 
            className="tal-resume-preview-sheet"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Close */}
            <button
              type="button"
              className="tal-boss-modal-close"
              onClick={() => setPreviewResumeTarget(null)}
              aria-label="Close"
            >
              ✕
            </button>

            {/* Resume Header */}
            <div className="tal-resume-preview-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
                <div className="tal-resume-avatar" style={{ width: '52px', height: '52px', fontSize: '18px' }}>
                  {previewResumeTarget.initials}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
                    {previewResumeTarget.name}
                  </h2>
                  <div style={{ fontSize: '0.92rem', color: '#a1a1aa', marginTop: '2px' }}>
                    {previewResumeTarget.role} • <span style={{ color: '#ffffff', fontWeight: 600 }}>{previewResumeTarget.companyTag}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: '#d4d4d8', marginTop: '12px' }}>
                <span>📧 {previewResumeTarget.email}</span>
                <span>📞 {previewResumeTarget.phone}</span>
                <span>📍 {previewResumeTarget.location}</span>
                <span>💰 Expected: <b>{previewResumeTarget.ctc}</b></span>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="tal-resume-preview-section">
              <div className="tal-resume-preview-section-title">Executive Summary</div>
              <p style={{ fontSize: '14px', color: '#d4d4d8', lineHeight: 1.6, margin: 0 }}>
                {previewResumeTarget.summary}
              </p>
            </div>

            {/* Verified Technical Skills */}
            {Array.isArray(previewResumeTarget.skills) && previewResumeTarget.skills.length > 0 && (
              <div className="tal-resume-preview-section">
                <div className="tal-resume-preview-section-title">Verified Skills &amp; Competencies</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {previewResumeTarget.skills.map((sk) => (
                    <span key={sk} className="tal-resume-skill-tag matched" style={{ fontSize: '12px', padding: '4px 12px' }}>
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience History (if structured data available) */}
            {Array.isArray(previewResumeTarget.experienceHistory) && previewResumeTarget.experienceHistory.length > 0 && (
              <div className="tal-resume-preview-section">
                <div className="tal-resume-preview-section-title">Work Experience</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {previewResumeTarget.experienceHistory.map((exp, idx) => (
                    <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 700, fontSize: '15px', color: '#ffffff' }}>{exp.role}</span>
                        <span style={{ fontSize: '12.5px', color: '#a1a1aa' }}>{exp.period}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#34d399', fontWeight: 600, marginBottom: '8px' }}>
                        {exp.company}
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#d4d4d8', lineHeight: 1.5 }}>
                        {exp.bullets.map((b, bIdx) => (
                          <li key={bIdx} style={{ marginBottom: '4px' }}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Real PDF Resume Preview from Resumes folder */}
            {previewResumeTarget.filename && (
              <div className="tal-resume-preview-section">
                <div className="tal-resume-preview-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Verified Resume Document (PDF)</span>
                  <a
                    href={`/uploads/resumes/${encodeURIComponent(previewResumeTarget.filename)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '12px', color: '#60a5fa', textDecoration: 'underline' }}
                  >
                    Open in new tab ↗
                  </a>
                </div>
                <iframe
                  src={`/uploads/resumes/${encodeURIComponent(previewResumeTarget.filename)}`}
                  title={`${previewResumeTarget.name} Resume`}
                  style={{
                    width: '100%',
                    height: '520px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: '#ffffff',
                    marginTop: '8px'
                  }}
                />
              </div>
            )}

            {/* Education & Credentials */}
            <div className="tal-resume-preview-section">
              <div className="tal-resume-preview-section-title">Education &amp; Credentials</div>
              <div style={{ fontSize: '13.5px', color: '#d4d4d8', marginBottom: '8px' }}>
                🎓 {previewResumeTarget.education || 'Degree in Engineering'}
              </div>
              {Array.isArray(previewResumeTarget.certifications) && previewResumeTarget.certifications.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {previewResumeTarget.certifications.map((c) => (
                    <span key={c} style={{ fontSize: '12px', background: 'rgba(255, 255, 255, 0.06)', padding: '3px 10px', borderRadius: '6px', color: '#f3f4f7' }}>
                      🏅 {c}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action Bar inside Preview */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '18px' }}>
              <button
                type="button"
                className={`tal-btn-resume-shortlist ${(shortlist || []).some((s) => s.id === previewResumeTarget.id || (s.name && previewResumeTarget.name && s.name.toLowerCase().trim() === previewResumeTarget.name.toLowerCase().trim())) ? 'shortlisted' : ''}`}
                style={{ flex: 'none', padding: '0 20px', borderRadius: '10px' }}
                onClick={() => handleToggleCandidateShortlist(previewResumeTarget)}
              >
                <Bookmark size={15} fill={(shortlist || []).some((s) => s.id === previewResumeTarget.id || (s.name && previewResumeTarget.name && s.name.toLowerCase().trim() === previewResumeTarget.name.toLowerCase().trim())) ? '#000000' : 'none'} />
                <span>
                  {(shortlist || []).some((s) => s.id === previewResumeTarget.id || (s.name && previewResumeTarget.name && s.name.toLowerCase().trim() === previewResumeTarget.name.toLowerCase().trim())) ? 'Shortlisted ✓' : 'Shortlist Candidate'}
                </span>
              </button>

              <button
                type="button"
                className="tal-btn-resume-download"
                style={{ flex: 'none', padding: '0 24px', borderRadius: '10px' }}
                onClick={() => handleDownloadResume(previewResumeTarget)}
              >
                <Download size={15} />
                <span>Download Resume (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Confirmation Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '28px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#ffffff',
          color: '#09090b',
          padding: '10px 22px',
          borderRadius: '9999px',
          fontSize: '14px',
          fontWeight: 700,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
          zIndex: 1000,
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} color="#10b981" />
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
}
