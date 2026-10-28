require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const path = require('path');
const fs = require('fs');
const { supabase, isSupabaseConfigured } = require('../supabaseClient');

async function seed() {
  if (!isSupabaseConfigured || !supabase) {
    console.error('❌ Supabase is not configured yet!');
    console.error('Please configure SUPABASE_URL and SUPABASE_KEY in server/.env before running this migration.');
    process.exit(1);
  }

  console.log('🚀 Starting Supabase Migration...');

  const DATA_DIR = path.resolve(__dirname, '../data');
  const CANDIDATES_FILE = path.join(DATA_DIR, 'candidates.json');
  const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
  const HR_SESSIONS_FILE = path.join(DATA_DIR, 'hr_sessions.json');

  // 1. Seed Candidates
  if (fs.existsSync(CANDIDATES_FILE)) {
    try {
      const candidates = JSON.parse(fs.readFileSync(CANDIDATES_FILE, 'utf8'));
      console.log(`📦 Found ${candidates.length} candidates in candidates.json. Uploading to Supabase...`);

      const formattedCandidates = candidates.map(c => ({
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

      // Batch in chunks of 50
      for (let i = 0; i < formattedCandidates.length; i += 50) {
        const batch = formattedCandidates.slice(i, i + 50);
        const { error } = await supabase.from('candidates').upsert(batch, { onConflict: 'id' });
        if (error) {
          console.error(`⚠️ Error inserting candidates batch ${i}:`, error.message);
        } else {
          console.log(`  ✓ Inserted candidates ${i + 1} to ${Math.min(i + 50, formattedCandidates.length)}`);
        }
      }
    } catch (err) {
      console.error('Error processing candidates:', err.message);
    }
  }

  // 2. Seed Inquiries
  if (fs.existsSync(INQUIRIES_FILE)) {
    try {
      const inquiries = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf8'));
      console.log(`📦 Found ${inquiries.length} inquiries in inquiries.json. Uploading to Supabase...`);

      const formattedInquiries = inquiries.map(inq => ({
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
        candidates: Array.isArray(inq.candidates) ? inq.candidates : [],
        candidate_count: inq.candidateCount || 0,
        status: inq.status || 'New',
        created_at: inq.createdAt || new Date().toISOString()
      }));

      if (formattedInquiries.length > 0) {
        const { error } = await supabase.from('inquiries').upsert(formattedInquiries, { onConflict: 'id' });
        if (error) {
          console.error('⚠️ Error inserting inquiries:', error.message);
        } else {
          console.log(`  ✓ Successfully inserted ${formattedInquiries.length} inquiries`);
        }
      }
    } catch (err) {
      console.error('Error processing inquiries:', err.message);
    }
  }

  // 3. Seed HR Sessions
  if (fs.existsSync(HR_SESSIONS_FILE)) {
    try {
      const sessions = JSON.parse(fs.readFileSync(HR_SESSIONS_FILE, 'utf8'));
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

      console.log(`📦 Found ${sessionList.length} HR sessions. Uploading to Supabase...`);
      if (sessionList.length > 0) {
        const { error } = await supabase.from('hr_sessions').upsert(sessionList, { onConflict: 'email' });
        if (error) {
          console.error('⚠️ Error inserting HR sessions:', error.message);
        } else {
          console.log(`  ✓ Successfully inserted ${sessionList.length} HR sessions`);
        }
      }
    } catch (err) {
      console.error('Error processing HR sessions:', err.message);
    }
  }

  console.log('\n🎉 Supabase Migration Completed Successfully!');
}

seed().catch(console.error);
