require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const archiver = require('archiver');
const { syncResumes } = require('./syncResumes');
const { supabase, isSupabaseConfigured } = require('./supabaseClient');

const app = express();
const PORT = process.env.PORT || 5000;

// Directories
const isVercel = Boolean(process.env.VERCEL);
const BUNDLED_DATA_DIR = path.resolve(__dirname, 'data');
const BUNDLED_UPLOADS_DIR = path.resolve(__dirname, 'uploads/resumes');
const DATA_DIR = isVercel ? path.join('/tmp', 'hr-data') : BUNDLED_DATA_DIR;
const UPLOADS_DIR = isVercel ? path.join('/tmp', 'hr-uploads', 'resumes') : BUNDLED_UPLOADS_DIR;

const CANDIDATES_FILE = path.join(DATA_DIR, 'candidates.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const HR_SESSIONS_FILE = path.join(DATA_DIR, 'hr_sessions.json');
const JOBS_FILE = path.join(DATA_DIR, 'jobs.json');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'applications.json');

// Ensure dirs safely
try {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
} catch (err) {
  console.warn('Directory creation notice:', err.message);
}

// Safely seed initial data files from bundled directory if running on Vercel
function ensureDataFile(filename, defaultContent = []) {
  const targetPath = path.join(DATA_DIR, filename);
  const bundledPath = path.join(BUNDLED_DATA_DIR, filename);
  if (!fs.existsSync(targetPath)) {
    if (fs.existsSync(bundledPath)) {
      try {
        fs.copyFileSync(bundledPath, targetPath);
        return;
      } catch (err) {
        console.warn(`Failed to copy ${bundledPath} to ${targetPath}:`, err.message);
      }
    }
    try {
      fs.writeFileSync(targetPath, JSON.stringify(defaultContent, null, 2), 'utf8');
    } catch (err) {
      console.warn(`Failed to create ${targetPath}:`, err.message);
    }
  }
}

ensureDataFile('candidates.json', []);
ensureDataFile('categories.json', []);
ensureDataFile('inquiries.json', []);
ensureDataFile('hr_sessions.json', {});
ensureDataFile('jobs.json', []);
ensureDataFile('applications.json', []);

// Middleware
app.use(cors());
app.use(express.json());

// API Health check for Vercel / status
app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    name: 'HR Placement Portal API',
    version: '1.0.0',
    platform: isVercel ? 'Vercel Serverless' : 'Node Server',
    supabaseConnected: isSupabaseConfigured
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Helper: resolve resume file path checking active uploads and bundled uploads
function resolveResumeFilePath(filename) {
  if (!filename) return null;
  const activePath = path.join(UPLOADS_DIR, filename);
  if (fs.existsSync(activePath)) return activePath;
  const bundledPath = path.join(BUNDLED_UPLOADS_DIR, filename);
  if (fs.existsSync(bundledPath)) return bundledPath;
  return null;
}

// Serve uploaded resumes statically with inline viewing header for PDFs (check both active uploads and bundled uploads)
app.use('/uploads/resumes', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(UPLOADS_DIR), express.static(BUNDLED_UPLOADS_DIR));

// Helper functions
function getCandidates() {
  if (!fs.existsSync(CANDIDATES_FILE)) {
    const bundledCandidates = path.join(BUNDLED_DATA_DIR, 'candidates.json');
    if (fs.existsSync(bundledCandidates)) {
      try {
        return JSON.parse(fs.readFileSync(bundledCandidates, 'utf8'));
      } catch (e) {}
    }
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(CANDIDATES_FILE, 'utf8'));
  } catch (err) {
    return [];
  }
}

function saveCandidates(candidates) {
  try {
    fs.writeFileSync(CANDIDATES_FILE, JSON.stringify(candidates, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving candidates file:', err.message);
  }
  updateCategoriesCache(candidates);
  if (isSupabaseConfigured && supabase) {
    const formatted = candidates.map(c => ({
      id: c.id,
      name: c.name,
      category: c.category,
      email: c.email || null,
      phone: c.phone || null,
      experience: c.experience || null,
      education: c.education || null,
      passing_year: c.passingYear ? parseInt(c.passingYear) : null,
      location: c.location || null,
      skills: Array.isArray(c.skills) ? c.skills : [],
      score: c.score || 85,
      rating: c.rating || 4.5,
      status: c.status || 'Available',
      availability: c.availability || 'Immediate (0 - 15 Days)',
      college: c.college || null,
      cgpa: c.cgpa || null,
      github: c.github || null,
      linkedin: c.linkedin || null,
      portfolio: c.portfolio || null,
      source: c.source || 'Admin Desk',
      bio: c.bio || null,
      filename: c.filename || null,
      original_filename: c.originalFilename || null,
      file_type: c.fileType || null,
      uploaded_at: c.uploadedAt || new Date().toISOString()
    }));
    supabase.from('candidates').upsert(formatted, { onConflict: 'id' }).then(({ error }) => {
      if (error) console.error('Supabase candidates sync error:', error.message);
    });
  }
}

function getJobs() {
  if (!fs.existsSync(JOBS_FILE)) {
    const bundledJobs = path.join(BUNDLED_DATA_DIR, 'jobs.json');
    if (fs.existsSync(bundledJobs)) {
      try {
        return JSON.parse(fs.readFileSync(bundledJobs, 'utf8'));
      } catch (e) {}
    }
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(JOBS_FILE, 'utf8'));
  } catch (err) {
    return [];
  }
}

function saveJobs(jobs) {
  try {
    fs.writeFileSync(JOBS_FILE, JSON.stringify(jobs, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving jobs:', err.message);
  }
}

function getApplications() {
  if (!fs.existsSync(APPLICATIONS_FILE)) {
    const bundledApps = path.join(BUNDLED_DATA_DIR, 'applications.json');
    if (fs.existsSync(bundledApps)) {
      try {
        return JSON.parse(fs.readFileSync(bundledApps, 'utf8'));
      } catch (e) {}
    }
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(APPLICATIONS_FILE, 'utf8'));
  } catch (err) {
    return [];
  }
}

function saveApplications(apps) {
  try {
    fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(apps, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving applications:', err.message);
  }
}

function getInquiries() {
  if (!fs.existsSync(INQUIRIES_FILE)) {
    const bundledInq = path.join(BUNDLED_DATA_DIR, 'inquiries.json');
    if (fs.existsSync(bundledInq)) {
      try {
        return JSON.parse(fs.readFileSync(bundledInq, 'utf8'));
      } catch (e) {}
    }
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf8'));
  } catch (err) {
    return [];
  }
}

function saveInquiries(inquiries) {
  try {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving inquiries:', err.message);
  }
  if (isSupabaseConfigured && supabase) {
    const formatted = inquiries.map(inq => ({
      id: inq.id,
      reference_id: inq.referenceId || null,
      company_name: inq.companyName,
      recruiter_name: inq.recruiterName,
      recruiter_email: inq.recruiterEmail,
      recruiter_phone: inq.recruiterPhone,
      role_title: inq.roleTitle || null,
      interview_date: inq.interviewDate || null,
      interview_mode: inq.interviewMode || null,
      ctc_budget: inq.ctcBudget || null,
      notes: inq.notes || inq.message || null,
      message: inq.message || inq.notes || null,
      candidates: inq.candidates || [],
      candidate_count: inq.candidateCount || 0,
      status: inq.status || 'New',
      created_at: inq.createdAt || new Date().toISOString()
    }));
    supabase.from('inquiries').upsert(formatted, { onConflict: 'id' }).then(({ error }) => {
      if (error) console.error('Supabase inquiries sync error:', error.message);
    });
  }
}

function getHRSessions() {
  if (!fs.existsSync(HR_SESSIONS_FILE)) {
    const bundledSessions = path.join(BUNDLED_DATA_DIR, 'hr_sessions.json');
    if (fs.existsSync(bundledSessions)) {
      try {
        return JSON.parse(fs.readFileSync(bundledSessions, 'utf8'));
      } catch (e) {}
    }
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(HR_SESSIONS_FILE, 'utf8'));
  } catch (err) {
    return {};
  }
}

function saveHRSessions(sessions) {
  try {
    fs.writeFileSync(HR_SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf8');
    if (isSupabaseConfigured && supabase) {
      const sessionList = Object.keys(sessions).map(emailKey => {
        const s = sessions[emailKey];
        return {
          email: emailKey,
          id: s.id || null,
          name: s.name || null,
          phone: s.phone || null,
          company_name: s.companyName || null,
          role: s.role || 'hr',
          last_login_at: s.lastLoginAt || new Date().toISOString(),
          search_history: Array.isArray(s.searchHistory) ? s.searchHistory : [],
          viewed_candidates: Array.isArray(s.viewedCandidates) ? s.viewedCandidates : [],
          shortlist: Array.isArray(s.shortlist) ? s.shortlist : [],
          last_active_domain: s.lastActiveDomain || null,
          last_search: s.lastSearch || null
        };
      });
      supabase.from('hr_sessions').upsert(sessionList, { onConflict: 'email' }).then(({ error }) => {
        if (error) console.error('Supabase hr_sessions sync error:', error.message);
      });
    }
  } catch (err) {
    console.error('Error saving HR sessions:', err);
  }
}

function cleanHRSessionsShortlists() {
  try {
    const sessions = getHRSessions();
    const candidates = getCandidates();
    let changed = false;

    const scheduledIds = new Set(
      candidates.filter(c => c.scheduleDetails && c.scheduleDetails.date && c.scheduleDetails.time).map(c => c.id)
    );
    const scheduledNames = new Set(
      candidates.filter(c => c.scheduleDetails && c.scheduleDetails.date && c.scheduleDetails.time).map(c => (c.name || '').toLowerCase().trim())
    );

    Object.keys(sessions).forEach(key => {
      const s = sessions[key];
      if (Array.isArray(s.shortlist) && s.shortlist.length > 0) {
        const initialCount = s.shortlist.length;
        s.shortlist = s.shortlist.filter(item => {
          const normName = (item.name || '').toLowerCase().trim();
          return !scheduledIds.has(item.id) && !scheduledNames.has(normName);
        });
        s.shortlist = s.shortlist.map(item => {
          const live = candidates.find(c => c.id === item.id || (c.name && item.name && c.name.toLowerCase().trim() === item.name.toLowerCase().trim()));
          return live ? { ...item, ...live } : item;
        });

        if (s.shortlist.length !== initialCount) {
          changed = true;
        }
      }
    });

    if (changed) {
      saveHRSessions(sessions);
      console.log('✓ Cleaned up scheduled candidates from HR session shortlists');
    }
  } catch (err) {
    console.error('Error cleaning HR sessions shortlists:', err);
  }
}

function getHRSession(email) {
  if (!email) return null;
  const sessions = getHRSessions();
  const key = email.toLowerCase().trim();
  const session = sessions[key] || null;
  if (session && Array.isArray(session.shortlist)) {
    const candidates = getCandidates();
    const scheduledIds = new Set(
      candidates.filter(c => c.scheduleDetails && c.scheduleDetails.date && c.scheduleDetails.time).map(c => c.id)
    );
    const scheduledNames = new Set(
      candidates.filter(c => c.scheduleDetails && c.scheduleDetails.date && c.scheduleDetails.time).map(c => (c.name || '').toLowerCase().trim())
    );
    session.shortlist = session.shortlist
      .filter(item => !scheduledIds.has(item.id) && !scheduledNames.has((item.name || '').toLowerCase().trim()))
      .map(item => {
        const live = candidates.find(c => c.id === item.id || (c.name && item.name && c.name.toLowerCase().trim() === item.name.toLowerCase().trim()));
        return live ? { ...item, ...live } : item;
      });
  }
  return session;
}

function updateCategoriesCache(candidates) {
  const catSummary = {};
  for (const c of candidates) {
    catSummary[c.category] = (catSummary[c.category] || 0) + 1;
  }
  const categoryList = Object.keys(catSummary).map(catName => ({
    name: catName,
    count: catSummary[catName]
  }));
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categoryList, null, 2), 'utf8');
}

// Multer storage for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const cleanOrig = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E4);
    cb(null, `${uniqueSuffix}_${cleanOrig}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.pdf', '.docx', '.doc'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOC/DOCX documents are allowed'));
    }
  }
});

// Ensure candidates file is initialized
if (!fs.existsSync(CANDIDATES_FILE)) {
  fs.writeFileSync(CANDIDATES_FILE, JSON.stringify([], null, 2), 'utf8');
}

// Sync existing inquiries with candidate statuses on startup
function syncInquiriesWithCandidateStatuses() {
  try {
    const inquiries = getInquiries();
    const candidates = getCandidates();
    let changed = false;

    // Collect all scheduled candidate IDs and normalized names from inquiries
    const scheduledIds = new Map();
    const scheduledNames = new Map();

    inquiries.forEach(inq => {
      if (Array.isArray(inq.candidates) && inq.candidates.length > 0) {
        inq.candidates.forEach(inqCand => {
          const meta = {
            companyName: inq.companyName || 'Corporate Recruiter',
            interviewDate: inqCand.interviewDate || inq.interviewDate || 'Earliest Available',
            timeSlot: inqCand.timeSlot || '10:00 AM - 10:45 AM',
            scheduledAt: inq.createdAt || new Date().toISOString()
          };
          if (inqCand.id) scheduledIds.set(inqCand.id, meta);
          if (inqCand.name) scheduledNames.set(inqCand.name.toLowerCase().trim(), meta);
        });
      }
    });

    candidates.forEach(c => {
      const normName = (c.name || '').toLowerCase().trim();
      const meta = scheduledIds.get(c.id) || scheduledNames.get(normName);
      if (meta) {
        if (c.status !== 'Interview Scheduled' || !c.interviewScheduled) {
          c.status = 'Interview Scheduled';
          c.interviewScheduled = true;
          c.scheduledCompany = meta.companyName;
          c.scheduledDate = meta.interviewDate;
          c.scheduledSlot = meta.timeSlot;
          c.scheduledAt = meta.scheduledAt;
          changed = true;
        }
      }
    });

    if (changed) {
      saveCandidates(candidates);
      console.log('✓ Synced existing scheduled candidates from inquiries.json');
    }
  } catch (err) {
    console.error('Error syncing inquiry statuses:', err);
  }
}
syncInquiriesWithCandidateStatuses();
cleanHRSessionsShortlists();

// --- API ROUTES ---

// 1. Get Categories
app.get('/api/categories', (req, res) => {
  const candidates = getCandidates();
  const catMap = {};
  
  // Standard full domains
  const defaultDomains = [
    'Java Developer',
    'Python Developer',
    'Full Stack Developer',
    'React.js Developer',
    'Devops',
    'Data Analyst',
    'Machine Learning',
    'Testing Role',
    'Frontend Developer',
    'Node.js Developer',
    'Others'
  ];

  defaultDomains.forEach(domain => {
    catMap[domain] = 0;
  });

  candidates.forEach(c => {
    catMap[c.category] = (catMap[c.category] || 0) + 1;
  });

  const categories = Object.keys(catMap).map(name => ({
    name,
    count: catMap[name],
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  }));

  res.json({
    totalCandidates: candidates.length,
    categories
  });
});

// 2. Get Candidates with search, filtering, and pagination
app.get('/api/candidates', (req, res) => {
  let candidates = getCandidates();
  const { category, search, experience, location, minScore, sort } = req.query;

  // Filter by category
  if (category && category !== 'All Domains' && category !== 'all') {
    candidates = candidates.filter(c => c.category.toLowerCase() === category.toLowerCase());
  }

  // Filter by search (name, skills, education)
  if (search) {
    const q = search.toLowerCase().trim();
    candidates = candidates.filter(c => {
      const inName = c.name && c.name.toLowerCase().includes(q);
      const inSkills = Array.isArray(c.skills) && c.skills.some(s => s.toLowerCase().includes(q));
      const inCategory = c.category && c.category.toLowerCase().includes(q);
      const inEdu = c.education && c.education.toLowerCase().includes(q);
      const inLocation = c.location && c.location.toLowerCase().includes(q);
      return inName || inSkills || inCategory || inEdu || inLocation;
    });
  }

  // Filter by experience
  if (experience && experience !== 'all') {
    if (experience === 'fresher') {
      candidates = candidates.filter(c => (c.experience || '').toLowerCase().includes('fresher') || !c.experience.includes('Years'));
    } else if (experience === '1-3') {
      candidates = candidates.filter(c => {
        const yrs = parseInt(c.experience) || 0;
        return yrs >= 1 && yrs <= 3;
      });
    } else if (experience === '3+') {
      candidates = candidates.filter(c => {
        const yrs = parseInt(c.experience) || 0;
        return yrs >= 3;
      });
    }
  }

  // Filter by location
  if (location && location !== 'all') {
    candidates = candidates.filter(c => (c.location || '').toLowerCase().includes(location.toLowerCase()));
  }

  // Filter by min score
  if (minScore) {
    const scoreVal = parseInt(minScore, 10);
    if (!isNaN(scoreVal)) {
      candidates = candidates.filter(c => (c.score || 0) >= scoreVal);
    }
  }

  // Sorting
  if (sort === 'name_asc') {
    candidates.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } else if (sort === 'newest') {
    candidates.sort((a, b) => new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0));
  } else {
    // Default alphabetical by candidate name
    candidates.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }

  res.json({
    total: candidates.length,
    candidates
  });
});

// 3. Get single candidate
app.get('/api/candidates/:id', (req, res) => {
  const candidates = getCandidates();
  const candidate = candidates.find(c => c.id === req.params.id);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
  res.json(candidate);
});

// 3b. Schedule interview for candidate
app.post('/api/candidates/:id/schedule', (req, res) => {
  try {
    const candidates = getCandidates();
    const idx = candidates.findIndex(c => c.id === req.params.id);
    if (idx === -1) {
      // If candidate is a demo or frontend candidate, acknowledge success
      return res.json({ success: true, message: 'Interview scheduled', candidateId: req.params.id, scheduleDetails: req.body.scheduleDetails });
    }
    
    const { status, interviewScheduled, scheduleDetails } = req.body;
    candidates[idx].interviewScheduled = interviewScheduled !== undefined ? interviewScheduled : true;
    candidates[idx].status = status || 'Interview Scheduled';
    if (scheduleDetails) {
      candidates[idx].scheduleDetails = scheduleDetails;
    }
    saveCandidates(candidates);
    res.json({ success: true, candidate: candidates[idx] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3c. Cancel scheduled interview
app.delete('/api/candidates/:id/schedule', (req, res) => {
  try {
    const candidates = getCandidates();
    const idx = candidates.findIndex(c => c.id === req.params.id);
    if (idx === -1) {
      return res.json({ success: true, message: 'Interview cancelled', candidateId: req.params.id });
    }
    
    candidates[idx].interviewScheduled = false;
    candidates[idx].status = 'Shortlisted';
    delete candidates[idx].scheduleDetails;
    saveCandidates(candidates);
    res.json({ success: true, candidate: candidates[idx] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Upload & create candidate (Admin)
app.post('/api/candidates', upload.single('resume'), (req, res) => {
  try {
    const { 
      name, 
      category, 
      email, 
      phone, 
      experience, 
      education, 
      passingYear, 
      location, 
      skills, 
      bio, 
      score, 
      rating,
      college,
      cgpa,
      github,
      linkedin,
      portfolio,
      source
    } = req.body;
    
    if (!name || !category) {
      return res.status(400).json({ error: 'Candidate name and category are required' });
    }

    let parsedSkills = [];
    if (typeof skills === 'string') {
      parsedSkills = skills.split(',').map(s => s.trim()).filter(Boolean);
    } else if (Array.isArray(skills)) {
      parsedSkills = skills;
    }

    const candidateId = 'cand_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
    const filename = req.file ? req.file.filename : null;
    const originalFilename = req.file ? req.file.originalname : null;

    const newCandidate = {
      id: candidateId,
      name: name.trim(),
      category: category.trim(),
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@candidate.org`,
      phone: phone || '+91 9876543210',
      experience: experience || 'Fresher',
      education: education || 'B.E / B.Tech Computer Science',
      passingYear: parseInt(passingYear, 10) || 2024,
      location: location || 'Bangalore',
      skills: parsedSkills.length ? parsedSkills : ['Core Skills', 'Problem Solving'],
      score: parseInt(score, 10) || 90,
      rating: parseFloat(rating) || 4.8,
      status: 'Available',
      availability: 'Immediate (0 - 15 Days)',
      college: college ? college.trim() : '',
      cgpa: cgpa ? cgpa.trim() : '',
      github: github ? github.trim() : '',
      linkedin: linkedin ? linkedin.trim() : '',
      portfolio: portfolio ? portfolio.trim() : '',
      source: source || 'Student Portal Submission',
      bio: bio || `Dedicated ${category} trained in industry best practices and practical project development.`,
      filename: filename,
      originalFilename: originalFilename,
      fileType: filename ? path.extname(filename).toLowerCase() : '.pdf',
      uploadedAt: new Date().toISOString()
    };

    const candidates = getCandidates();
    candidates.unshift(newCandidate);
    saveCandidates(candidates);

    res.status(201).json({
      message: 'Candidate and resume uploaded successfully',
      candidate: newCandidate
    });
  } catch (err) {
    console.error('Error creating candidate:', err);
    res.status(500).json({ error: err.message });
  }
});

// 4b. Candidate Mode: Create & Store Candidate Profile in Respective Domain
app.post('/api/candidate-profile', upload.single('resume'), (req, res) => {
  try {
    const {
      name,
      targetFunction,
      category,
      experience,
      location,
      expectedCtc,
      currentCtc,
      skills,
      aiStack,
      bio,
      email,
      phone,
      education
    } = req.body;

    let parsedSkills = [];
    if (typeof skills === 'string') {
      try {
        parsedSkills = JSON.parse(skills);
      } catch (e) {
        parsedSkills = skills.split(',').map(s => s.trim()).filter(Boolean);
      }
    } else if (Array.isArray(skills)) {
      parsedSkills = skills;
    }

    let parsedAIStack = [];
    if (typeof aiStack === 'string') {
      try {
        parsedAIStack = JSON.parse(aiStack);
      } catch (e) {
        parsedAIStack = aiStack.split(',').map(s => s.trim()).filter(Boolean);
      }
    } else if (Array.isArray(aiStack)) {
      parsedAIStack = aiStack;
    }

    // Resolve domain category matching the home page domains
    function resolveCategory(cat, fn, skList) {
      if (cat && cat.trim() && cat !== 'Others' && cat !== 'all') return cat.trim();
      const combined = `${fn || ''} ${skList.join(' ')}`.toLowerCase();
      if (combined.includes('devops') || combined.includes('docker') || combined.includes('kubernetes') || combined.includes('aws') || combined.includes('cloud')) {
        return 'Devops';
      }
      if (combined.includes('python') || combined.includes('django') || combined.includes('fastapi') || combined.includes('flask')) {
        return 'Python Developer';
      }
      if (combined.includes('java') || combined.includes('spring') || combined.includes('hibernate')) {
        return 'Java Developer';
      }
      if (combined.includes('data analyst') || combined.includes('power bi') || combined.includes('tableau') || combined.includes('sql') || combined.includes('analytics')) {
        return 'Data Analyst';
      }
      if (combined.includes('machine learning') || combined.includes('pytorch') || combined.includes('tensorflow') || combined.includes('deep learning') || combined.includes('nlp')) {
        return 'Machine Learning';
      }
      if (combined.includes('testing') || combined.includes('qa') || combined.includes('selenium') || combined.includes('postman') || combined.includes('automation testing')) {
        return 'Testing Role';
      }
      if (combined.includes('frontend') || combined.includes('react') || combined.includes('vue') || combined.includes('next.js') || combined.includes('ui/ux')) {
        return 'Frontend Developer';
      }
      return 'Full Stack Developer';
    }

    const assignedCategory = resolveCategory(category, targetFunction, parsedSkills);
    const candName = name && name.trim() ? name.trim() : (targetFunction ? `${targetFunction} Specialist` : 'Candidate Engineer');
    const expNum = parseFloat(experience) || 2;
    const expStr = typeof experience === 'string' && experience.toLowerCase().includes('year') ? experience : `${expNum} Years`;
    const expCtcNum = parseFloat(expectedCtc) || 15;
    const curCtcNum = parseFloat(currentCtc) || 10;

    const candidateId = 'cand_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
    const filename = req.file ? req.file.filename : (req.body.filename || null);
    const originalFilename = req.file ? req.file.originalname : (req.body.originalFilename || req.body.filename || null);

    const newCandidate = {
      id: candidateId,
      name: candName,
      category: assignedCategory,
      targetFunction: targetFunction || 'Engineering',
      email: email || `${candName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@candidate.org`,
      phone: phone || '+91 98450 ' + Math.floor(10000 + Math.random() * 90000),
      experience: expStr,
      education: education || 'B.E / B.Tech Computer Science & Engineering',
      passingYear: 2024,
      location: location || 'Bengaluru',
      skills: parsedSkills.length ? parsedSkills : ['Full Stack Development', 'Problem Solving', 'System Design'],
      aiStack: parsedAIStack.length ? parsedAIStack : ['cursor', 'gemini', 'github copilot'],
      expectedCtc: expCtcNum,
      currentCtc: curCtcNum,
      score: 97,
      rating: 4.9,
      status: 'Available',
      availability: 'Immediate (0 - 15 Days)',
      isCandidateBuilt: true,
      source: 'Global Minds Candidate Builder',
      bio: bio || `Verified ${assignedCategory} profile built through Global Minds Candidate Portal. Specialized in ${(parsedSkills || []).slice(0, 4).join(', ') || 'modern engineering workflows'}.`,
      filename: filename,
      originalFilename: originalFilename,
      fileType: filename ? path.extname(filename).toLowerCase() : '.pdf',
      uploadedAt: new Date().toISOString()
    };

    const candidates = getCandidates();
    candidates.unshift(newCandidate);
    saveCandidates(candidates);

    console.log(`✓ Candidate profile created and stored in ${assignedCategory}: ${newCandidate.name}`);

    res.status(201).json({
      success: true,
      message: `Candidate profile stored in ${assignedCategory} domain successfully`,
      candidate: newCandidate
    });
  } catch (err) {
    console.error('Error creating candidate profile:', err);
    res.status(500).json({ error: err.message });
  }
});

// 5. Update candidate
app.put('/api/candidates/:id', (req, res) => {
  const candidates = getCandidates();
  const idx = candidates.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Candidate not found' });

  candidates[idx] = { ...candidates[idx], ...req.body, id: candidates[idx].id };
  saveCandidates(candidates);
  res.json({ message: 'Candidate updated successfully', candidate: candidates[idx] });
});

// 6. Delete candidate
app.delete('/api/candidates/:id', (req, res) => {
  let candidates = getCandidates();
  const candidate = candidates.find(c => c.id === req.params.id);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

  // Optionally delete file if exists
  if (candidate.filename) {
    const filePath = path.join(UPLOADS_DIR, candidate.filename);
    if (fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
    }
  }

  candidates = candidates.filter(c => c.id !== req.params.id);
  saveCandidates(candidates);
  res.json({ message: 'Candidate deleted successfully' });
});

// 7. Re-sync from Desktop Resumes folder
app.post('/api/sync-resumes', async (req, res) => {
  try {
    const synced = await syncResumes();
    res.json({
      message: 'Resumes synced successfully from Desktop',
      total: synced.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Download Single Resume (Supports both /api/candidates/:id/download and /api/resumes/download/:id)
const handleResumeDownload = (req, res) => {
  const candidates = getCandidates();
  const idOrName = req.params.id;
  const queryFilename = req.query.filename;
  const queryName = req.query.name;
  const queryCategory = req.query.category;

  // 1. Direct filename check if passed
  if (queryFilename) {
    const filePath = resolveResumeFilePath(queryFilename);
    if (filePath) {
      const ext = path.extname(queryFilename) || '.pdf';
      const cleanName = (queryName || 'Candidate').replace(/[^a-zA-Z0-9_-]/g, '_');
      const cleanCat = (queryCategory || 'Resume').replace(/[^a-zA-Z0-9_-]/g, '_');
      return res.download(filePath, `${cleanName}_${cleanCat}_Resume${ext}`);
    }
  }

  // 2. Candidate lookup in local candidates database
  let candidate = candidates.find(c => 
    c.id === idOrName || 
    (c.name && idOrName && c.name.toLowerCase().trim() === idOrName.toLowerCase().trim()) ||
    (c.filename && c.filename === idOrName)
  );

  // Fallback to verified builder presets if not in candidates.json
  if (!candidate) {
    const BUILDERS = [
      { id: 'res-1', name: 'Aryan Merchant', category: 'Technical Project Manager', exp: '4.5 Years', ctc: '22', skills: ['Jira Administration', 'Risk Management', 'Roadmap Planning'] },
      { id: 'res-2', name: 'Sanchit Tripathi', category: 'Engineering Program Manager', exp: '5.0 Years', ctc: '26', skills: ['Roadmap Planning', 'AI Automation', 'Cloud Architecture'] },
      { id: 'res-3', name: 'Aarav Kumar', category: 'Release Manager', exp: '3.5 Years', ctc: '18', skills: ['Release Management', 'Process Mapping'] },
      { id: 'res-4', name: 'Pooja Hegde', category: 'Software Localization Engineer', exp: '4.0 Years', ctc: '20', skills: ['Internationalization', 'QA Engineering'] },
      { id: 'res-5', name: 'Vikram Aditya', category: 'Lead Cloud Solutions Architect', exp: '6.0 Years', ctc: '30', skills: ['Cloud Architecture', 'ERP Integration'] }
    ];
    const builder = BUILDERS.find(b => b.id === idOrName || (b.name && idOrName && b.name.toLowerCase() === idOrName.toLowerCase()));
    if (builder) {
      candidate = {
        id: builder.id,
        name: builder.name,
        category: builder.category,
        experience: builder.exp,
        expectedCtc: builder.ctc,
        skills: builder.skills
      };
    } else if (queryName) {
      candidate = {
        id: idOrName,
        name: queryName,
        category: queryCategory || 'Software Engineer',
        skills: []
      };
    }
  }

  // 3. If candidate has a real file on disk
  if (candidate && candidate.filename) {
    const filePath = resolveResumeFilePath(candidate.filename);
    if (filePath) {
      const ext = path.extname(candidate.filename) || candidate.fileType || '.pdf';
      const cleanName = (candidate.name || 'Candidate').replace(/[^a-zA-Z0-9_-]/g, '_');
      const cleanCat = (candidate.category || 'Resume').replace(/[^a-zA-Z0-9_-]/g, '_');
      const downloadName = `${cleanName}_${cleanCat}_Resume${ext}`;
      return res.download(filePath, downloadName);
    }
  }

  // 4. Check if a file exists matching candidate name in UPLOADS_DIR or BUNDLED_UPLOADS_DIR
  if (candidate && candidate.name) {
    try {
      const allFiles = new Set([
        ...(fs.existsSync(UPLOADS_DIR) ? fs.readdirSync(UPLOADS_DIR) : []),
        ...(fs.existsSync(BUNDLED_UPLOADS_DIR) ? fs.readdirSync(BUNDLED_UPLOADS_DIR) : [])
      ]);
      const candNormName = candidate.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const matchedFile = Array.from(allFiles).find(f => {
        const fNorm = f.toLowerCase().replace(/[^a-z0-9]/g, '');
        return candNormName.length >= 3 && fNorm.includes(candNormName);
      });
      if (matchedFile) {
        const filePath = resolveResumeFilePath(matchedFile);
        if (filePath) {
          const ext = path.extname(matchedFile) || '.pdf';
          const cleanName = candidate.name.replace(/[^a-zA-Z0-9_-]/g, '_');
          const cleanCat = (candidate.category || 'Resume').replace(/[^a-zA-Z0-9_-]/g, '_');
          const downloadName = `${cleanName}_${cleanCat}_Resume${ext}`;
          return res.download(filePath, downloadName);
        }
      }
    } catch (e) {
      console.error('Error scanning uploads dir for resume:', e);
    }
  }

  // 5. Fallback: generate a structured text resume dossier with .txt extension (Guarantees Windows can open it!)
  const candName = (candidate && candidate.name) || queryName || 'Verified_Candidate';
  const safeName = candName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cat = (candidate && candidate.category) || queryCategory || 'Software Engineering';
  const textContent = `===========================================================
GLOBAL MINDS DIRECT HIRING - VERIFIED CANDIDATE DOSSIER
===========================================================
Candidate Name : ${candName}
Role / Domain  : ${cat}
Total Exp      : ${(candidate && candidate.experience) || '3+ Years'}
Location       : ${(candidate && candidate.location) || 'Bengaluru, India'}
Expected CTC   : ₹${(candidate && candidate.expectedCtc) || '12-18'} LPA
Current CTC    : ₹${(candidate && candidate.currentCtc) || '10'} LPA
Availability   : ${(candidate && candidate.availability) || 'Immediate (0-15 Days)'}
Contact Email  : ${(candidate && candidate.email) || 'candidate@globalminds.com'}
Contact Phone  : ${(candidate && candidate.phone) || '+91 98450 12345'}

EXECUTIVE SUMMARY:
${(candidate && candidate.bio) || (candidate && candidate.summary) || `Verified ${cat} professional pre-screened on Global Minds Direct Hiring Platform.`}

TECHNICAL COMPETENCIES & SKILLS:
${((candidate && candidate.skills) || ['Core Skills', 'Problem Solving']).join(', ')}

EDUCATION & QUALIFICATION:
${(candidate && candidate.education) || 'B.E / B.Tech Computer Science & Engineering'}
===========================================================
Status: Verified Candidate • Global Minds Direct Hiring Network
===========================================================`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${safeName}_Resume_Dossier.txt"`);
  return res.send(textContent);
};

app.get('/api/candidates/:id/download', handleResumeDownload);
app.get('/api/resumes/download/:id', handleResumeDownload);

// 9. Bulk Download Resumes as ZIP
app.post('/api/resumes/download-bulk', (req, res) => {
  const { candidateIds } = req.body;
  if (!Array.isArray(candidateIds) || candidateIds.length === 0) {
    return res.status(400).json({ error: 'No candidate IDs provided' });
  }

  const candidates = getCandidates().filter(c => candidateIds.includes(c.id) && c.filename);
  if (candidates.length === 0) {
    return res.status(404).json({ error: 'None of the selected candidates have downloadable resumes' });
  }

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="Candidates_Resumes_Pack_${Date.now()}.zip"`);

  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.pipe(res);

  candidates.forEach(c => {
    const filePath = resolveResumeFilePath(c.filename);
    if (filePath) {
      const fileNameInZip = `${c.category}/${c.name.replace(/\s+/g, '_')}_Resume${c.fileType || '.pdf'}`;
      archive.file(filePath, { name: fileNameInZip });
    }
  });

  archive.finalize();
});

// 10. Submit Hiring Inquiry / Schedule Interview Request (from HR)
app.post('/api/inquiries', (req, res) => {
  const {
    companyName,
    recruiterName,
    recruiterEmail,
    recruiterPhone,
    candidateIds,
    roleTitle,
    interviewDate,
    interviewMode, // Virtual, Face to Face, Telephonic
    ctcBudget,
    notes,
    message
  } = req.body;

  if (!companyName || !recruiterName || !recruiterEmail || !recruiterPhone) {
    return res.status(400).json({ error: 'Company Name, HR Name, Email, and Phone are required' });
  }

  const allCandidates = getCandidates();
  const candidateSchedules = req.body.candidateSchedules || [];

  // Prevent duplicate interview scheduling for candidates already scheduled (by ID or candidate name)
  const alreadyScheduled = [];
  (candidateIds || []).forEach(id => {
    const cand = allCandidates.find(c => c.id === id);
    if (!cand) return;
    const isScheduled = allCandidates.some(c =>
      (c.id === cand.id || (c.name && cand.name && c.name.toLowerCase().trim() === cand.name.toLowerCase().trim())) &&
      (c.interviewScheduled === true || c.status === 'Interview Scheduled')
    );
    if (isScheduled) {
      alreadyScheduled.push(cand);
    }
  });

  if (alreadyScheduled.length > 0) {
    return res.status(400).json({
      error: `Interview is already scheduled for: ${alreadyScheduled.map(c => c.name).join(', ')}. Already scheduled candidates cannot be re-scheduled.`
    });
  }

  const selectedStudents = (candidateIds || []).map(id => {
    const c = allCandidates.find(item => item.id === id);
    const sched = candidateSchedules.find(s => (s.candidateId || s.id) === id) || {};
    return c ? {
      id: c.id,
      name: c.name,
      category: c.category,
      experience: c.experience,
      interviewDate: sched.interviewDate || interviewDate || 'Earliest Available',
      timeSlot: sched.timeSlot || '10:00 AM - 10:45 AM',
      interviewMode: sched.interviewMode || 'Virtual (Google Meet / Zoom)',
      ctcBudget: sched.ctcBudget || '4.5 - 7.5 LPA',
      roundType: sched.roundType || 'Round 1 (Technical & Coding)',
      notes: sched.notes || ''
    } : null;
  }).filter(Boolean);

  const referenceId = 'REQ-' + Math.floor(100000 + Math.random() * 900000);
  const additionalMsg = notes || message || '';

  const newInquiry = {
    id: 'inq_' + Date.now().toString(36),
    referenceId,
    companyName,
    recruiterName,
    recruiterEmail,
    recruiterPhone,
    roleTitle: roleTitle || 'Software Engineer',
    interviewDate: interviewDate || 'Earliest Available',
    interviewMode: interviewMode || 'Online / Virtual (Google Meet / Zoom)',
    ctcBudget: ctcBudget || 'As per industry standards',
    notes: additionalMsg,
    message: additionalMsg,
    candidates: selectedStudents,
    candidateCount: selectedStudents.length,
    status: 'New', // New, Reviewing, Scheduled, Completed, Closed
    createdAt: new Date().toISOString()
  };

  const inquiries = getInquiries();
  inquiries.unshift(newInquiry);
  saveInquiries(inquiries);

  // Update candidate status to 'Interview Scheduled' and persist (updating all copies with matching ID or name)
  let updatedCandidates = false;
  const scheduledNamesSet = new Set();
  (candidateIds || []).forEach(id => {
    const target = allCandidates.find(item => item.id === id);
    if (target && target.name) scheduledNamesSet.add(target.name.toLowerCase().trim());
  });

  allCandidates.forEach(cand => {
    const normName = (cand.name || '').toLowerCase().trim();
    const isMatch = (candidateIds || []).includes(cand.id) || scheduledNamesSet.has(normName);
    if (isMatch) {
      const sched = candidateSchedules.find(s => (s.candidateId || s.id) === cand.id || (s.name && s.name.toLowerCase().trim() === normName)) || {};
      cand.status = 'Interview Scheduled';
      cand.interviewScheduled = true;
      cand.scheduledCompany = companyName;
      cand.scheduledDate = sched.interviewDate || interviewDate || 'Earliest Available';
      cand.scheduledSlot = sched.timeSlot || '10:00 AM - 10:45 AM';
      cand.scheduledAt = new Date().toISOString();
      updatedCandidates = true;
    }
  });

  if (updatedCandidates) {
    saveCandidates(allCandidates);
  }

  // Clean scheduled candidates from all HR session shortlists
  cleanHRSessionsShortlists();

  res.status(201).json({
    message: 'Interview request submitted successfully! Candidates marked as scheduled.',
    inquiry: newInquiry
  });
});

// 11. Get Inquiries (Admin)
app.get('/api/inquiries', (req, res) => {
  const inquiries = getInquiries();
  res.json(inquiries);
});

// 12. Update Inquiry Status (Admin)
app.patch('/api/inquiries/:id', (req, res) => {
  const inquiries = getInquiries();
  const idx = inquiries.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Inquiry not found' });

  inquiries[idx] = { ...inquiries[idx], ...req.body };
  saveInquiries(inquiries);
  res.json({ message: 'Inquiry updated successfully', inquiry: inquiries[idx] });
});

// 12b. Delete Inquiry (Admin)
app.delete('/api/inquiries/:id', (req, res) => {
  let inquiries = getInquiries();
  inquiries = inquiries.filter(i => i.id !== req.params.id);
  saveInquiries(inquiries);
  res.json({ message: 'Inquiry deleted successfully' });
});

// 13. HR / Admin Authentication
app.post('/api/auth/login', (req, res) => {
  const { email, password, role, companyName } = req.body;

  const validEmails = [
    'connect@globalminds.com',
    'admin@globalminds.com',
    'admin@globalmindstechnologies.com',
    'admin@trainingcenter.com',
    'navaneeth@globalminds.com',
    'navaneeth',
    'sneha@globalminds.com',
    'sneha'
  ];
  const isEmailMatch = validEmails.includes((email || '').toLowerCase().trim()) || 
                       (email || '').toLowerCase().includes('globalminds') || 
                       (email || '').toLowerCase().includes('admin');
  const isPassMatch = password === 'Globalminds@123' || password === 'admin123';

  // Admin Login (by role or by admin credentials)
  if (role === 'admin' || (password && isEmailMatch) || password === 'Globalminds@123') {
    if (isEmailMatch && isPassMatch) {
      return res.json({
        success: true,
        user: {
          id: 'admin_1',
          name: 'Mr. Navaneeth',
          email: 'connect@globalminds.com',
          phone: '9597437333',
          role: 'admin',
          institute: 'Global Minds Technologies'
        },
        token: 'token_admin_' + Date.now()
      });
    } else {
      return res.status(401).json({ error: 'Invalid admin credentials. Use connect@globalminds.com with password Globalminds@123' });
    }
  }

  // Company HR Login
  if (role === 'hr' || !role) {
    if (!email) return res.status(400).json({ error: 'Company email is required' });
    
    const key = email.toLowerCase().trim();
    const sessions = getHRSessions();
    const existing = sessions[key] || {};

    const company = companyName || existing.companyName || (key.split('@')[1] ? key.split('@')[1].split('.')[0].toUpperCase() : 'Tech Corp');
    const hrName = req.body.name || existing.name || key.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const phone = req.body.phone || existing.phone || '';

    const userObj = {
      id: existing.id || ('hr_' + Date.now().toString(36)),
      name: hrName,
      email: key,
      phone: phone,
      companyName: company,
      role: 'hr'
    };

    const sessionData = {
      ...existing,
      ...userObj,
      lastLoginAt: new Date().toISOString(),
      searchHistory: existing.searchHistory || [],
      viewedCandidates: existing.viewedCandidates || [],
      shortlist: existing.shortlist || [],
      lastActiveDomain: existing.lastActiveDomain || null,
      lastSearch: existing.lastSearch || null
    };

    sessions[key] = sessionData;
    saveHRSessions(sessions);

    return res.json({
      success: true,
      user: userObj,
      lastActiveDomain: sessionData.lastActiveDomain,
      lastSearch: sessionData.lastSearch,
      searchHistory: sessionData.searchHistory,
      viewedCandidates: sessionData.viewedCandidates,
      shortlist: sessionData.shortlist,
      token: 'token_hr_' + Date.now()
    });
  }

  res.status(400).json({ error: 'Invalid login request' });
});

// 13b. Admin: Get all registered HR recruiters for follow-up
app.get('/api/admin/hrs', (req, res) => {
  const sessions = getHRSessions();
  const hrsList = Object.keys(sessions).map(emailKey => {
    const s = sessions[emailKey];
    return {
      email: s.email || emailKey,
      name: s.name || 'Recruiter',
      companyName: s.companyName || 'Company',
      phone: s.phone || '',
      lastLoginAt: s.lastLoginAt || null,
      lastActiveDomain: s.lastActiveDomain || null,
      searchCount: (s.searchHistory || []).length,
      searchedDomains: [...new Set((s.searchHistory || []).map(h => h.domain).filter(Boolean))],
      viewedCount: (s.viewedCandidates || []).length,
      shortlistCount: (s.shortlist || []).length,
      recentSearches: (s.searchHistory || []).slice(0, 3)
    };
  });

  hrsList.sort((a, b) => new Date(b.lastLoginAt || 0) - new Date(a.lastLoginAt || 0));

  res.json({
    total: hrsList.length,
    hrs: hrsList
  });
});

// 13c. HR Search History & Activity Endpoints
app.get('/api/hr/history', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email parameter is required' });

  const session = getHRSession(email);
  if (!session) {
    return res.json({
      email,
      lastActiveDomain: null,
      lastSearch: null,
      searchHistory: [],
      viewedCandidates: [],
      shortlist: []
    });
  }

  res.json({
    email,
    lastActiveDomain: session.lastActiveDomain || null,
    lastSearch: session.lastSearch || null,
    searchHistory: session.searchHistory || [],
    viewedCandidates: session.viewedCandidates || [],
    shortlist: session.shortlist || []
  });
});

// 13d. Save Shortlisted Candidates per HR
app.post('/api/hr/shortlist', (req, res) => {
  const { email, shortlist } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const key = email.toLowerCase().trim();
  const sessions = getHRSessions();
  const session = sessions[key] || {
    id: 'hr_' + Date.now().toString(36),
    email: key,
    role: 'hr'
  };

  session.shortlist = Array.isArray(shortlist) ? shortlist : [];
  sessions[key] = session;
  saveHRSessions(sessions);

  res.json({ success: true, shortlist: session.shortlist });
});

app.post('/api/hr/history', (req, res) => {
  const { email, domain, domainId, query, filters, resultsCount } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const key = email.toLowerCase().trim();
  const sessions = getHRSessions();
  const session = sessions[key] || {
    id: 'hr_' + Date.now().toString(36),
    email: key,
    name: email.split('@')[0],
    role: 'hr',
    searchHistory: [],
    viewedCandidates: []
  };

  const newSearchItem = {
    id: 'search_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    domain: domain || 'All Domains',
    domainId: domainId || null,
    query: (query || '').trim(),
    filters: filters || {},
    resultsCount: typeof resultsCount === 'number' ? resultsCount : 0,
    timestamp: new Date().toISOString()
  };

  let history = session.searchHistory || [];
  // Avoid duplicate adjacent searches
  history = history.filter(item => {
    const isSameDomain = (item.domain || '').toLowerCase() === (newSearchItem.domain || '').toLowerCase();
    const isSameQuery = (item.query || '').toLowerCase() === (newSearchItem.query || '').toLowerCase();
    const isSameExp = (item.filters?.experience || 'all') === (newSearchItem.filters?.experience || 'all');
    const isSameLoc = (item.filters?.location || 'all') === (newSearchItem.filters?.location || 'all');
    return !(isSameDomain && isSameQuery && isSameExp && isSameLoc);
  });

  history.unshift(newSearchItem);
  if (history.length > 30) history = history.slice(0, 30);

  session.searchHistory = history;
  if (domain && domain !== 'All Domains') {
    session.lastActiveDomain = domain;
  }
  session.lastSearch = newSearchItem;

  sessions[key] = session;
  saveHRSessions(sessions);

  res.json({
    success: true,
    message: 'Search recorded',
    lastActiveDomain: session.lastActiveDomain,
    lastSearch: session.lastSearch,
    searchHistory: session.searchHistory
  });
});

app.delete('/api/hr/history', (req, res) => {
  const { email, id } = req.query;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const key = email.toLowerCase().trim();
  const sessions = getHRSessions();
  const session = sessions[key];
  if (!session) return res.json({ success: true, searchHistory: [] });

  if (id === 'all' || !id) {
    session.searchHistory = [];
  } else {
    session.searchHistory = (session.searchHistory || []).filter(item => item.id !== id);
  }

  sessions[key] = session;
  saveHRSessions(sessions);

  res.json({
    success: true,
    message: 'Search history updated',
    searchHistory: session.searchHistory
  });
});

// 13c-1. HR & Boss Session Action Aliases
app.post('/api/hr-session/history', (req, res) => {
  const { email, historyEntry } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const key = email.toLowerCase().trim();
  const sessions = getHRSessions();
  const session = sessions[key] || { id: 'hr_' + Date.now().toString(36), email: key, role: 'hr', searchHistory: [], viewedCandidates: [] };
  let history = session.searchHistory || [];
  if (historyEntry) {
    history = history.filter(h => h.id !== historyEntry.id);
    history.unshift(historyEntry);
    if (history.length > 30) history = history.slice(0, 30);
  }
  session.searchHistory = history;
  sessions[key] = session;
  saveHRSessions(sessions);
  res.json({ success: true, searchHistory: session.searchHistory });
});

app.post('/api/hr-session/shortlist', (req, res) => {
  const { email, shortlist } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const key = email.toLowerCase().trim();
  const sessions = getHRSessions();
  const session = sessions[key] || { id: 'hr_' + Date.now().toString(36), email: key, role: 'hr', searchHistory: [], viewedCandidates: [] };
  session.shortlist = Array.isArray(shortlist) ? shortlist : [];
  sessions[key] = session;
  saveHRSessions(sessions);
  res.json({ success: true, shortlist: session.shortlist });
});

// 13d. Unified Candidate View Handler (Used when boss explores a resume)
const recordCandidateView = (req, res) => {
  const { email, candidate, candidateId, candidateName, category } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const cId = candidateId || (candidate ? candidate.id : null);
  if (!cId) return res.status(400).json({ error: 'Candidate ID or Candidate object is required' });

  const key = email.toLowerCase().trim();
  const sessions = getHRSessions();
  const session = sessions[key] || {
    id: 'hr_' + Date.now().toString(36),
    email: key,
    role: 'hr',
    searchHistory: [],
    viewedCandidates: []
  };

  const allCandidates = getCandidates();
  const liveCand = allCandidates.find(c => c.id === cId || (c.name && candidate?.name && c.name.toLowerCase().trim() === candidate.name.toLowerCase().trim())) || candidate || {};

  let viewed = session.viewedCandidates || [];
  viewed = viewed.filter(v => (v.candidateId || v.id) !== cId);

  const viewRecord = {
    candidateId: cId,
    id: cId,
    candidateName: liveCand.name || candidateName || 'Candidate',
    name: liveCand.name || candidateName || 'Candidate',
    category: liveCand.category || category || 'Engineering',
    experience: liveCand.experience || '1-2 Years',
    skills: liveCand.skills || [],
    filename: liveCand.filename || null,
    expectedCtc: liveCand.expectedCtc || '₹12-18 LPA',
    location: liveCand.location || 'Bengaluru',
    viewedAt: new Date().toISOString()
  };

  viewed.unshift(viewRecord);
  if (viewed.length > 50) viewed = viewed.slice(0, 50);

  session.viewedCandidates = viewed;
  sessions[key] = session;
  saveHRSessions(sessions);

  res.json({ success: true, viewedCandidates: session.viewedCandidates });
};

app.post('/api/hr/view-candidate', recordCandidateView);
app.post('/api/hr-session/viewed', recordCandidateView);

// 13e. Boss: Get Explored Resumes for specific Boss
app.get('/api/boss/viewed', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email parameter required' });

  const session = getHRSession(email);
  if (!session || !Array.isArray(session.viewedCandidates) || session.viewedCandidates.length === 0) {
    return res.json({ success: true, count: 0, candidates: [] });
  }

  const allCandidates = getCandidates();
  const enriched = session.viewedCandidates.map(v => {
    const cId = v.candidateId || v.id;
    const live = allCandidates.find(c => c.id === cId || (c.name && (v.candidateName || v.name) && c.name.toLowerCase().trim() === (v.candidateName || v.name).toLowerCase().trim()));
    return {
      ...(live || {}),
      ...v,
      viewedAt: v.viewedAt || new Date().toISOString()
    };
  });

  res.json({
    success: true,
    count: enriched.length,
    candidates: enriched
  });
});

// 13f. Boss: Get Selected / Scheduled Resumes for respective Boss
app.get('/api/boss/interviews', (req, res) => {
  const { email, companyName } = req.query;
  const inquiries = getInquiries();
  const allCandidates = getCandidates();

  const emailNorm = (email || '').toLowerCase().trim();
  const compNorm = (companyName || '').toLowerCase().trim();

  // Find inquiries for this boss
  const bossInquiries = inquiries.filter(inq => {
    const inqEmail = (inq.recruiterEmail || '').toLowerCase().trim();
    const inqComp = (inq.companyName || '').toLowerCase().trim();
    if (emailNorm && inqEmail === emailNorm) return true;
    if (compNorm && inqComp === compNorm) return true;
    return false;
  });

  // Collect scheduled candidate items with interview details
  const scheduledMap = new Map();

  bossInquiries.forEach(inq => {
    if (Array.isArray(inq.candidates)) {
      inq.candidates.forEach(cand => {
        const liveCand = allCandidates.find(c => c.id === cand.id || (c.name && cand.name && c.name.toLowerCase().trim() === cand.name.toLowerCase().trim())) || {};
        const key = cand.id || (cand.name ? cand.name.toLowerCase().trim() : Math.random().toString());
        const merged = {
          ...liveCand,
          ...cand,
          scheduledCompany: inq.companyName,
          interviewDate: cand.interviewDate || inq.interviewDate || 'Earliest Available',
          timeSlot: cand.timeSlot || '10:00 AM - 10:45 AM',
          interviewMode: cand.interviewMode || inq.interviewMode || 'Virtual (Google Meet / Zoom)',
          ctcBudget: cand.ctcBudget || inq.ctcBudget || '4.5 - 7.5 LPA',
          notes: cand.notes || inq.notes || '',
          scheduledAt: inq.createdAt,
          referenceId: inq.referenceId
        };
        scheduledMap.set(key, merged);
      });
    }
  });

  // Also check candidates in candidates.json where scheduledCompany matches
  if (compNorm) {
    allCandidates.forEach(cand => {
      const cComp = (cand.scheduledCompany || '').toLowerCase().trim();
      const key = cand.id || (cand.name ? cand.name.toLowerCase().trim() : '');
      if (cand.interviewScheduled === true && cComp && cComp === compNorm && !scheduledMap.has(key)) {
        scheduledMap.set(key, {
          ...cand,
          interviewDate: cand.scheduledDate || 'Earliest Available',
          timeSlot: cand.scheduledSlot || '10:00 AM - 10:45 AM',
          interviewMode: 'Virtual (Google Meet / Zoom)',
          scheduledAt: cand.scheduledAt || new Date().toISOString()
        });
      }
    });
  }

  const scheduledList = Array.from(scheduledMap.values());
  res.json({
    success: true,
    count: scheduledList.length,
    candidates: scheduledList,
    inquiries: bossInquiries
  });
});

app.get('/api/hr/relevant-candidates', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const session = getHRSession(email);
  const candidates = getCandidates();

  if (!session || (!session.searchHistory || session.searchHistory.length === 0)) {
    return res.json({
      candidates: candidates.slice(0, 12),
      searchedDomains: [],
      searchedKeywords: []
    });
  }

  const searchedDomains = [...new Set(session.searchHistory.map(h => h.domain).filter(d => d && d !== 'All Domains'))];
  const searchedKeywords = [...new Set(session.searchHistory.map(h => (h.query || '').trim()).filter(q => q && q.length > 1))];

  // Score candidate relevance based on HR search history
  const scored = candidates.map(c => {
    let score = 0;
    const catLower = (c.category || '').toLowerCase();

    // Domain match
    searchedDomains.forEach(dom => {
      const dLower = dom.toLowerCase();
      if (catLower.includes(dLower) || dLower.includes(catLower)) {
        score += 15;
      }
    });

    // Keyword / skill matches
    searchedKeywords.forEach(kw => {
      const q = kw.toLowerCase();
      if (c.name && c.name.toLowerCase().includes(q)) score += 8;
      if (c.skills && c.skills.some(s => s.toLowerCase().includes(q))) score += 12;
      if (c.bio && c.bio.toLowerCase().includes(q)) score += 4;
    });

    return { candidate: c, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const relevantCandidates = scored.filter(item => item.score > 5).slice(0, 24).map(item => item.candidate);

  res.json({
    candidates: relevantCandidates.length > 0 ? relevantCandidates : candidates.slice(0, 12),
    searchedDomains,
    searchedKeywords
  });
});

// 14. Portal Stats
app.get('/api/stats', (req, res) => {
  const candidates = getCandidates();
  const inquiries = getInquiries();

  const domainCounts = {};
  candidates.forEach(c => {
    domainCounts[c.category] = (domainCounts[c.category] || 0) + 1;
  });

  res.json({
    totalCandidates: candidates.length,
    totalDomains: Object.keys(domainCounts).length,
    immediateJoiners: candidates.filter(c => (c.availability || '').includes('Immediate')).length,
    freshersCount: candidates.filter(c => (c.experience || '').toLowerCase().includes('fresher')).length,
    experiencedCount: candidates.filter(c => (c.experience || '').toLowerCase().includes('years')).length,
    interviewRequests: inquiries.length,
    domainCounts
  });
});

// --- BOSS JD BUILDER & TALENT MATCHING API ROUTES ---

// Helper: Match candidate against a job description
function matchCandidateToJob(job, candidate) {
  let score = 0;
  const matchingSkills = [];

  const jobRole = (job.role || job.title || job.category || '').toLowerCase();
  const candCat = (candidate.category || '').toLowerCase();
  const candRole = (candidate.roleTitle || '').toLowerCase();

  // 1. Role & Category Match (up to 35 pts)
  if (candCat && (candCat.includes(jobRole) || jobRole.includes(candCat))) {
    score += 35;
  } else if (candRole && (candRole.includes(jobRole) || jobRole.includes(candRole))) {
    score += 35;
  } else {
    const devWords = ['developer', 'engineer', 'lead', 'specialist', 'role'];
    const jobTokens = jobRole.split(' ').filter(w => !devWords.includes(w) && w.length > 2);
    const hasToken = jobTokens.some(t => candCat.includes(t) || candRole.includes(t));
    if (hasToken) score += 22;
    else score += 10;
  }

  // 2. Skills Match (up to 45 pts)
  const jobSkills = Array.isArray(job.skills) ? job.skills : [];
  const candSkills = Array.isArray(candidate.skills) ? candidate.skills : [];
  if (jobSkills.length > 0 && candSkills.length > 0) {
    const candLower = candSkills.map(s => s.toLowerCase().trim());
    jobSkills.forEach(js => {
      const jsLower = js.toLowerCase().trim();
      const matched = candLower.find(cs => cs.includes(jsLower) || jsLower.includes(cs));
      if (matched) {
        matchingSkills.push(js);
      }
    });

    const ratio = matchingSkills.length / jobSkills.length;
    score += Math.round(ratio * 45);
  } else {
    score += 20;
  }

  // 3. Experience Match (up to 10 pts)
  const jobExp = (job.experience || '').toLowerCase();
  const candExp = (candidate.experience || '').toLowerCase();
  if (jobExp && candExp) {
    if (jobExp.includes('fresher') && candExp.includes('fresher')) score += 10;
    else if (!jobExp.includes('fresher') && !candExp.includes('fresher')) score += 10;
    else score += 5;
  } else {
    score += 5;
  }

  // 4. Location Match (up to 10 pts)
  const isRemote = (job.workMode || '').toLowerCase().includes('remote') || (job.location || '').toLowerCase().includes('remote');
  const jobLoc = (job.location || '').toLowerCase();
  const candLoc = (candidate.location || '').toLowerCase();
  if (isRemote || candLoc.includes(jobLoc) || jobLoc.includes(candLoc)) {
    score += 10;
  } else {
    score += 4;
  }

  const matchScore = Math.min(99, Math.max(55, score));
  return {
    ...candidate,
    matchScore,
    matchingSkills
  };
}

// 1. Get all posted Jobs with optional filtering & matching
app.get('/api/jobs', (req, res) => {
  let jobs = getJobs();
  const { search, role, location, experience, talentSkills, talentRole, talentLocation } = req.query;

  // Search filter
  if (search) {
    const q = search.toLowerCase().trim();
    jobs = jobs.filter(j => 
      (j.title && j.title.toLowerCase().includes(q)) ||
      (j.role && j.role.toLowerCase().includes(q)) ||
      (j.companyName && j.companyName.toLowerCase().includes(q)) ||
      (j.location && j.location.toLowerCase().includes(q)) ||
      (Array.isArray(j.skills) && j.skills.some(s => s.toLowerCase().includes(q)))
    );
  }

  if (role && role !== 'All Roles') {
    jobs = jobs.filter(j => (j.role || j.category || '').toLowerCase().includes(role.toLowerCase()));
  }

  if (location && location !== 'all') {
    jobs = jobs.filter(j => (j.location || '').toLowerCase().includes(location.toLowerCase()));
  }

  if (experience && experience !== 'all') {
    jobs = jobs.filter(j => (j.experience || '').toLowerCase().includes(experience.toLowerCase()));
  }

  // If talent profile context is provided, calculate match score for each job
  if (talentSkills || talentRole) {
    const parsedSkills = talentSkills ? talentSkills.split(',').map(s => s.trim().toLowerCase()) : [];
    const tRole = (talentRole || '').toLowerCase();
    const tLoc = (talentLocation || '').toLowerCase();

    jobs = jobs.map(j => {
      let score = 55;
      const matchedSkills = [];
      const jSkills = Array.isArray(j.skills) ? j.skills : [];
      
      jSkills.forEach(js => {
        const jsLower = js.toLowerCase();
        if (parsedSkills.some(ps => ps.includes(jsLower) || jsLower.includes(ps))) {
          matchedSkills.push(js);
        }
      });

      if (jSkills.length > 0) {
        score += Math.round((matchedSkills.length / jSkills.length) * 30);
      }

      if (tRole && (j.role || j.title || '').toLowerCase().includes(tRole)) {
        score += 10;
      }

      if ((j.workMode || '').toLowerCase().includes('remote') || (tLoc && (j.location || '').toLowerCase().includes(tLoc))) {
        score += 4;
      }

      return {
        ...j,
        matchScore: Math.min(99, score),
        matchingSkills: matchedSkills
      };
    });

    jobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }

  res.json({ total: jobs.length, jobs });
});

// 2. Boss Creates & Publishes a new JD Card
app.post('/api/jobs', (req, res) => {
  try {
    const { 
      title, 
      role, 
      category, 
      companyName, 
      bossName, 
      bossEmail, 
      location, 
      workMode, 
      package: pkg, 
      experience, 
      skills, 
      description, 
      requirements 
    } = req.body;

    if (!title && !role) {
      return res.status(400).json({ error: 'Job title or role is required' });
    }

    const cleanSkills = Array.isArray(skills) 
      ? skills 
      : typeof skills === 'string' 
        ? skills.split(',').map(s => s.trim()).filter(Boolean)
        : [];

    const newJob = {
      id: 'job_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      title: title || `${role} Specialist`,
      role: role || title || 'Full Stack Developer',
      category: category || role || 'Engineering',
      companyName: companyName || 'High-Growth Tech Startup',
      bossName: bossName || 'Hiring Boss',
      bossEmail: bossEmail || 'boss@globalminds.com',
      location: location || 'Bengaluru',
      workMode: workMode || 'Hybrid',
      package: pkg || '₹10–18 LPA',
      experience: experience || '1-3 Years',
      skills: cleanSkills.length > 0 ? cleanSkills : ['React', 'Node.js', 'SQL'],
      description: description || `Looking for talented ${role} to join our engineering product group.`,
      requirements: requirements || `Demonstrated hands-on experience in ${(cleanSkills.slice(0, 3)).join(', ')}. Strong problem-solving abilities.`,
      applicantsCount: 0,
      createdAt: new Date().toISOString(),
      status: 'Active'
    };

    const jobs = getJobs();
    jobs.unshift(newJob);
    saveJobs(jobs);

    console.log(`✓ Boss created new JD: "${newJob.title}" at ${newJob.companyName}`);
    res.status(201).json({ message: 'Job Card posted successfully', job: newJob });
  } catch (err) {
    console.error('Error creating job:', err);
    res.status(500).json({ error: err.message });
  }
});

// 3. Delete a Job Card
app.delete('/api/jobs/:id', (req, res) => {
  let jobs = getJobs();
  const job = jobs.find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  jobs = jobs.filter(j => j.id !== req.params.id);
  saveJobs(jobs);

  // Clean applications for this job
  let apps = getApplications();
  apps = apps.filter(a => a.jobId !== req.params.id);
  saveApplications(apps);

  res.json({ message: 'Job deleted successfully' });
});

// 4. Boss gets Matched Candidate Profiles for a specific JD Card
app.get('/api/jobs/:id/matches', (req, res) => {
  const jobs = getJobs();
  const job = jobs.find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  const candidates = getCandidates();
  const matched = candidates.map(c => matchCandidateToJob(job, c));

  // Sort by highest match score
  matched.sort((a, b) => b.matchScore - a.matchScore);

  res.json({
    job,
    totalMatches: matched.length,
    matches: matched
  });
});

// 5. Talent applies to a Job Card
app.post('/api/jobs/:id/apply', (req, res) => {
  try {
    const jobs = getJobs();
    const jobIdx = jobs.findIndex(j => j.id === req.params.id);
    if (jobIdx === -1) return res.status(404).json({ error: 'Job not found' });

    const job = jobs[jobIdx];
    const { 
      candidateId, 
      candidateName, 
      candidateEmail, 
      candidatePhone, 
      candidateRole, 
      candidateExperience, 
      candidateLocation, 
      candidateSkills, 
      resumeUrl, 
      notes 
    } = req.body;

    const apps = getApplications();
    const alreadyApplied = apps.some(a => a.jobId === job.id && (a.candidateEmail === candidateEmail || a.candidateId === candidateId));
    if (alreadyApplied) {
      return res.status(400).json({ error: 'You have already applied to this job.' });
    }

    const cleanSkills = Array.isArray(candidateSkills) ? candidateSkills : [];
    const jobSkillsLower = (job.skills || []).map(s => s.toLowerCase());
    const matchedSkills = cleanSkills.filter(s => jobSkillsLower.some(js => js.includes(s.toLowerCase()) || s.toLowerCase().includes(js)));
    const matchScore = Math.min(99, Math.max(65, 60 + Math.round((matchedSkills.length / Math.max(1, (job.skills || []).length)) * 38)));

    const newApp = {
      id: 'app_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      bossName: job.bossName,
      bossEmail: job.bossEmail,
      candidateId: candidateId || ('cand_' + Date.now().toString(36)),
      candidateName: candidateName || 'Anonymous Builder',
      candidateEmail: candidateEmail || 'talent@globalminds.com',
      candidatePhone: candidatePhone || '',
      candidateRole: candidateRole || 'Software Engineer',
      candidateExperience: candidateExperience || '1-2 Years',
      candidateLocation: candidateLocation || 'Bengaluru',
      candidateSkills: cleanSkills,
      matchScore: matchScore,
      matchingSkills: matchedSkills,
      resumeUrl: resumeUrl || '',
      appliedAt: new Date().toISOString(),
      status: 'Applied',
      notes: notes || 'Direct applicant from Global Minds Talent Mode.'
    };

    apps.unshift(newApp);
    saveApplications(apps);

    // Increment applicantsCount on job
    jobs[jobIdx].applicantsCount = (jobs[jobIdx].applicantsCount || 0) + 1;
    saveJobs(jobs);

    console.log(`✓ Talent "${newApp.candidateName}" applied to "${job.title}" at ${job.companyName}`);
    res.status(201).json({ message: 'Application submitted successfully!', application: newApp });
  } catch (err) {
    console.error('Error applying to job:', err);
    res.status(500).json({ error: err.message });
  }
});

// 6. Boss gets Applicants for a specific Job Card
app.get('/api/jobs/:id/applicants', (req, res) => {
  const apps = getApplications().filter(a => a.jobId === req.params.id);
  res.json({ total: apps.length, applicants: apps });
});

// 7. Boss Shortlists an Applicant or Candidate for a Job
app.post('/api/jobs/:id/shortlist-candidate', (req, res) => {
  const { candidateId, status = 'Shortlisted' } = req.body;
  const apps = getApplications();
  let updated = false;

  apps.forEach(a => {
    if (a.jobId === req.params.id && a.candidateId === candidateId) {
      a.status = status;
      a.shortlistedAt = new Date().toISOString();
      updated = true;
    }
  });

  if (updated) {
    saveApplications(apps);
    return res.json({ message: `Candidate ${status.toLowerCase()} successfully!` });
  }

  // If not already in applications, add as shortlisted
  const candidates = getCandidates();
  const cand = candidates.find(c => c.id === candidateId);
  const jobs = getJobs();
  const job = jobs.find(j => j.id === req.params.id);

  if (cand && job) {
    const newApp = {
      id: 'app_' + Date.now().toString(36),
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      bossName: job.bossName,
      bossEmail: job.bossEmail,
      candidateId: cand.id,
      candidateName: cand.name,
      candidateEmail: cand.email || '',
      candidatePhone: cand.phone || '',
      candidateRole: cand.category,
      candidateExperience: cand.experience || '',
      candidateLocation: cand.location || '',
      candidateSkills: cand.skills || [],
      matchScore: 95,
      appliedAt: new Date().toISOString(),
      status: 'Shortlisted',
      notes: 'Directly shortlisted by Boss from matched profiles.'
    };
    apps.unshift(newApp);
    saveApplications(apps);
    job.applicantsCount = (job.applicantsCount || 0) + 1;
    saveJobs(jobs);
    return res.json({ message: 'Candidate shortlisted successfully!' });
  }

  res.status(404).json({ error: 'Candidate or Job not found' });
});

// 8. Talent views all their submitted Applications
app.get('/api/talent/applications', (req, res) => {
  const { email } = req.query;
  let apps = getApplications();
  if (email) {
    apps = apps.filter(a => (a.candidateEmail || '').toLowerCase() === email.toLowerCase());
  }
  res.json({ total: apps.length, applications: apps });
});

// Serve built client frontend if available
const clientDist = path.resolve(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

if (require.main === module && !process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`HR Portal Server running on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Error: Port ${PORT} is already in use by another process.`);
      console.error(`   To free port ${PORT} on Windows, run:\n   Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force\n`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
    }
  });

  process.on('SIGINT', () => {
    server.close(() => process.exit(0));
  });
  process.on('SIGTERM', () => {
    server.close(() => process.exit(0));
  });
}

module.exports = app;
