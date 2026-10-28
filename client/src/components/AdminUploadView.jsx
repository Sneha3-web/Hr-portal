import React, { useState } from 'react';
import { 
  Upload, 
  FolderPlus, 
  FileText, 
  RefreshCw, 
  Trash2, 
  Eye, 
  Download, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck, 
  Layers,
  ChevronDown,
  Sparkles,
  LogOut
} from 'lucide-react';

const CATEGORY_DEFAULT_SKILLS = {
  'Full Stack Developer': 'React.js, Node.js, Express, MongoDB, REST APIs',
  'Java Developer': 'Core Java, Spring Boot, Hibernate, MySQL, REST APIs',
  'Python Developer': 'Python, Django, FastAPI, PostgreSQL, REST APIs',
  'Devops': 'Docker, Kubernetes, AWS, CI/CD, Linux, Terraform',
  'React.js Developer': 'React.js, Redux, JavaScript (ES6+), HTML5, CSS3',
  'Data Analyst': 'Python, SQL, Power BI, Excel, Pandas, Data Visualization',
  'Testing Role': 'Selenium, Manual Testing, JUnit, TestNG, API Testing',
  'Machine Learning': 'Python, TensorFlow, PyTorch, Scikit-learn, Data Modeling',
  'Frontend Developer': 'HTML5, CSS3, JavaScript, React.js, Responsive Design',
  'Node.js Developer': 'Node.js, Express, MongoDB, REST APIs, TypeScript',
  'Others': 'Problem Solving, Analytical Skills, Software Engineering'
};

export default function AdminUploadView({
  user,
  candidates,
  categories,
  onOpenUpload,
  onOpenAdmin,
  onViewResume,
  onDownloadResume,
  onDeleteCandidate,
  onRefreshData,
  onLogout
}) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  // Upload Form State
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Full Stack Developer',
    email: '',
    phone: '',
    experience: 'Fresher (2024 Batch)',
    education: 'B.E / B.Tech Computer Science',
    location: 'Bangalore',
    skills: '',
    bio: 'Certified developer trained in modern software development and industry best practices.'
  });

  // Handle file select
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-extract candidate name from filename if empty
      let rawName = selectedFile.name.replace(/\.[^/.]+$/, '');
      rawName = rawName.replace(/_Resume.*$/i, '')
                       .replace(/Resume.*$/i, '')
                       .replace(/_CV.*$/i, '')
                       .replace(/[-_.]+/g, ' ')
                       .trim();
      if (rawName && !formData.name) {
        setFormData((prev) => ({
          ...prev,
          name: rawName.replace(/\b\w/g, l => l.toUpperCase()),
          email: `${rawName.toLowerCase().replace(/\s+/g, '.')}@candidate.org`
        }));
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit single resume upload
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setStatusMessage({ type: 'error', text: 'Please enter the candidate name.' });
      return;
    }
    if (!file) {
      setStatusMessage({ type: 'error', text: 'Please attach a candidate resume file (PDF or DOCX).' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const data = new FormData();
      data.append('resume', file);

      const categorySkills = CATEGORY_DEFAULT_SKILLS[formData.category] || 'Problem Solving, Technical Aptitude';
      const emailValue = formData.email || `${formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '.')}@candidate.org`;

      const payload = {
        ...formData,
        email: emailValue,
        skills: categorySkills,
        experience: 'Fresher (2024 Batch)'
      };

      Object.keys(payload).forEach((key) => {
        data.append(key, payload[key]);
      });

      const res = await fetch('/api/candidates', {
        method: 'POST',
        body: data
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to upload candidate resume');

      setStatusMessage({
        type: 'success',
        text: `✓ Resume for "${formData.name}" uploaded successfully under "${formData.category}"!`
      });

      // Reset form
      setFile(null);
      setFormData({
        name: '',
        category: formData.category,
        email: '',
        phone: '',
        experience: 'Fresher (2024 Batch)',
        education: 'B.E / B.Tech Computer Science',
        location: 'Bangalore',
        skills: '',
        bio: ''
      });
      const fileInput = document.getElementById('admin-inline-file-input');
      if (fileInput) fileInput.value = '';

      if (onRefreshData) onRefreshData();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trigger 1-Click Desktop Folder Sync
  const handleDesktopSync = async () => {
    setIsSyncing(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/sync-resumes', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to sync Desktop resumes folder');
      setStatusMessage({
        type: 'success',
        text: `✓ Auto-synchronized ${data.total} student resumes from your Desktop folder!`
      });
      if (onRefreshData) onRefreshData();
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div style={{ padding: '28px 0 60px' }}>
      {/* Admin Title Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 32px',
        color: 'white',
        marginBottom: '26px',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <img
            src="/logo.jpg"
            alt="Global Minds Technologies"
            style={{
              height: '56px',
              width: 'auto',
              borderRadius: '10px',
              background: '#ffffff',
              padding: '4px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
              flexShrink: 0
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                background: '#2563eb',
                color: 'white',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}>
                ADMINISTRATOR ONLY
              </span>
              <span style={{ color: '#94a3b8', fontSize: '0.84rem' }}>
                Mr. Navaneeth • +91 95974 37333 • connect@globalminds.com
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 6px', color: '#ffffff' }}>
              Resume Upload Desk
            </h1>
            <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.92rem' }}>
              Global Minds Technologies — As an Administrator, you can upload new student resumes or auto-synchronize from your local Desktop folder.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {onOpenAdmin && (
            <button
              className="btn btn-primary"
              onClick={onOpenAdmin}
              style={{ padding: '10px 18px', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <FileText size={16} />
              <span>View Recruiter Callback Requests</span>
            </button>
          )}
          <button
            className="btn btn-outline"
            onClick={handleDesktopSync}
            disabled={isSyncing}
            style={{ padding: '10px 18px', background: '#1e293b', color: 'white', borderColor: '#475569' }}
          >
            <FolderPlus size={16} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Desktop Resumes'}</span>
          </button>

          {onLogout && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={onLogout}
              style={{
                padding: '10px 18px',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                borderColor: 'rgba(239, 68, 68, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Status Message Alert */}
      {statusMessage && (
        <div style={{
          padding: '14px 20px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: statusMessage.type === 'success' ? '#ecfdf5' : '#fef2f2',
          border: `1px solid ${statusMessage.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
          color: statusMessage.type === 'success' ? '#065f46' : '#991b1b',
          fontSize: '0.92rem',
          fontWeight: 600
        }}>
          {statusMessage.type === 'success' ? <CheckCircle2 size={20} color="#10b981" /> : <AlertCircle size={20} color="#ef4444" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* SECTION 1: INLINE RESUME UPLOAD FORM */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #bfdbfe',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        marginBottom: '36px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Upload size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                Upload Student Resume
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '0.84rem', color: '#64748b' }}>
                Select a resume document (PDF or DOCX), assign the domain category, and publish into the candidate pool.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleDesktopSync}
              disabled={isSyncing}
              title="Auto sync Desktop folder"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              <span>{isSyncing ? 'Syncing...' : '1-Click Desktop Folder Sync'}</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleUploadSubmit}>
          {/* File Dropzone */}
          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontWeight: 700 }}>Resume Document (PDF or Word DOCX) *</label>
            <div 
              className="file-dropzone"
              onClick={() => document.getElementById('admin-inline-file-input').click()}
              style={{
                border: file ? '2px solid #22c55e' : '2px dashed #93c5fd',
                background: file ? '#f0fdf4' : '#f8fafc',
                cursor: 'pointer',
                borderRadius: 'var(--radius-md)',
                padding: '24px 20px',
                textAlign: 'center',
                transition: 'all 0.2s'
              }}
            >
              <input
                id="admin-inline-file-input"
                type="file"
                accept=".pdf,.docx,.doc"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <FileText size={36} color={file ? '#16a34a' : '#3b82f6'} style={{ margin: '0 auto 8px' }} />
              {file ? (
                <div>
                  <div style={{ fontWeight: 700, color: '#15803d', fontSize: '0.96rem' }}>
                    ✓ Attached: {file.name}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '3px' }}>
                    Size: {(file.size / 1024).toFixed(1)} KB • Click to choose a different file
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '0.96rem' }}>
                    Click here to choose candidate PDF resume, or drag & drop
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '3px' }}>
                    Supports PDF, DOC, DOCX up to 15MB
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Candidate Full Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                required
                placeholder="e.g. S. Stephen Neel Kamal"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Domain Category *</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Java Developer">Java Developer</option>
                <option value="Python Developer">Python Developer</option>
                <option value="Devops">Devops</option>
                <option value="React.js Developer">React.js Developer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Testing Role">Testing Role</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Node.js Developer">Node.js Developer</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ padding: '11px 26px', fontSize: '0.94rem' }}
            >
              <Upload size={17} />
              <span>{isSubmitting ? 'Uploading Resume...' : 'Upload & Save Resume'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
