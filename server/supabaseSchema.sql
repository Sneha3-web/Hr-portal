-- ==========================================================
-- HR PORTAL SUPABASE DATABASE SCHEMA
-- Run this script in your Supabase SQL Editor (SQL Editor -> New query)
-- ==========================================================

-- 1. Candidates Table
create table if not exists candidates (
  id text primary key,
  name text not null,
  category text not null,
  email text,
  phone text,
  experience text,
  education text,
  passing_year int,
  location text,
  skills jsonb default '[]'::jsonb,
  score numeric default 85,
  rating numeric default 4.5,
  status text default 'Available',
  availability text default 'Immediate (0 - 15 Days)',
  college text,
  cgpa text,
  github text,
  linkedin text,
  portfolio text,
  source text default 'Admin Desk',
  bio text,
  filename text,
  original_filename text,
  file_type text,
  uploaded_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS) & Public read for candidate discovery
alter table candidates enable row level security;
create policy "Allow public read access to candidates" on candidates
  for select using (true);
create policy "Allow all write access for candidates" on candidates
  for all using (true);


-- 2. Recruiter Callback & Interview Inquiries Table
create table if not exists inquiries (
  id text primary key,
  reference_id text,
  company_name text not null,
  recruiter_name text not null,
  recruiter_email text not null,
  recruiter_phone text not null,
  role_title text,
  interview_date text,
  interview_mode text,
  ctc_budget text,
  notes text,
  message text,
  candidates jsonb default '[]'::jsonb,
  candidate_count int default 0,
  status text default 'New',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table inquiries enable row level security;
create policy "Allow all access to inquiries" on inquiries
  for all using (true);


-- 3. HR Recruiter Sessions & Search History Table
create table if not exists hr_sessions (
  email text primary key,
  id text,
  name text,
  phone text,
  company_name text,
  role text default 'hr',
  last_login_at timestamp with time zone,
  search_history jsonb default '[]'::jsonb,
  viewed_candidates jsonb default '[]'::jsonb,
  shortlist jsonb default '[]'::jsonb,
  last_active_domain text,
  last_search text
);

alter table hr_sessions enable row level security;
create policy "Allow all access to hr_sessions" on hr_sessions
  for all using (true);

-- 4. Enable Realtime (Optional, for instant live updates)
alter publication supabase_realtime add table candidates;
alter publication supabase_realtime add table inquiries;
