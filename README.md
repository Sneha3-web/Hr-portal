# Global Minds Technologies — "Hire From Us" Portal & Resume Hub

A complete, high-performance **Hire From Us** web application built with **React**, **Vite**, **JavaScript**, and **Node.js/Express**, designed for **Global Minds Technologies**.

This portal enables Global Minds Technologies to showcase, organize, and upload your pool of student resumes category-wise so that corporate recruiters and company HRs can browse, preview, shortlist, and schedule interviews or hire candidates directly.

---

## 🚀 Key Features

### 🏢 For Company HR & Recruiters
- **QSpiders-Style Domain Explorer**: Category-wise tabs with real-time candidate counts:
  - Full Stack Developers (React, Node.js, Express, MongoDB)
  - Java Developers (Core Java, Spring Boot, Microservices, Hibernate)
  - Python Developers (Django, FastAPI, PostgreSQL, REST APIs)
  - DevOps Engineers (AWS, Docker, Kubernetes, CI/CD, Terraform)
  - React.js / Frontend Developers
  - Data Analysts & Machine Learning
  - Software Testing / Automation QA (Selenium, TestNG, API Testing)
  - Node.js Developers & Others
- **Live Search & Multi-Filters**: Filter candidates by domain, experience level (Fresher 2024-2025, 1-3 Yrs, 3+ Yrs), preferred city (Bangalore, Chennai, Hyderabad, Pune, Remote), assessment scores, and sort options.
- **In-Browser PDF Resume Viewer**: Click **Preview** on any candidate to view the full PDF resume directly in an interactive modal viewer.
- **Direct Resume Download**: Instant download of the candidate's original resume file (`.pdf` or `.docx`).
- **Recruiter Shortlist & Bulk ZIP**: Add multiple candidates to a floating shortlist cart and download a compiled ZIP package of all selected resumes.
- **Interview Scheduling / Hire Request**: HR can submit an interview request with preferred dates, role title, CTC package, and interview mode (Virtual Google Meet/Teams or In-person). Generates an instant booking Reference ID (e.g. `REQ-945414`).
- **Placement Office Contact**: Dedicated corporate desk card with Placement Head Mr. Navaneeth (+91 95974 37333), direct email (connect@globalminds.com), and instant WhatsApp chat.

### 🛡️ For Training Center Staff & Admin
- **Single Resume Upload**: Upload student PDF/DOCX resumes with automated name extraction, category selection, skills tags, experience, and mock test scores.
- **1-Click Desktop Folder Sync**: Automatically scans and indexes all student resumes from `Desktop/Resumes/` across all domain subfolders (Data Analyst, DevOps, Frontend, Full Stack, Java, Python, Testing, etc.).
- **Candidate Pool Management**: Edit student profiles or remove placed candidates.
- **Recruiter Request Manager**: Review all incoming interview requests submitted by company HRs with full contact info, role requirements, and status tracking (`New` ➔ `Contacted` ➔ `Interview Scheduled` ➔ `Completed`).

---

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, JavaScript (ES6+), Lucide Icons, Canvas Confetti
- **Styling**: Vanilla CSS Design System with dark aesthetics, glassmorphism, responsive grid, and Google Fonts (`Plus Jakarta Sans` & `Inter`)
- **Backend**: Node.js & Express.js
- **File Storage**: Static resume storage in `server/uploads/resumes/`
- **Archive Engine**: `archiver` for bulk ZIP downloads

---

## 🏃 Quick Start Guide

### 1. Start the Backend Server (Port 5000)
```powershell
cd "c:\Users\sneha\OneDrive\Desktop\HR portal\server"
node server.js
```
The server will run on: `http://localhost:5000`

### 2. Start the Vite React Frontend (Port 5174 / 5173)
```powershell
cd "c:\Users\sneha\OneDrive\Desktop\HR portal\client"
npm run dev
```
Open your browser to: `http://localhost:5174` (or `http://localhost:5173`)

> **Note:** The backend on `http://localhost:5000` also directly serves the production build of the frontend, giving you a full-stack experience on a single port!

---

## 🔑 Login Accounts (Pre-configured)

### 🏢 Recruiter / HR Login
- Click **HR Login** in the top navbar.
- Enter your company name and email, or click one of the **1-Click Recruiter Presets** (e.g. *Infosys HR*, *Amazon Talent*, *Wipro Campus*).

### 🛡️ Global Minds Admin Login
- Click **Admin** in the top navbar.
- Click **Auto-fill Placement Admin Demo Credentials**:
  - **Email**: `connect@globalminds.com`
  - **Password**: `Globalminds@123`

---

## 🌐 Embedding Into Your Main Website

Once you are ready to integrate this page into your training center's website, you have three options:

### Option 1: Responsive Iframe Embed
Paste this snippet on your website's `/hire-from-us` page:
```html
<iframe 
  src="https://your-portal-url.com" 
  width="100%" 
  height="900px" 
  style="border: none; border-radius: 12px; overflow: hidden;"
  title="Hire From Us - Training Center Talent Pool"
></iframe>
```

### Option 2: Dedicated Subdomain (Recommended)
Host this application under a dedicated subdomain such as:
`hire.yourtrainingcenter.com` or `careers.yourtrainingcenter.com`
and link to it from your main website header navigation ("Hire From Us").

### Option 3: Direct Component Integration
Copy the `client/src/components/` into your existing React / Next.js website and connect the `/api` routes to your backend.

---

## ⚡ Deploy to Vercel (Step-by-Step)

This application is fully pre-configured for **1-click full-stack deployment on Vercel** (both Vite React frontend & Express API serverless backend in a single project).

### Method A: Deploy via GitHub (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Ready for Vercel deployment"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in.
   - Click **"Add New..."** ➔ **"Project"**.
   - Select your GitHub repository.
   - Leave the **Root Directory** as `./` (default).
   - The build settings are auto-detected via [`vercel.json`](file:///c:/Users/sneha/OneDrive/Desktop/HR%20portal/vercel.json):
     - **Build Command**: `npm run vercel-build`
     - **Output Directory**: `client/dist`

3. **Configure Environment Variables** (Optional, for Supabase DB):
   - In Project Settings ➔ **Environment Variables**, add:
     - `SUPABASE_URL`: `https://your-project-id.supabase.co`
     - `SUPABASE_KEY`: `your_supabase_anon_or_service_role_key`
   - *(If not provided, the app runs smoothly with the pre-seeded candidates in `/tmp` storage).*

4. **Click Deploy**:
   - Your application will be live at `https://<your-project>.vercel.app`!
   - Frontend is served globally on Vercel's Edge CDN.
   - All `/api/*` endpoints and `/uploads/*` resumes are powered by Vercel Serverless Functions.

---

### Method B: Deploy using Vercel CLI

Run this from the project root folder:
```powershell
npx vercel
```
Follow the interactive prompts:
- Set up and deploy? **Yes**
- Which scope? Select your personal/team account
- Link to existing project? **No**
- Project name: `hr-portal`
- In which directory is your code located? `./`
- Want to modify settings? **No** (Vercel automatically detects [`vercel.json`](file:///c:/Users/sneha/OneDrive/Desktop/HR%20portal/vercel.json))

When ready for production:
```powershell
npx vercel --prod
```

