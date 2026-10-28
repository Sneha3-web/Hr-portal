const path = require('path');
const fs = require('fs');
const { supabase, isSupabaseConfigured } = require('./supabaseClient');

const isVercel = Boolean(process.env.VERCEL);
const DEFAULT_DATA_DIR = path.resolve(__dirname, 'data');
const DATA_DIR = isVercel ? path.join('/tmp', 'hr-data') : DEFAULT_DATA_DIR;

const CANDIDATES_FILE = path.join(DATA_DIR, 'candidates.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const HR_SESSIONS_FILE = path.join(DATA_DIR, 'hr_sessions.json');

// --- Helper: Local Fallback Readers & Writers ---
function readLocalJson(filePath, defaultValue = []) {
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
      return defaultValue;
    }
  }
  // Fallback to bundled data directory if running on Vercel
  const baseName = path.basename(filePath);
  const bundledPath = path.join(DEFAULT_DATA_DIR, baseName);
  if (fs.existsSync(bundledPath)) {
    try {
      return JSON.parse(fs.readFileSync(bundledPath, 'utf8'));
    } catch (err) {
      return defaultValue;
    }
  }
  return defaultValue;
}

function writeLocalJson(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing local json:', err.message);
  }
}

// Convert Supabase snake_case candidate to frontend camelCase candidate
function mapCandidateFromDb(c) {
  if (!c) return null;
  return {
    id: c.id,
    name: c.name,
    category: c.category,
    email: c.email || '',
    phone: c.phone || '',
    experience: c.experience || '',
    education: c.education || '',
    passingYear: c.passing_year,
    location: c.location || '',
    skills: Array.isArray(c.skills) ? c.skills : [],
    score: c.score !== null ? Number(c.score) : 85,
    rating: c.rating !== null ? Number(c.rating) : 4.5,
    status: c.status || 'Available',
    availability: c.availability || 'Immediate (0 - 15 Days)',
    college: c.college || '',
    cgpa: c.cgpa || '',
    github: c.github || '',
    linkedin: c.linkedin || '',
    portfolio: c.portfolio || '',
    source: c.source || 'Admin Desk',
    bio: c.bio || '',
    filename: c.filename || '',
    originalFilename: c.original_filename || c.filename || '',
    fileType: c.file_type || '.pdf',
    uploadedAt: c.uploaded_at || new Date().toISOString()
  };
}

// Convert camelCase candidate to snake_case for Supabase
function mapCandidateToDb(c) {
  return {
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
  };
}

// Convert Supabase inquiry to frontend inquiry
function mapInquiryFromDb(inq) {
  if (!inq) return null;
  return {
    id: inq.id,
    referenceId: inq.reference_id,
    companyName: inq.company_name,
    recruiterName: inq.recruiter_name,
    recruiterEmail: inq.recruiter_email,
    recruiterPhone: inq.recruiter_phone,
    roleTitle: inq.role_title,
    interviewDate: inq.interview_date,
    interviewMode: inq.interview_mode,
    ctcBudget: inq.ctc_budget,
    notes: inq.notes || inq.message || '',
    message: inq.message || inq.notes || '',
    candidates: inq.candidates || [],
    candidateCount: inq.candidate_count || 0,
    status: inq.status || 'New',
    createdAt: inq.created_at || new Date().toISOString()
  };
}

function mapInquiryToDb(inq) {
  return {
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
  };
}

// ==========================================
// DB SERVICE METHODS (Supabase + Local Fallback)
// ==========================================

async function getCandidates() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data.map(mapCandidateFromDb);
      }
      console.warn('Supabase getCandidates error, falling back to local JSON:', error?.message);
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local JSON:', err.message);
    }
  }
  return readLocalJson(CANDIDATES_FILE, []);
}

async function addCandidate(candidate) {
  // Always update local cache
  const localList = readLocalJson(CANDIDATES_FILE, []);
  localList.unshift(candidate);
  writeLocalJson(CANDIDATES_FILE, localList);

  if (isSupabaseConfigured && supabase) {
    try {
      const dbRecord = mapCandidateToDb(candidate);
      const { error } = await supabase.from('candidates').upsert([dbRecord], { onConflict: 'id' });
      if (error) console.error('Supabase addCandidate error:', error.message);
    } catch (err) {
      console.error('Supabase addCandidate failed:', err.message);
    }
  }
  return candidate;
}

async function deleteCandidate(id) {
  const localList = readLocalJson(CANDIDATES_FILE, []);
  const filtered = localList.filter(c => c.id !== id);
  writeLocalJson(CANDIDATES_FILE, filtered);

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('candidates').delete().eq('id', id);
      if (error) console.error('Supabase deleteCandidate error:', error.message);
    } catch (err) {
      console.error('Supabase deleteCandidate failed:', err.message);
    }
  }
}

async function getInquiries() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data.map(mapInquiryFromDb);
      }
      console.warn('Supabase getInquiries error, falling back to local JSON:', error?.message);
    } catch (err) {
      console.warn('Supabase inquiries fetch failed:', err.message);
    }
  }
  return readLocalJson(INQUIRIES_FILE, []);
}

async function addInquiry(inquiry) {
  const localList = readLocalJson(INQUIRIES_FILE, []);
  localList.unshift(inquiry);
  writeLocalJson(INQUIRIES_FILE, localList);

  if (isSupabaseConfigured && supabase) {
    try {
      const dbRecord = mapInquiryToDb(inquiry);
      const { error } = await supabase.from('inquiries').upsert([dbRecord], { onConflict: 'id' });
      if (error) console.error('Supabase addInquiry error:', error.message);
    } catch (err) {
      console.error('Supabase addInquiry failed:', err.message);
    }
  }
  return inquiry;
}

async function deleteInquiry(id) {
  const localList = readLocalJson(INQUIRIES_FILE, []);
  const filtered = localList.filter(i => i.id !== id);
  writeLocalJson(INQUIRIES_FILE, filtered);

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('inquiries').delete().eq('id', id);
      if (error) console.error('Supabase deleteInquiry error:', error.message);
    } catch (err) {
      console.error('Supabase deleteInquiry failed:', err.message);
    }
  }
}

async function getHRSessions() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('hr_sessions').select('*');
      if (!error && Array.isArray(data)) {
        const sessionMap = {};
        data.forEach(s => {
          sessionMap[s.email] = {
            id: s.id,
            name: s.name,
            email: s.email,
            phone: s.phone,
            companyName: s.company_name,
            role: s.role || 'hr',
            lastLoginAt: s.last_login_at,
            searchHistory: s.search_history || [],
            viewedCandidates: s.viewed_candidates || [],
            shortlist: s.shortlist || [],
            lastActiveDomain: s.last_active_domain,
            lastSearch: s.last_search
          };
        });
        return sessionMap;
      }
    } catch (err) {
      console.warn('Supabase getHRSessions failed:', err.message);
    }
  }
  return readLocalJson(HR_SESSIONS_FILE, {});
}

async function saveHRSession(email, sessionObj) {
  const sessions = readLocalJson(HR_SESSIONS_FILE, {});
  sessions[email] = sessionObj;
  writeLocalJson(HR_SESSIONS_FILE, sessions);

  if (isSupabaseConfigured && supabase) {
    try {
      const record = {
        email,
        id: sessionObj.id,
        name: sessionObj.name,
        phone: sessionObj.phone,
        company_name: sessionObj.companyName,
        role: sessionObj.role || 'hr',
        last_login_at: sessionObj.lastLoginAt || new Date().toISOString(),
        search_history: sessionObj.searchHistory || [],
        viewed_candidates: sessionObj.viewedCandidates || [],
        shortlist: sessionObj.shortlist || [],
        last_active_domain: sessionObj.lastActiveDomain || null,
        last_search: sessionObj.lastSearch || null
      };
      const { error } = await supabase.from('hr_sessions').upsert([record], { onConflict: 'email' });
      if (error) console.error('Supabase saveHRSession error:', error.message);
    } catch (err) {
      console.error('Supabase saveHRSession failed:', err.message);
    }
  }
}

module.exports = {
  getCandidates,
  addCandidate,
  deleteCandidate,
  getInquiries,
  addInquiry,
  deleteInquiry,
  getHRSessions,
  saveHRSession,
  isSupabaseConfigured
};
